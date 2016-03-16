package com.example.nickj.test;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebView;
import android.content.res.AssetManager;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView webView = new WebView(this);
        webView.getSettings().setJavaScriptEnabled(true);

        AssetManager am = getApplicationContext().getAssets();

        String indexHTML = "<html><body>If you're seeing this you need an index.html</body></html>";

        try {
            InputStream is = am.open("index.html");
            indexHTML = IOUtils.toString(is, "UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }

        webView.loadDataWithBaseURL("file:///android_asset/", indexHTML, "text/html", "UTF-8", null);

        setContentView(webView);
    }
}
