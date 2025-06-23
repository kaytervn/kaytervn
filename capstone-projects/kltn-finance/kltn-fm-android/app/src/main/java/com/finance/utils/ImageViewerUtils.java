package com.finance.utils;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;

import androidx.core.content.FileProvider;

import java.io.File;

import timber.log.Timber;

public class ImageViewerUtils {
    public static void openImageViewer(Context context, String imageUrl) {
        try{
            Intent intent = new Intent(Intent.ACTION_VIEW);
            Uri imageUri;
            imageUri = Uri.parse(BindingUtils.getImageUrl(imageUrl));
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            }
            intent.setDataAndType(imageUri, "image/*");
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            try {
                context.startActivity(intent);
            } catch (ActivityNotFoundException e) {
                Timber.e(e, "No application can handle this request. Please install an image viewer application.");
            }
        } catch (Exception e) {
            Timber.tag("ImageViewer").e(e, "No application can handle this request. Please install an image viewer application.");
        }
    }
}
