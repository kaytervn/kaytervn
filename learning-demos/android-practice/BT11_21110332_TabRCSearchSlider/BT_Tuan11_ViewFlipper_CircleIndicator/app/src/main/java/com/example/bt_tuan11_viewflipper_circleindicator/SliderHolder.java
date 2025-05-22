package com.example.bt_tuan11_viewflipper_circleindicator;

import android.view.View;
import android.widget.ImageView;

import com.smarteist.autoimageslider.SliderView;
import com.smarteist.autoimageslider.SliderViewAdapter;

public class SliderHolder extends SliderViewAdapter.ViewHolder {
    ImageView imageView;

    public SliderHolder(View itemView) {
        super(itemView);
        imageView = itemView.findViewById(R.id.iv_auto_image_slider);
    }
}
