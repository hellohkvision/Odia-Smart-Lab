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
        @JavascriptInterface public void closeApp() { runOnUiThread(() -> finish()); }
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
