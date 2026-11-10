package com.odiasmartlab.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.pdf.PdfRenderer;
import android.net.Uri;
import android.os.Bundle;
import android.os.ParcelFileDescriptor;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Offline reader for PDFs selected by the teacher using Android's document picker. */
public class PdfReaderActivity extends Activity {
    private static final int PICK_PDF = 4501;
    private final ExecutorService rendererThread = Executors.newSingleThreadExecutor();
    private ParcelFileDescriptor descriptor;
    private PdfRenderer renderer;
    private ImageView image;
    private TextView pageLabel;
    private Button previous, next, layout;
    private int pageIndex, pageCount, generation;
    private boolean twoPages, destroyed;
    private Uri documentUri;
    private float touchX, touchY;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.rgb(235, 238, 235));
        image = new ImageView(this);
        image.setScaleType(ImageView.ScaleType.FIT_CENTER);
        image.setContentDescription("PDF page");
        image.setOnTouchListener((v, event) -> {
            if (event.getActionMasked() == MotionEvent.ACTION_DOWN) { touchX = event.getX(); touchY = event.getY(); return true; }
            if (event.getActionMasked() == MotionEvent.ACTION_UP) {
                float dx = event.getX() - touchX, dy = event.getY() - touchY;
                if (Math.abs(dx) > 72 * getResources().getDisplayMetrics().density && Math.abs(dx) > Math.abs(dy) * 1.3f) {
                    changePage(dx < 0 ? 1 : -1);
                } else v.performClick();
                return true;
            }
            return true;
        });
        root.addView(image, new LinearLayout.LayoutParams(-1, 0, 1));
        LinearLayout controls = new LinearLayout(this);
        controls.setGravity(Gravity.CENTER);
        controls.setBackgroundColor(Color.WHITE);
        Button close = button("ଫେରନ୍ତୁ", () -> finish());
        previous = button("‹", () -> changePage(-1));
        previous.setContentDescription("Previous page");
        pageLabel = new TextView(this);
        pageLabel.setTextColor(Color.rgb(0, 70, 45));
        pageLabel.setGravity(Gravity.CENTER);
        pageLabel.setTextSize(17);
        pageLabel.setPadding(12, 0, 12, 0);
        next = button("›", () -> changePage(1));
        next.setContentDescription("Next page");
        layout = button("୨ ପୃଷ୍ଠା", () -> { twoPages = !twoPages; pageIndex = twoPages ? pageIndex / 2 * 2 : pageIndex; showPage(); });
        controls.addView(close); controls.addView(previous); controls.addView(pageLabel); controls.addView(next); controls.addView(layout);
        root.addView(controls);
        setContentView(root);
        Intent picker = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        picker.addCategory(Intent.CATEGORY_OPENABLE);
        picker.setType("application/pdf");
        try { startActivityForResult(picker, PICK_PDF); }
        catch (Exception e) { Toast.makeText(this, "Cannot open document picker", Toast.LENGTH_LONG).show(); finish(); }
    }
    private Button button(String label, Runnable action) {
        Button b = new Button(this); b.setText(label); b.setMinHeight((int)(48 * getResources().getDisplayMetrics().density)); b.setOnClickListener(v -> action.run()); return b;
    }
    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != PICK_PDF) return;
        if (result != RESULT_OK || data == null || data.getData() == null) { finish(); return; }
        documentUri = data.getData();
        try {
            descriptor = getContentResolver().openFileDescriptor(documentUri, "r");
            if (descriptor == null) throw new IOException("Empty file");
            renderer = new PdfRenderer(descriptor);
            pageCount = renderer.getPageCount();
            if (pageCount == 0) throw new IOException("No pages");
            pageIndex = Math.min(pageCount - 1, Math.max(0, getPreferences(MODE_PRIVATE).getInt(documentUri.toString(), 0)));
            image.post(this::showPage);
        } catch (IOException | SecurityException | IllegalArgumentException e) {
            Toast.makeText(this, "Cannot open this PDF", Toast.LENGTH_LONG).show(); finish();
        }
    }
    private void changePage(int direction) {
        if (renderer == null) return;
        int target = Math.max(0, Math.min(pageCount - 1, pageIndex + direction * (twoPages ? 2 : 1)));
        if (twoPages) target = target / 2 * 2;
        if (target != pageIndex) { pageIndex = target; showPage(); }
    }
    private void showPage() {
        if (renderer == null || destroyed) return;
        final int current = pageIndex, id = ++generation;
        final boolean spread = twoPages;
        final int width = Math.max(200, Math.min(2000, image.getWidth()));
        final int height = Math.max(200, Math.min(1600, image.getHeight()));
        pageLabel.setText((current + 1) + (spread && current + 1 < pageCount ? "–" + (current + 2) : "") + " / " + pageCount);
        previous.setEnabled(current > 0); next.setEnabled(current + (spread ? 2 : 1) < pageCount);
        layout.setText(spread ? "୧ ପୃଷ୍ଠା" : "୨ ପୃଷ୍ଠା");
        getPreferences(MODE_PRIVATE).edit().putInt(documentUri.toString(), current).apply();
        rendererThread.execute(() -> {
            Bitmap bitmap = null;
            try {
                bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
                Canvas canvas = new Canvas(bitmap); canvas.drawColor(Color.rgb(235, 238, 235));
                int slots = spread ? 2 : 1;
                for (int i = 0; i < slots && current + i < pageCount; i++) {
                    try (PdfRenderer.Page page = renderer.openPage(current + i)) {
                        int slotWidth = width / slots;
                        float scale = Math.min((float) slotWidth / page.getWidth(), (float) height / page.getHeight());
                        int w = Math.max(1, (int)(page.getWidth() * scale)), h = Math.max(1, (int)(page.getHeight() * scale));
                        Bitmap part = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888); part.eraseColor(Color.WHITE);
                        page.render(part, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
                        canvas.drawBitmap(part, i * slotWidth + (slotWidth - w) / 2f, (height - h) / 2f, null); part.recycle();
                    }
                }
                final Bitmap result = bitmap;
                runOnUiThread(() -> { if (!destroyed && id == generation) image.setImageBitmap(result); else result.recycle(); });
            } catch (Exception | OutOfMemoryError error) {
                if (bitmap != null) bitmap.recycle();
                runOnUiThread(() -> { if (!destroyed && id == generation) Toast.makeText(this, "Unable to display page", Toast.LENGTH_SHORT).show(); });
            }
        });
    }
    @Override protected void onDestroy() {
        destroyed = true; generation++;
        rendererThread.execute(() -> { try { if (renderer != null) renderer.close(); else if (descriptor != null) descriptor.close(); } catch (IOException ignored) {} });
        rendererThread.shutdown();
        super.onDestroy();
    }
}
