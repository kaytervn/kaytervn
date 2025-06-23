package com.finance.utils;

import android.widget.ImageView;

import androidx.databinding.BindingAdapter;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.finance.BuildConfig;
import com.finance.R;
import com.finance.constant.Constants;

import dagger.Binds;


public final class BindingUtils {

    @BindingAdapter("image_src")
    public static void setImageUrl(ImageView view, String url) {
        if (url == null){
            view.setImageResource(R.drawable.bg_ava);
            return;
        }
        if(url.contains("https:")){
            Glide.with(view.getContext())
                    .load(url)
                    .diskCacheStrategy(DiskCacheStrategy.NONE)
                    .skipMemoryCache(true)
                    .into(view);
            return;
        }
        Glide.with(view.getContext())
                .load(BuildConfig.MEDIA_URL+ Constants.FILE_DOWNLOAD + url)
                .error(R.drawable.bg_ava)
                .placeholder(R.drawable.bg_ava)
                .into(view);
    }

    public static void setImageUrlByDrawable(ImageView view, String url, int drawable) {
        if (url == null){
            view.setImageResource(drawable);
            return;
        }
        if(url.contains("https:")){
            Glide.with(view.getContext())
                    .load(url)
                    .diskCacheStrategy(DiskCacheStrategy.NONE)
                    .skipMemoryCache(true)
                    .into(view);
            return;
        }
        Glide.with(view.getContext())
                .load(BuildConfig.MEDIA_URL+ Constants.FILE_DOWNLOAD + url)
                .error(drawable)
                .placeholder(drawable)
                .into(view);
    }

    public static String getImageUrl(String url) {
        if (url == null){
            return null;
        }
        return BuildConfig.MEDIA_URL + Constants.FILE_DOWNLOAD + url;
    }

}