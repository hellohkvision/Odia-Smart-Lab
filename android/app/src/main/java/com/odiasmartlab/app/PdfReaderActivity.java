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
    private Button closeReader, previous, next, layout, splitButton;
    private LinearLayout pdfControls;
    private PdfNotesBoard notesBoard;
    private int pageIndex, pageCount;
    private volatile int generation;
    private boolean twoPages, splitMode;
    private int toolbarLayout = -1;
    private volatile boolean destroyed;
    private Uri documentUri;
    private float touchX, touchY, lastX, lastY, zoom = 1f, panX, panY;
    private boolean hadMultiTouch, moved;
    private android.view.ScaleGestureDetector scaleDetector;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.rgb(235, 238, 235));
        image = new ImageView(this);
        image.setScaleType(ImageView.ScaleType.MATRIX);
        image.setContentDescription("PDF page");
        scaleDetector = new android.view.ScaleGestureDetector(this, new android.view.ScaleGestureDetector.SimpleOnScaleGestureListener() {
            @Override public boolean onScale(android.view.ScaleGestureDetector detector) {
                float nextZoom = Math.max(1f, Math.min(4f, zoom * detector.getScaleFactor()));
                float ratio = nextZoom / zoom;
                float focusX = detector.getFocusX() - image.getWidth() / 2f;
                float focusY = detector.getFocusY() - image.getHeight() / 2f;
                panX = focusX - (focusX - panX) * ratio;
                panY = focusY - (focusY - panY) * ratio;
                zoom = nextZoom;
                applyPageTransform();
                return true;
            }
        });
        image.addOnLayoutChangeListener((view, left, top, right, bottom, oldLeft, oldTop, oldRight, oldBottom) -> {
            if (right - left != oldRight - oldLeft || bottom - top != oldBottom - oldTop) {
                resetZoom();
                if (renderer != null) image.post(this::showPage);
            }
        });
        image.setOnTouchListener((v, event) -> {
            scaleDetector.onTouchEvent(event);
            switch (event.getActionMasked()) {
                case MotionEvent.ACTION_DOWN:
                    touchX = lastX = event.getX(); touchY = lastY = event.getY();
                    hadMultiTouch = false; moved = false; return true;
                case MotionEvent.ACTION_POINTER_DOWN:
                    hadMultiTouch = true; return true;
                case MotionEvent.ACTION_POINTER_UP:
                    hadMultiTouch = true;
                    int remaining = event.getActionIndex() == 0 ? 1 : 0;
                    if (remaining < event.getPointerCount()) { lastX = event.getX(remaining); lastY = event.getY(remaining); }
                    return true;
                case MotionEvent.ACTION_MOVE:
                    if (event.getPointerCount() == 1 && !scaleDetector.isInProgress()) {
                        float x = event.getX(), y = event.getY();
                        if (Math.abs(x - touchX) > 8 || Math.abs(y - touchY) > 8) moved = true;
                        if (zoom > 1.001f) { panX += x - lastX; panY += y - lastY; applyPageTransform(); }
                        lastX = x; lastY = y;
                    }
                    return true;
                case MotionEvent.ACTION_UP:
                    float dx = event.getX() - touchX, dy = event.getY() - touchY;
                    if (!hadMultiTouch && zoom <= 1.001f && Math.abs(dx) > 72 * getResources().getDisplayMetrics().density && Math.abs(dx) > Math.abs(dy) * 1.3f) changePage(dx < 0 ? 1 : -1);
                    else if (!hadMultiTouch && !moved) v.performClick();
                    return true;
                case MotionEvent.ACTION_CANCEL: return true;
                default: return true;
            }
        });
        LinearLayout readingArea = new LinearLayout(this);
        readingArea.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout pdfPane = new LinearLayout(this);
        pdfPane.setOrientation(LinearLayout.VERTICAL);
        pdfPane.addView(image, new LinearLayout.LayoutParams(-1, 0, 1f));
        readingArea.addView(pdfPane, new LinearLayout.LayoutParams(0, -1, 1f));
        notesBoard = new PdfNotesBoard(this);
        notesBoard.setVisibility(View.GONE);
        readingArea.addView(notesBoard, new LinearLayout.LayoutParams(0, -1, 1f));
        root.addView(readingArea, new LinearLayout.LayoutParams(-1, 0, 1f));

        pdfControls = new LinearLayout(this); pdfControls.setOrientation(LinearLayout.VERTICAL);
        pdfControls.setGravity(Gravity.CENTER); pdfControls.setPadding(dp(2), dp(4), dp(2), dp(4));
        pdfControls.setBackgroundColor(Color.WHITE);
        closeReader = iconButton("back", "Back to books", this::finish);
        previous = iconButton("previous", "Previous page", () -> changePage(-1));
        next = iconButton("next", "Next page", () -> changePage(1));
        layout = iconButton("pages", "Toggle one or two pages", () -> {
            if (splitMode || renderer == null) return;
            twoPages = !twoPages; pageIndex = twoPages ? pageIndex / 2 * 2 : pageIndex; resetZoom(); showPage();
        });
        splitButton = iconButton("pen", "Open writing board beside PDF", this::toggleSplit);
        splitButton.setEnabled(false);
        pageLabel = new TextView(this);
        pageLabel.setTextColor(Color.rgb(42, 48, 46)); pageLabel.setGravity(Gravity.CENTER);
        pageLabel.setTextSize(12); pageLabel.setSingleLine(true);
        pageLabel.setTypeface(null, android.graphics.Typeface.BOLD); pageLabel.setMinWidth(dp(64));
        pdfControls.addOnLayoutChangeListener((v,l,t,r,b,ol,ot,or,ob) -> arrangePdfControls(r-l));
        pdfPane.addView(pdfControls, new LinearLayout.LayoutParams(-1, -2));
        arrangePdfControls(dp(800));
        setContentView(root);
        String officialUrl = getIntent().getStringExtra("official_book_url");
        if (officialUrl != null) { downloadBook(officialUrl); return; }
        Intent picker = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        picker.addCategory(Intent.CATEGORY_OPENABLE);
        picker.setType("application/pdf");
        try { startActivityForResult(picker, PICK_PDF); }
        catch (Exception e) { Toast.makeText(this, "Cannot open document picker", Toast.LENGTH_LONG).show(); finish(); }
    }
    private int dp(int value) { return Math.round(value * getResources().getDisplayMetrics().density); }
    private Button iconButton(String icon, String description, Runnable action) {
        Button button = new Button(this); ReaderToolbar.apply(button, icon, description);
        button.setOnClickListener(v -> action.run()); return button;
    }
    private void addPdfControl(LinearLayout row, View control, int width) {
        if (control.getParent() instanceof android.view.ViewGroup)
            ((android.view.ViewGroup) control.getParent()).removeView(control);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(dp(width), dp(48));
        if (control != pageLabel) params.setMargins(dp(1), 0, dp(1), 0);
        row.addView(control, params);
    }
    private LinearLayout pdfRow() {
        LinearLayout row = new LinearLayout(this); row.setGravity(Gravity.CENTER);
        row.setBackground(ReaderToolbar.surface(this, Color.WHITE, 16));
        pdfControls.addView(row, new LinearLayout.LayoutParams(-2, dp(48))); return row;
    }
    private void arrangePdfControls(int width) {
        if (width <= 0) return;
        boolean twoRows = width < dp(splitMode ? 268 : 318);
        int nextLayout = (twoRows ? 1 : 0) + (splitMode ? 2 : 0);
        if (toolbarLayout == nextLayout) return;
        toolbarLayout = nextLayout; pdfControls.removeAllViews();
        LinearLayout first = pdfRow();
        if (!twoRows) {
            addPdfControl(first, closeReader, 48); addPdfControl(first, previous, 48);
            addPdfControl(first, pageLabel, 64); addPdfControl(first, next, 48);
            if (!splitMode) addPdfControl(first, layout, 48);
            addPdfControl(first, splitButton, 48);
        } else {
            addPdfControl(first, previous, 48); addPdfControl(first, pageLabel, 64); addPdfControl(first, next, 48);
            LinearLayout second = pdfRow();
            addPdfControl(second, closeReader, 48);
            if (!splitMode) addPdfControl(second, layout, 48);
            addPdfControl(second, splitButton, 48);
        }
    }
    private void updateLayoutLabel() {
        layout.setSelected(twoPages);
        layout.setContentDescription(twoPages ? "Switch to single page" : "Switch to two pages");
    }
    private void toggleSplit() {
        if (renderer == null) return;
        splitMode = !splitMode;
        if (splitMode) twoPages = false;
        notesBoard.setVisibility(splitMode ? View.VISIBLE : View.GONE);
        layout.setEnabled(!splitMode);
        splitButton.setSelected(splitMode);
        splitButton.setContentDescription(splitMode ? "Close writing board" : "Open writing board beside PDF");
        toolbarLayout = -1; arrangePdfControls(pdfControls.getWidth());
        updateLayoutLabel(); resetZoom();
        image.post(this::showPage);
    }
    @Override public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != PICK_PDF) return;
        if (result != RESULT_OK || data == null || data.getData() == null) { finish(); return; }
        openPdf(data.getData());
    }
    private void openPdf(Uri uri) {
        documentUri = uri;
        try {
            descriptor = "file".equals(uri.getScheme()) ? ParcelFileDescriptor.open(new java.io.File(uri.getPath()), ParcelFileDescriptor.MODE_READ_ONLY) : getContentResolver().openFileDescriptor(uri, "r");
            if (descriptor == null) throw new IOException("Empty file");
            renderer = new PdfRenderer(descriptor);
            pageCount = renderer.getPageCount();
            if (pageCount == 0) throw new IOException("No pages");
            notesBoard.openDocument(documentUri.toString());
            splitButton.setEnabled(true);
            pageIndex = Math.min(pageCount - 1, Math.max(0, getPreferences(MODE_PRIVATE).getInt(documentUri.toString(), 0)));
            image.post(this::showPage);
        } catch (IOException | SecurityException | IllegalArgumentException e) {
            if ("file".equals(uri.getScheme()) && uri.getPath() != null) {
                java.io.File file = new java.io.File(uri.getPath());
                if (new java.io.File(getFilesDir(), "osepa-books").equals(file.getParentFile())) file.delete();
            }
            Toast.makeText(this, "Cannot open this PDF", Toast.LENGTH_LONG).show(); finish();
        }
    }
    private void downloadBook(String address) {
        Uri uri = Uri.parse(address);
        if (!"https".equals(uri.getScheme()) || !"osepa.odisha.gov.in".equals(uri.getHost()) || uri.getUserInfo() != null || (uri.getPort() != -1 && uri.getPort() != 443) || uri.getPath() == null || !uri.getPath().startsWith("/upload/ebooks/")) {
            Toast.makeText(this, "Invalid book address", Toast.LENGTH_LONG).show(); finish(); return;
        }
        previous.setEnabled(false); next.setEnabled(false); layout.setEnabled(false);
        pageLabel.setText("Downloading…");
        rendererThread.execute(() -> {
            java.net.HttpURLConnection connection = null;
            java.io.File partial = null;
            try {
                byte[] hash = java.security.MessageDigest.getInstance("SHA-256").digest(address.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                StringBuilder name = new StringBuilder(); for (byte b : hash) name.append(String.format(java.util.Locale.ROOT, "%02x", b & 255));
                java.io.File dir = new java.io.File(getFilesDir(), "osepa-books");
                if (!dir.isDirectory() && !dir.mkdirs()) throw new IOException("Cannot create book folder");
                java.io.File target = new java.io.File(dir, name + ".pdf");
                partial = new java.io.File(dir, name + ".part");
                if (!target.isFile()) {
                    connection = (java.net.HttpURLConnection) new java.net.URL(address).openConnection();
                    connection.setInstanceFollowRedirects(false);
                    connection.setConnectTimeout(20000); connection.setReadTimeout(30000);
                    if (connection.getResponseCode() != 200) throw new IOException("Book server unavailable");
                    long expected = -1, total = 0, max = 400L * 1024 * 1024;
                    String lengthHeader = connection.getHeaderField("Content-Length");
                    if (lengthHeader != null) try { expected = Long.parseLong(lengthHeader); } catch (NumberFormatException ignored) {}
                    if (expected > max) throw new IOException("Book too large");
                    try (java.io.InputStream in = connection.getInputStream(); java.io.FileOutputStream out = new java.io.FileOutputStream(partial)) {
                        byte[] buffer = new byte[32768]; int count;
                        while ((count = in.read(buffer)) != -1) {
                            if (destroyed) throw new IOException("Download cancelled");
                            total += count; if (total > max) throw new IOException("Book too large");
                            out.write(buffer, 0, count);
                            final long bytes = total;
                            if (bytes % (1024 * 1024) < count) runOnUiThread(() -> { if (!destroyed) pageLabel.setText("Downloading " + (bytes / (1024 * 1024)) + " MB"); });
                        }
                        if (total < 5 || (expected >= 0 && total != expected)) throw new IOException("Incomplete download");
                    }
                    try (java.io.FileInputStream check = new java.io.FileInputStream(partial)) {
                        if (check.read() != '%' || check.read() != 'P' || check.read() != 'D' || check.read() != 'F' || check.read() != '-') throw new IOException("Not a PDF");
                    }
                    if (!partial.renameTo(target)) throw new IOException("Cannot save book");
                }
                if (!destroyed) runOnUiThread(() -> { if (!destroyed) { layout.setEnabled(true); openPdf(Uri.fromFile(target)); } });
            } catch (Exception e) {
                if (partial != null) partial.delete();
                runOnUiThread(() -> { if (!destroyed) { Toast.makeText(this, "Book download failed. Check internet and try again.", Toast.LENGTH_LONG).show(); finish(); } });
            } finally { if (connection != null) connection.disconnect(); }
        });
    }
    private void resetZoom() {
        zoom = 1f; panX = 0f; panY = 0f;
        applyPageTransform();
    }
    private void applyPageTransform() {
        android.graphics.drawable.Drawable drawable = image.getDrawable();
        if (drawable == null || image.getWidth() <= 0 || image.getHeight() <= 0) return;
        int bitmapWidth = drawable.getIntrinsicWidth(), bitmapHeight = drawable.getIntrinsicHeight();
        if (bitmapWidth <= 0 || bitmapHeight <= 0) return;
        float fit = Math.min((float) image.getWidth() / bitmapWidth, (float) image.getHeight() / bitmapHeight);
        float scale = fit * zoom;
        float scaledWidth = bitmapWidth * scale, scaledHeight = bitmapHeight * scale;
        float maxX = Math.max(0f, (scaledWidth - image.getWidth()) / 2f);
        float maxY = Math.max(0f, (scaledHeight - image.getHeight()) / 2f);
        panX = Math.max(-maxX, Math.min(maxX, panX));
        panY = Math.max(-maxY, Math.min(maxY, panY));
        android.graphics.Matrix matrix = new android.graphics.Matrix();
        matrix.setScale(scale, scale);
        matrix.postTranslate((image.getWidth() - scaledWidth) / 2f + panX, (image.getHeight() - scaledHeight) / 2f + panY);
        image.setImageMatrix(matrix);
    }
    private void changePage(int direction) {
        if (renderer == null) return;
        int target = Math.max(0, Math.min(pageCount - 1, pageIndex + direction * (twoPages ? 2 : 1)));
        if (twoPages) target = target / 2 * 2;
        if (target != pageIndex) { pageIndex = target; resetZoom(); showPage(); }
    }
    private void showPage() {
        if (renderer == null || destroyed) return;
        final int current = pageIndex, id = ++generation;
        final boolean spread = twoPages;
        final int width = Math.max(200, Math.min(2000, image.getWidth()));
        final int height = Math.max(200, Math.min(1600, image.getHeight()));
        // Keep a small, consistent gutter between pages at the current rendering resolution.
        final int gutter = spread ? Math.min(width - 2, Math.max(2, Math.round(8 * getResources().getDisplayMetrics().density * width / Math.max(1, image.getWidth())))) : 0;
        pageLabel.setText((current + 1) + (spread && current + 1 < pageCount ? "–" + (current + 2) : "") + " / " + pageCount);
        previous.setEnabled(current > 0); next.setEnabled(current + (spread ? 2 : 1) < pageCount);
        updateLayoutLabel();
        getPreferences(MODE_PRIVATE).edit().putInt(documentUri.toString(), current).apply();
        rendererThread.execute(() -> {
            if (destroyed || id != generation) return;
            Bitmap bitmap = null;
            try {
                bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
                Canvas canvas = new Canvas(bitmap); canvas.drawColor(Color.rgb(235, 238, 235));
                int slots = spread ? 2 : 1;
                for (int i = 0; i < slots && current + i < pageCount; i++) {
                    try (PdfRenderer.Page page = renderer.openPage(current + i)) {
                        int slotWidth = spread ? (width - gutter) / 2 : width;
                        float scale = Math.min((float) slotWidth / page.getWidth(), (float) height / page.getHeight());
                        int w = Math.max(1, (int)(page.getWidth() * scale)), h = Math.max(1, (int)(page.getHeight() * scale));
                        Bitmap part = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888); part.eraseColor(Color.WHITE);
                        page.render(part, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
                        // Align facing edges, rather than centering each page in half the screen.
                        float left = spread && current + 1 < pageCount
                            ? (i == 0 ? (width - gutter) / 2f - w : (width + gutter) / 2f)
                            : (width - w) / 2f;
                        canvas.drawBitmap(part, left, (height - h) / 2f, null); part.recycle();
                    }
                }
                final Bitmap result = bitmap;
                runOnUiThread(() -> { if (!destroyed && id == generation) { image.setImageBitmap(result); applyPageTransform(); } else result.recycle(); });
            } catch (Exception | OutOfMemoryError error) {
                if (bitmap != null) bitmap.recycle();
                runOnUiThread(() -> { if (!destroyed && id == generation) Toast.makeText(this, "Unable to display page", Toast.LENGTH_SHORT).show(); });
            }
        });
    }
    @Override protected void onDestroy() {
        destroyed = true; generation++;
        if (notesBoard != null) notesBoard.close();
        rendererThread.execute(() -> { try { if (renderer != null) renderer.close(); else if (descriptor != null) descriptor.close(); } catch (IOException ignored) {} });
        rendererThread.shutdown();
        super.onDestroy();
    }
}
