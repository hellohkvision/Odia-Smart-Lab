package com.odiasmartlab.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.os.Handler;
import android.os.Looper;
import android.util.AtomicFile;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.PopupMenu;
import android.widget.LinearLayout;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** A separate, locally saved notes board for one PDF. */
public final class PdfNotesBoard extends FrameLayout {
    private final Activity activity;
    // Serialize reads and writes across reader instances, including a quick close/reopen.
    private static final ExecutorService io = Executors.newSingleThreadExecutor();
    private final Handler main = new Handler(Looper.getMainLooper());
    private final InkView ink;
    private final LinearLayout tools;
    private final Button pen, eraser, undo, redo, clear, more;
    private final TextView status;
    private volatile boolean closed;
    private File notesFile;
    private boolean ready, erasing;
    private int inkColor = Color.WHITE, columns;
    private int penSize = 9;

    public PdfNotesBoard(Activity activity) {
        super(activity);
        this.activity = activity;
        setBackgroundColor(Color.rgb(17, 20, 19));
        ink = new InkView();
        addView(ink, new FrameLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
        status = new TextView(activity);
        status.setGravity(Gravity.CENTER); status.setTextColor(Color.WHITE); status.setTextSize(12);
        status.setText("Loading notes…");
        FrameLayout.LayoutParams statusParams = new FrameLayout.LayoutParams(LayoutParams.MATCH_PARENT, dp(32), Gravity.TOP);
        addView(status, statusParams);
        tools = new LinearLayout(activity);
        tools.setOrientation(LinearLayout.HORIZONTAL); tools.setGravity(Gravity.CENTER);
        tools.setBackground(ReaderToolbar.surface(activity, Color.WHITE, 18));
        tools.setElevation(dp(5));
        pen = makeButton("pen", "Pen color and size", () -> choosePen());
        eraser = makeButton("eraser", "Eraser", () -> { erasing = true; updateButtons(); });
        undo = makeButton("undo", "Undo last board change", () -> ink.undo());
        redo = makeButton("redo", "Redo last board change", () -> ink.redo());
        clear = makeButton("clear", "Clear writing board", () -> confirmClear());
        more = makeButton("more", "More writing tools", this::showMore);
        FrameLayout.LayoutParams toolParams = new FrameLayout.LayoutParams(LayoutParams.WRAP_CONTENT, dp(48), Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL);
        toolParams.bottomMargin=dp(4);
        addView(tools, toolParams);
        addOnLayoutChangeListener((v,l,t,r,b,ol,ot,or,ob) -> {
            int next = r-l >= dp(268) ? 5 : r-l >= dp(216) ? 4 : 3;
            if (next != columns) configureTools(next);
        });
        configureTools(3);
        updateButtons();
    }

    private int dp(float n) { return Math.round(n * getResources().getDisplayMetrics().density); }
    private Button makeButton(String icon, String description, Runnable action) {
        Button button = new Button(activity);
        ReaderToolbar.apply(button, icon, description);
        button.setOnClickListener(v -> action.run());
        return button;
    }
    private void configureTools(int count) {
        columns = count; tools.removeAllViews();
        addTool(pen); addTool(eraser);
        if (count >= 4) addTool(undo);
        if (count == 5) { addTool(redo); addTool(clear); }
        else addTool(more);
    }
    private void addTool(Button button) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(dp(48), dp(48));
        lp.setMargins(dp(2), 0, dp(2), 0); tools.addView(button, lp);
    }
    private void showMore() {
        PopupMenu menu = new PopupMenu(activity, more);
        if (columns < 4) menu.getMenu().add(0,1,0,"Undo").setEnabled(undo.isEnabled());
        menu.getMenu().add(0,2,1,"Redo").setEnabled(redo.isEnabled());
        menu.getMenu().add(0,3,2,"Clear").setEnabled(clear.isEnabled());
        menu.setOnMenuItemClickListener(item -> {
            switch(item.getItemId()) {
                case 1: undo.performClick(); return true;
                case 2: redo.performClick(); return true;
                case 3: clear.performClick(); return true;
                default: return false;
            }
        });
        menu.show();
    }
    private void updateButtons() {
        pen.setEnabled(ready); eraser.setEnabled(ready); more.setEnabled(ready);
        undo.setEnabled(ready && !ink.undoStates.isEmpty());
        redo.setEnabled(ready && !ink.redoStates.isEmpty());
        clear.setEnabled(ready && !ink.strokes.isEmpty());
        pen.setSelected(ready && !erasing); eraser.setSelected(ready && erasing);
        pen.setContentDescription(!erasing ? "Pen selected, change color and size" : "Select pen and change color and size");
        eraser.setContentDescription(erasing ? "Eraser selected" : "Select eraser");
    }
    private android.widget.PopupWindow penPopup;
    private void choosePen() {
        if (!ready) return;
        erasing = false; updateButtons();
        if (penPopup != null && penPopup.isShowing()) { penPopup.dismiss(); return; }
        LinearLayout panel = new LinearLayout(activity);
        panel.setOrientation(LinearLayout.VERTICAL); panel.setPadding(dp(8),dp(6),dp(8),dp(6));
        panel.setBackground(ReaderToolbar.surface(activity, Color.WHITE, 16));
        int popupWidth = Math.min(dp(280), getResources().getDisplayMetrics().widthPixels - dp(16));
        LinearLayout colors = new LinearLayout(activity); colors.setGravity(Gravity.CENTER);
        final int[] choices = {Color.WHITE, Color.YELLOW, Color.rgb(250,100,100), Color.rgb(100,190,255), Color.rgb(130,230,155)};
        final String[] names = {"White","Yellow","Red","Blue","Green"};
        Button[] swatches = new Button[choices.length];
        Runnable updateColors = () -> {
            for (int j=0;j<choices.length;j++) {
                android.graphics.drawable.GradientDrawable circle = new android.graphics.drawable.GradientDrawable();
                circle.setShape(android.graphics.drawable.GradientDrawable.OVAL); circle.setColor(choices[j]);
                circle.setStroke(dp(j==indexOfColor(choices,inkColor)?3:1), j==indexOfColor(choices,inkColor)?Color.rgb(0,95,57):Color.rgb(190,198,193));
                swatches[j].setBackground(circle); swatches[j].setText(j==indexOfColor(choices,inkColor)?"✓":"");
                swatches[j].setTextColor(Color.rgb(0,65,39));
                swatches[j].setContentDescription(names[j]+" pen"+(j==indexOfColor(choices,inkColor)?", selected":""));
            }
        };
        for(int i=0;i<choices.length;i++) {
            final int index=i; Button button=new Button(activity); swatches[i]=button;
            button.setMinWidth(0);button.setMinimumWidth(0);button.setMinHeight(0);button.setMinimumHeight(0);
            button.setPadding(0,0,0,0);button.setElevation(0);button.setTextSize(16);
            LinearLayout.LayoutParams lp=new LinearLayout.LayoutParams(dp(48),dp(48));lp.setMargins(0,0,0,0);colors.addView(button,lp);
            button.setOnClickListener(v->{inkColor=choices[index];updateColors.run();});
        }
        updateColors.run();panel.addView(colors);
        View divider=new View(activity);divider.setBackgroundColor(Color.rgb(226,230,227));
        panel.addView(divider,new LinearLayout.LayoutParams(-1,dp(1)));
        LinearLayout sizes=new LinearLayout(activity);sizes.setGravity(Gravity.CENTER_VERTICAL);
        TextView sizeLabel=new TextView(activity);sizeLabel.setText("Stroke size");sizeLabel.setTextSize(12);sizeLabel.setTextColor(Color.rgb(48,55,51));
        panel.addView(sizeLabel);
        SeekBar slider=new SeekBar(activity);slider.setMax(23);slider.setProgress(penSize-1);slider.setContentDescription("Pen stroke size");
        if(android.os.Build.VERSION.SDK_INT>=21){slider.setProgressTintList(android.content.res.ColorStateList.valueOf(Color.rgb(35,54,45)));slider.setThumbTintList(android.content.res.ColorStateList.valueOf(Color.rgb(35,54,45)));}
        sizes.addView(slider,new LinearLayout.LayoutParams(0,dp(44),1f));
        View preview=new View(activity){
            private final Paint dot=new Paint(Paint.ANTI_ALIAS_FLAG);
            @Override protected void onDraw(Canvas canvas){super.onDraw(canvas);dot.setColor(inkColor);canvas.drawCircle(getWidth()/2f,getHeight()/2f,dp(2)+dp(7)*(penSize-1)/23f,dot);}
        };
        preview.setBackground(ReaderToolbar.surface(activity,Color.rgb(238,241,239),8));preview.setContentDescription("Stroke preview");
        LinearLayout.LayoutParams previewParams=new LinearLayout.LayoutParams(dp(32),dp(32));previewParams.setMargins(dp(6),0,0,0);sizes.addView(preview,previewParams);
        slider.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener(){
            @Override public void onProgressChanged(SeekBar bar,int progress,boolean fromUser){penSize=progress+1;preview.invalidate();}
            @Override public void onStartTrackingTouch(SeekBar bar){}
            @Override public void onStopTrackingTouch(SeekBar bar){}
        });
        for(Button swatch:swatches)swatch.setOnClickListener(v->{int index=java.util.Arrays.asList(swatches).indexOf(v);if(index>=0){inkColor=choices[index];updateColors.run();preview.invalidate();}});
        panel.addView(sizes);
        penPopup=new android.widget.PopupWindow(panel,popupWidth,android.view.ViewGroup.LayoutParams.WRAP_CONTENT,true);
        penPopup.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(Color.TRANSPARENT));
        penPopup.setOutsideTouchable(true);penPopup.setElevation(dp(8));
        panel.measure(View.MeasureSpec.makeMeasureSpec(popupWidth,View.MeasureSpec.EXACTLY),View.MeasureSpec.makeMeasureSpec(0,View.MeasureSpec.UNSPECIFIED));
        int[] location=new int[2];pen.getLocationOnScreen(location);
        int left=Math.max(dp(8),Math.min(location[0],getResources().getDisplayMetrics().widthPixels-popupWidth-dp(8)));
        penPopup.showAsDropDown(pen,left-location[0],-pen.getHeight()-panel.getMeasuredHeight()-dp(6));
    }
    private int indexOfColor(int[] colors,int color) {
        for(int i=0;i<colors.length;i++)if(colors[i]==color)return i;
        return -1;
    }
    private void confirmClear() {
        if (ready && !ink.strokes.isEmpty()) ink.clear();
    }

    public void openDocument(String key) {
        if (key == null || closed) return;
        ready = false; status.setText("Loading notes…"); status.setVisibility(VISIBLE); updateButtons();
        final String documentKey = key;
        io.execute(() -> {
            try {
                byte[] digest = MessageDigest.getInstance("SHA-256").digest(documentKey.getBytes(StandardCharsets.UTF_8));
                StringBuilder name = new StringBuilder();
                for (byte b : digest) name.append(String.format(Locale.ROOT, "%02x", b & 255));
                File directory = new File(activity.getFilesDir(), "pdf-notes");
                if (!directory.isDirectory() && !directory.mkdirs()) throw new java.io.IOException("Cannot create notes folder");
                File file = new File(directory, name + ".json");
                ArrayList<Stroke> saved = new ArrayList<>();
                if (file.exists() || new File(file.getPath() + ".bak").exists()) {
                    try (FileInputStream input = new AtomicFile(file).openRead(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                        byte[] bytes = new byte[8192]; int n;
                        while ((n = input.read(bytes)) != -1) { if (output.size() + n > 20 * 1024 * 1024) throw new java.io.IOException("Notes too large"); output.write(bytes, 0, n); }
                        JSONObject data = new JSONObject(output.toString("UTF-8"));
                        if (data.optInt("version") != 1) throw new java.io.IOException("Unsupported notes format");
                        JSONArray items = data.getJSONArray("strokes");
                        for (int i = 0; i < items.length(); i++) saved.add(Stroke.fromJson(items.getJSONObject(i)));
                    }
                }
                main.post(() -> {
                    if (closed) return;
                    notesFile = file; ink.strokes.clear(); ink.strokes.addAll(saved); ink.undoStates.clear(); ink.redoStates.clear();
                    ink.rebuild(); ready = true; status.setVisibility(GONE); updateButtons();
                });
            } catch (Exception error) {
                main.post(() -> { if (!closed) { status.setText("Notes could not be loaded"); Toast.makeText(activity, "Notes could not be loaded. Existing notes were kept.", Toast.LENGTH_LONG).show(); } });
            }
        });
    }
    private void saveNotes() {
        if (!ready || notesFile == null || closed) return;
        final File file = notesFile;
        final ArrayList<Stroke> snapshot = new ArrayList<>(ink.strokes);
        io.execute(() -> {
            AtomicFile atomic = new AtomicFile(file); FileOutputStream output = null;
            try {
                JSONArray data = new JSONArray(); for (Stroke stroke : snapshot) data.put(stroke.toJson());
                JSONObject root = new JSONObject(); root.put("version", 1); root.put("strokes", data);
                byte[] bytes = root.toString().getBytes(StandardCharsets.UTF_8);
                if (bytes.length > 20 * 1024 * 1024) throw new java.io.IOException("Notes too large");
                output = atomic.startWrite(); output.write(bytes); atomic.finishWrite(output); output = null;
            } catch (Exception error) {
                if (output != null) atomic.failWrite(output);
                main.post(() -> { if (!closed) Toast.makeText(activity, "Could not save notes on this device", Toast.LENGTH_LONG).show(); });
            }
        });
    }
    public void close() { closed = true; if (penPopup != null) penPopup.dismiss(); }

    private static final class Stroke {
        final int color; final float width; final boolean erase; final ArrayList<float[]> points = new ArrayList<>();
        Stroke(int color, float width, boolean erase) { this.color = color; this.width = width; this.erase = erase; }
        JSONObject toJson() throws Exception {
            JSONObject result = new JSONObject(); result.put("color", color); result.put("width", width); result.put("erase", erase);
            JSONArray list = new JSONArray(); for (float[] p : points) { JSONArray pair = new JSONArray(); pair.put((double)p[0]); pair.put((double)p[1]); list.put(pair); } result.put("points", list); return result;
        }
        static Stroke fromJson(JSONObject value) throws Exception {
            float width = (float)value.getDouble("width");
            if (Float.isNaN(width) || Float.isInfinite(width) || width <= 0f || width > 1f) throw new java.io.IOException("Invalid stroke width");
            Stroke stroke = new Stroke(value.getInt("color"), width, value.getBoolean("erase"));
            JSONArray list = value.getJSONArray("points");
            if (list.length() < 1 || list.length() > 100000) throw new java.io.IOException("Invalid stroke");
            for (int i = 0; i < list.length(); i++) {
                JSONArray pair = list.getJSONArray(i); float x = (float)pair.getDouble(0), y = (float)pair.getDouble(1);
                if (Float.isNaN(x) || Float.isInfinite(x) || Float.isNaN(y) || Float.isInfinite(y) || x < 0 || x > 1 || y < 0 || y > 1) throw new java.io.IOException("Invalid point");
                stroke.points.add(new float[]{x,y});
            }
            return stroke;
        }
    }

    private final class InkView extends View {
        final ArrayList<Stroke> strokes = new ArrayList<>();
        final ArrayDeque<ArrayList<Stroke>> undoStates = new ArrayDeque<>(), redoStates = new ArrayDeque<>();
        final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.DITHER_FLAG);
        Bitmap bitmap; Stroke current; int pointer = -1;
        InkView() { super(activity); setContentDescription("PDF notes writing board"); setFocusable(true); }
        @Override protected void onSizeChanged(int w,int h,int oldW,int oldH) { super.onSizeChanged(w,h,oldW,oldH); rebuild(); }
        void rebuild() {
            if (getWidth() <= 0 || getHeight() <= 0) return;
            if (bitmap == null || bitmap.getWidth() != getWidth() || bitmap.getHeight() != getHeight())
                bitmap = Bitmap.createBitmap(getWidth(), getHeight(), Bitmap.Config.ARGB_8888);
            else bitmap.eraseColor(Color.TRANSPARENT);
            Canvas c = new Canvas(bitmap); for (Stroke s : strokes) drawStroke(c,s); invalidate();
        }
        void drawStroke(Canvas canvas, Stroke stroke) {
            if (stroke == null || stroke.points.isEmpty()) return;
            paint.reset(); paint.setAntiAlias(true); paint.setDither(true); paint.setColor(stroke.color);
            paint.setStyle(Paint.Style.STROKE); paint.setStrokeCap(Paint.Cap.ROUND); paint.setStrokeJoin(Paint.Join.ROUND);
            paint.setStrokeWidth(Math.max(1f, stroke.width * Math.min(getWidth(),getHeight())));
            paint.setXfermode(stroke.erase ? new PorterDuffXfermode(PorterDuff.Mode.CLEAR) : null);
            float[] first = stroke.points.get(0);
            if (stroke.points.size() == 1) canvas.drawPoint(first[0]*getWidth(), first[1]*getHeight(), paint);
            else {
                Path path = new Path(); path.moveTo(first[0]*getWidth(),first[1]*getHeight());
                for (int i=1;i<stroke.points.size()-1;i++) {
                    float[] p=stroke.points.get(i),q=stroke.points.get(i+1);
                    path.quadTo(p[0]*getWidth(),p[1]*getHeight(),(p[0]+q[0])*getWidth()/2f,(p[1]+q[1])*getHeight()/2f);
                }
                float[] last=stroke.points.get(stroke.points.size()-1); path.lineTo(last[0]*getWidth(),last[1]*getHeight()); canvas.drawPath(path,paint);
            }
            paint.setXfermode(null);
        }
        @Override protected void onDraw(Canvas canvas) {
            super.onDraw(canvas); canvas.drawColor(Color.rgb(17,20,19));
            int layer=canvas.saveLayer(0,0,getWidth(),getHeight(),null);
            if (bitmap != null) canvas.drawBitmap(bitmap,0,0,null);
            if (current != null) drawStroke(canvas,current);
            canvas.restoreToCount(layer);
            // Show the eraser contact on the dark board while the user is erasing.
            if (current != null && current.erase && !current.points.isEmpty()) {
                float[] last = current.points.get(current.points.size()-1);
                Paint cursor = new Paint(Paint.ANTI_ALIAS_FLAG);
                cursor.setColor(Color.WHITE); cursor.setStyle(Paint.Style.FILL);
                canvas.drawCircle(last[0]*getWidth(), last[1]*getHeight(), dp(12), cursor);
            }
        }
        private void addPoint(float x,float y) {
            if (current == null || getWidth()<=0 || getHeight()<=0) return;
            float nx=Math.max(0,Math.min(1,x/getWidth())),ny=Math.max(0,Math.min(1,y/getHeight()));
            int count=current.points.size();
            if(count==0 || Math.hypot((nx-current.points.get(count-1)[0])*getWidth(),(ny-current.points.get(count-1)[1])*getHeight())>=0.5) current.points.add(new float[]{nx,ny});
        }
        private void record() {
            undoStates.addLast(new ArrayList<>(strokes)); if (undoStates.size()>100) undoStates.removeFirst(); redoStates.clear();
        }
        private void changed() { rebuild(); updateButtons(); saveNotes(); }
        private void finishStroke(float x, float y) {
            if (current == null) return;
            addPoint(x,y); record(); strokes.add(current);
            if (bitmap != null) drawStroke(new Canvas(bitmap), current);
            current=null; pointer=-1;
            if (bitmap == null) rebuild(); else invalidate();
            updateButtons(); saveNotes(); performClick();
        }
        void undo() { if (!ready || undoStates.isEmpty()) return; redoStates.addLast(new ArrayList<>(strokes)); strokes.clear(); strokes.addAll(undoStates.removeLast()); changed(); }
        void redo() { if (!ready || redoStates.isEmpty()) return; undoStates.addLast(new ArrayList<>(strokes)); strokes.clear(); strokes.addAll(redoStates.removeLast()); changed(); }
        void clear() { if (!ready || strokes.isEmpty()) return; record(); strokes.clear(); changed(); }
        @Override public boolean onTouchEvent(MotionEvent event) {
            if (!ready || getWidth()<=0 || getHeight()<=0) return false;
            switch(event.getActionMasked()) {
                case MotionEvent.ACTION_DOWN:
                    pointer=event.getPointerId(0);
                    float base=Math.min(getWidth(),getHeight());
                    float width=erasing?dp(24)/base:penSize * .001f;
                    current=new Stroke(inkColor,width,erasing); addPoint(event.getX(),event.getY()); invalidate(); return true;
                case MotionEvent.ACTION_MOVE:
                    int index=event.findPointerIndex(pointer); if(index<0 || current==null)return true;
                    for(int i=0;i<event.getHistorySize();i++)addPoint(event.getHistoricalX(index,i),event.getHistoricalY(index,i));
                    addPoint(event.getX(index),event.getY(index)); invalidate(); return true;
                case MotionEvent.ACTION_POINTER_UP:
                case MotionEvent.ACTION_UP:
                    int upIndex=event.getActionIndex();
                    if(current!=null && event.getPointerId(upIndex)==pointer) finishStroke(event.getX(upIndex),event.getY(upIndex));
                    return true;
                case MotionEvent.ACTION_CANCEL:
                    current=null;pointer=-1;invalidate();return true;
                default: return true;
            }
        }
        @Override public boolean performClick() { super.performClick(); return true; }
    }
}
