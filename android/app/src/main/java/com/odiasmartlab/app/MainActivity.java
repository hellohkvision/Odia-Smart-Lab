package com.odiasmartlab.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.OutputStream;

public class MainActivity extends Activity {
    private static final int SAVE_BOARD = 1001;
    private static final int SAVE_DOCUMENT = 1002;
    private static final int OPEN_DOCUMENT = 1003;
    private static final int SAVE_PDF = 1004;
    private String pendingPdf;
    private byte[] pendingDocument;
    private WebView webView;
    private byte[] pendingBoard;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        webView = new WebView(this);
        webView.setBackgroundColor(android.graphics.Color.rgb(237, 241, 255));
        getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        webView.setOnApplyWindowInsetsListener((view, insets) -> {
            view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowFileAccessFromFileURLs(false);
        webView.getSettings().setAllowUniversalAccessFromFileURLs(false);
        webView.addJavascriptInterface(new BoardExport(), "AndroidBoard");
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onJsConfirm(WebView view, String url, String message, android.webkit.JsResult result) {
                new AlertDialog.Builder(MainActivity.this).setMessage(message)
                    .setPositiveButton(android.R.string.ok, (dialog, which) -> result.confirm())
                    .setNegativeButton(android.R.string.cancel, (dialog, which) -> result.cancel())
                    .setOnCancelListener(dialog -> result.cancel()).show();
                return true;
            }
        });
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !request.getUrl().toString().startsWith("file:///android_asset/");
            }
        });
        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }

    // Keep the board immersive, while allowing system bars to appear temporarily by edge swipe.
    @Override public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            getWindow().getDecorView().setSystemUiVisibility(
                android.view.View.SYSTEM_UI_FLAG_FULLSCREEN
                | android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
            );
        }
    }

    private void showBoardNotice(String message, boolean error) {
        runOnUiThread(() -> webView.evaluateJavascript("window.boardNotice && window.boardNotice(" + org.json.JSONObject.quote(message) + "," + error + ")", null));
    }

    private class BoardExport {
        @JavascriptInterface public void openOfficialBook(String url) {
            if (url == null) return;
            Uri uri = Uri.parse(url);
            if (!"https".equals(uri.getScheme()) || !"osepa.odisha.gov.in".equals(uri.getHost()) || uri.getUserInfo() != null || (uri.getPort() != -1 && uri.getPort() != 443) || uri.getPath() == null || !uri.getPath().startsWith("/upload/ebooks/")) return;
            runOnUiThread(() -> {
                Intent intent = new Intent(MainActivity.this, PdfReaderActivity.class);
                intent.putExtra("official_book_url", url);
                startActivity(intent);
            });
        }

        @JavascriptInterface public void openPdfReader() {
            runOnUiThread(() -> startActivity(new Intent(MainActivity.this, PdfReaderActivity.class)));
        }

        @JavascriptInterface public void closeApp() { runOnUiThread(() -> finish()); }

        @JavascriptInterface public void emailPng(String data) { sharePng(data); }

        @JavascriptInterface public void openBoardFile() {
            runOnUiThread(() -> {
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/json");
                try { startActivityForResult(intent, OPEN_DOCUMENT); }
                catch (android.content.ActivityNotFoundException e) { showBoardNotice("No file picker available", true); }
            });
        }

        @JavascriptInterface public void saveBoardFile(String json) {
            if (json == null || json.length() > 4 * 1024 * 1024) {
                showBoardNotice("Board file is too large to save", true);
                return;
            }
            byte[] data = json.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            if (data.length > 4 * 1024 * 1024) { showBoardNotice("Board file is too large to save", true); return; }
            runOnUiThread(() -> {
                pendingDocument = data;
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/json");
                intent.putExtra(Intent.EXTRA_TITLE, "odia-smart-lab-board.json");
                try { startActivityForResult(intent, SAVE_DOCUMENT); }
                catch (android.content.ActivityNotFoundException e) { pendingDocument = null; showBoardNotice("No file picker available", true); }
            });
        }

        @JavascriptInterface public void savePdfFile(String pagesJson) {
            if (pagesJson == null || pagesJson.length() > 16 * 1024 * 1024) {
                showBoardNotice("PDF is too large to save", true);
                return;
            }
            runOnUiThread(() -> {
                pendingPdf = pagesJson;
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/pdf");
                intent.putExtra(Intent.EXTRA_TITLE, "odia-smart-lab-board.pdf");
                try { startActivityForResult(intent, SAVE_PDF); }
                catch (android.content.ActivityNotFoundException e) {
                    pendingPdf = null;
                    showBoardNotice("No file picker available", true);
                }
            });
        }

        @JavascriptInterface public void sharePng(String data) {
            if (data == null || !data.startsWith("data:image/png;base64,")) return;
            try {
                byte[] image = Base64.decode(data.substring(data.indexOf(',') + 1), Base64.DEFAULT);
                java.io.File target = new java.io.File(getCacheDir(), "shared-board.png");
                try (java.io.FileOutputStream out = new java.io.FileOutputStream(target)) { out.write(image); }
                runOnUiThread(() -> {
                    Uri uri = Uri.parse("content://" + getPackageName() + ".boardshare/board.png");
                    Intent send = new Intent(Intent.ACTION_SEND);
                    send.setType("image/png"); send.putExtra(Intent.EXTRA_STREAM, uri);
                    send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    try { startActivity(Intent.createChooser(send, "Share board")); }
                    catch (android.content.ActivityNotFoundException e) { showBoardNotice("No sharing app available", true); }
                });
            } catch (Exception e) { showBoardNotice("Could not prepare image for sharing", true); }
        }
        @JavascriptInterface public void savePng(String data) {
            if (data == null || !data.startsWith("data:image/png;base64,")) return;
            try { pendingBoard = Base64.decode(data.substring(data.indexOf(',') + 1), Base64.DEFAULT); }
            catch (IllegalArgumentException e) { return; }
            runOnUiThread(() -> {
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("image/png");
                intent.putExtra(Intent.EXTRA_TITLE, "odia-smart-lab-board.png");
                try { startActivityForResult(intent, SAVE_BOARD); }
                catch (android.content.ActivityNotFoundException e) { pendingBoard = null; showBoardNotice("No file picker available", true); }
            });
        }
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == OPEN_DOCUMENT) {
            if (resultCode != RESULT_OK || data == null || data.getData() == null) return;
            Uri uri = data.getData();
            new Thread(() -> {
                try (java.io.InputStream in = getContentResolver().openInputStream(uri);
                     java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {
                    if (in == null) throw new java.io.IOException("Unable to open file");
                    byte[] buffer = new byte[8192];
                    int count, total = 0;
                    while ((count = in.read(buffer)) != -1) {
                        total += count;
                        if (total > 4 * 1024 * 1024) throw new java.io.IOException("File too large");
                        out.write(buffer, 0, count);
                    }
                    String json = out.toString("UTF-8");
                    runOnUiThread(() -> webView.evaluateJavascript(
                        "window.receiveBoardFile && window.receiveBoardFile(" + org.json.JSONObject.quote(json) + ")", null));
                } catch (Exception e) { showBoardNotice("Could not open board file", true); }
            }).start();
            return;
        }
        if (requestCode == SAVE_DOCUMENT) {
            byte[] document = pendingDocument;
            pendingDocument = null;
            if (resultCode != RESULT_OK || data == null || data.getData() == null || document == null) return;
            try (OutputStream out = getContentResolver().openOutputStream(data.getData())) {
                if (out == null) throw new java.io.IOException("Unable to open output");
                out.write(document);
                showBoardNotice("Board file saved", false);
            } catch (Exception e) { showBoardNotice("Could not save board file", true); }
            return;
        }
        if (requestCode == SAVE_PDF) {
            String pagesJson = pendingPdf;
            pendingPdf = null;
            if (resultCode != RESULT_OK || data == null || data.getData() == null || pagesJson == null) return;
            Uri target = data.getData();
            new Thread(() -> {
                android.graphics.pdf.PdfDocument pdf = new android.graphics.pdf.PdfDocument();
                try {
                    org.json.JSONArray pages = new org.json.JSONArray(pagesJson);
                    if (pages.length() < 1 || pages.length() > 50) throw new java.io.IOException("Invalid page count");
                    for (int i = 0; i < pages.length(); i++) {
                        String page = pages.getString(i);
                        String prefix = "data:image/jpeg;base64,";
                        if (!page.startsWith(prefix)) throw new java.io.IOException("Invalid page");
                        byte[] jpeg = Base64.decode(page.substring(prefix.length()), Base64.DEFAULT);
                        if (jpeg.length > 8 * 1024 * 1024) throw new java.io.IOException("Page too large");
                        android.graphics.BitmapFactory.Options bounds = new android.graphics.BitmapFactory.Options();
                        bounds.inJustDecodeBounds = true;
                        android.graphics.BitmapFactory.decodeByteArray(jpeg, 0, jpeg.length, bounds);
                        if (bounds.outWidth < 1 || bounds.outHeight < 1 || bounds.outWidth > 2000 || bounds.outHeight > 2000)
                            throw new java.io.IOException("Invalid page dimensions");
                        android.graphics.Bitmap bitmap = android.graphics.BitmapFactory.decodeByteArray(jpeg, 0, jpeg.length);
                        if (bitmap == null) throw new java.io.IOException("Could not decode page");
                        try {
                            int width = 842;
                            int height = Math.max(1, Math.min(1684, Math.round((float) width * bitmap.getHeight() / bitmap.getWidth())));
                            android.graphics.pdf.PdfDocument.PageInfo info =
                                new android.graphics.pdf.PdfDocument.PageInfo.Builder(width, height, i + 1).create();
                            android.graphics.pdf.PdfDocument.Page pdfPage = pdf.startPage(info);
                            pdfPage.getCanvas().drawBitmap(bitmap, null, new android.graphics.RectF(0, 0, width, height), null);
                            pdf.finishPage(pdfPage);
                        } finally { bitmap.recycle(); }
                    }
                    try (OutputStream out = getContentResolver().openOutputStream(target)) {
                        if (out == null) throw new java.io.IOException("Unable to open output");
                        pdf.writeTo(out);
                    }
                    showBoardNotice("PDF saved", false);
                } catch (Exception e) { showBoardNotice("Could not save PDF. Please try again.", true); }
                finally { pdf.close(); }
            }).start();
            return;
        }
        if (requestCode != SAVE_BOARD) return;
        byte[] image = pendingBoard;
        pendingBoard = null;
        if (resultCode != RESULT_OK || data == null || image == null) return;
        Uri uri = data.getData();
        if (uri == null) return;
        try (OutputStream out = getContentResolver().openOutputStream(uri)) {
            if (out == null) throw new java.io.IOException("Unable to open output");
            out.write(image);
            showBoardNotice("Image saved successfully", false);
        } catch (Exception e) { showBoardNotice("Could not save image. Please try again.", true); }
    }

    @Override public void onBackPressed() {
        if (webView.canGoBack()) webView.goBack(); else super.onBackPressed();
    }
}
