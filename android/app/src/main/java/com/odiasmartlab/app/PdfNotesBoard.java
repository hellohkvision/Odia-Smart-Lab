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
    private int inkColor = Color.WHITE, sizeChoice = 1, columns;

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
            int next = r-l >= dp(248) ? 5 : r-l >= dp(200) ? 4 : 3;
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
        tools.addView(button, new LinearLayout.LayoutParams(dp(48), dp(48)));
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
    private void choosePen() {
        if (!ready) return;
        final int[] selected = {inkColor}, size = {sizeChoice};
        LinearLayout panel = new LinearLayout(activity);
        panel.setOrientation(LinearLayout.VERTICAL); panel.setPadding(dp(16), dp(8), dp(16), 0);
        TextView colorLabel = new TextView(activity); colorLabel.setText("Color"); panel.addView(colorLabel);
        LinearLayout colors = new LinearLayout(activity); colors.setGravity(Gravity.CENTER);
        final int[] choices = {Color.WHITE, Color.YELLOW, Color.rgb(250, 100, 100), Color.rgb(100, 190, 255), Color.rgb(130, 230, 155)};
        Button[] swatches = new Button[choices.length];
        for (int i = 0; i < choices.length; i++) {
            final int index = i;
            Button b = new Button(activity); swatches[i] = b; b.setText("●"); b.setTextSize(24);
            b.setTextColor(choices[i]); b.setBackgroundColor(Color.rgb(52, 58, 55));
            b.setContentDescription(new String[]{"White", "Yellow", "Red", "Blue", "Green"}[i] + " pen");
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, dp(48), 1f); colors.addView(b, lp);
            b.setOnClickListener(v -> {
                selected[0] = choices[index];
                for (int j = 0; j < swatches.length; j++) {
                    swatches[j].setText(j == index ? "● ✓" : "●");
                    swatches[j].setContentDescription(new String[]{"White", "Yellow", "Red", "Blue", "Green"}[j] + " pen" + (j == index ? ", selected" : ""));
                }
            });
        }
        for (int j = 0; j < choices.length; j++) if (choices[j] == selected[0]) { swatches[j].setText("● ✓"); swatches[j].setContentDescription(new String[]{"White", "Yellow", "Red", "Blue", "Green"}[j] + " pen, selected"); }
        panel.addView(colors);
        TextView widthLabel = new TextView(activity); widthLabel.setText("Pen size"); panel.addView(widthLabel);
        SeekBar width = new SeekBar(activity); width.setMax(2); width.setProgress(sizeChoice);
        width.setContentDescription("Pen size: thin, medium, or thick");
        width.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override public void onProgressChanged(SeekBar bar, int value, boolean user) { size[0] = value; widthLabel.setText("Pen size: " + new String[]{"Thin", "Medium", "Thick"}[value]); }
            @Override public void onStartTrackingTouch(SeekBar bar) {}
            @Override public void onStopTrackingTouch(SeekBar bar) {}
        });
        widthLabel.setText("Pen size: " + new String[]{"Thin", "Medium", "Thick"}[sizeChoice]);
        panel.addView(width);
        new AlertDialog.Builder(activity).setTitle("Pen").setView(panel)
            .setPositiveButton("Use pen", (dialog, which) -> { inkColor = selected[0]; sizeChoice = size[0]; erasing = false; updateButtons(); })
            .setNegativeButton(android.R.string.cancel, null).show();
    }
    private void confirmClear() {
        if (!ready || ink.strokes.isEmpty()) return;
        new AlertDialog.Builder(activity).setTitle("Clear writing board?")
            .setMessage("This clears notes for this PDF. You can undo the clear while the reader is open.")
            .setPositiveButton("Clear", (dialog, which) -> ink.clear())
            .setNegativeButton(android.R.string.cancel, null).show();
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
    public void close() { closed = true; }

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
                    float width=erasing?dp(24)/base:new float[]{.005f,.009f,.016f}[sizeChoice];
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
