package com.finance.ui.image;


import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.databinding.ActivityImageViewBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.utils.BindingUtils;

public class ImageActivity extends BaseActivity<ActivityImageViewBinding, ImageViewModel> {
    @Override
    public int getLayoutId() {
        return R.layout.activity_image_view;
    }

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    public void performDependencyInjection(ActivityComponent buildComponent) {
        buildComponent.inject(this);
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        String imageUrl = intent.getStringExtra(Constants.IMAGE_URL);
        String imageName = intent.getStringExtra(Constants.IMAGE_NAME);
        if (imageUrl != null && imageName != null && !imageUrl.isEmpty() && !imageName.isEmpty()) {
            Glide.with(this)
                    .load(BindingUtils.getImageUrl(imageUrl))
                    .diskCacheStrategy(DiskCacheStrategy.NONE)
                    .skipMemoryCache(true)
                    .into(viewBinding.photoView);
            viewBinding.tvImageName.setText(imageName);
        }
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
    }
}
