package com.finance.utils;

import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import java.io.File;

import timber.log.Timber;

public class PdfDownloaderUtils {
    private final Context context;
    private final String url;
    private long downloadId;

    public PdfDownloaderUtils(Context context, String url) {
        this.context = context;
        this.url = url;
    }

    public void downloadPdf(String filename) {
        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
        request.setDescription("Downloading PDF");
        request.setTitle("PDF Download");
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename);
        } else {
            String destination = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS) + File.separator + filename;
            request.setDestinationUri(Uri.fromFile(new File(destination)));
        }
        DownloadManager manager = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
        downloadId = manager.enqueue(request);
    }

    public void registerDownloadCompleteReceiver(BroadcastReceiver onDownloadComplete) {
        IntentFilter filter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        if (Build.VERSION.SDK_INT >= 26) { // Android 8.0 (Oreo) and above
            try {
                // Use reflection to access RECEIVER_EXPORTED
                int flags = Context.class.getField("RECEIVER_EXPORTED").getInt(null);
                context.registerReceiver(onDownloadComplete, filter, null, null, flags);
            } catch (Exception e) {
                // Fallback to the old method if reflection fails
                context.registerReceiver(onDownloadComplete, filter);
            }
        } else {
            context.registerReceiver(onDownloadComplete, filter);
        }
    }

    public void download(Context context, Intent intent) {
        long downloadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
        if (downloadId == PdfDownloaderUtils.this.downloadId) { // Check if this is our download
            DownloadManager manager = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
            Uri uri = manager.getUriForDownloadedFile(downloadId);
            if (uri != null) {
                Intent openPdfIntent = new Intent(Intent.ACTION_VIEW);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    // For Nougat and above, directly use the content URI provided by the DownloadManager
                    openPdfIntent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                } else {
                    // For versions below Nougat, use Uri.fromFile directly
                    uri = Uri.fromFile(new File(uri.getPath()));
                }
                openPdfIntent.setDataAndType(uri, "application/pdf");
                try {
                    context.startActivity(openPdfIntent);
                } catch (ActivityNotFoundException e) {
                    Toast.makeText(context, "No PDF viewer found", Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(context, "Download failed", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void openPdf(File file) {
        Uri uri = FileProvider.getUriForFile(context, context.getApplicationContext().getPackageName() + ".provider", file);
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(uri, "application/pdf");
        intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        try {
            context.startActivity(intent);
        } catch (ActivityNotFoundException e) {
            Timber.tag("DocumentItemClick").d("Error: %s", e.getMessage());
        }
    }
}
