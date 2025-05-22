package com.example.bt_tuan11_viewflipper_circleindicator;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class NavigationAcitivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_navigation_acitivity);

        //Button to transfer into View Flipper Page
        Button btnViewFlipper = findViewById(R.id.btnViewFlipper);
        btnViewFlipper.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openViewFlipperPage();
            }
        });

        //Button to transfer into Slide Images with View Pager and Indicator
        Button btnSlideImages = findViewById(R.id.btnSlideImagesPagerIndicator);
        btnSlideImages.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openSlideImages();
            }
        });

        //Button to transfer into Pager2 Page
        Button btnPager2 = findViewById(R.id.btnPager2);
        btnPager2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openViewPager2();
            }
        });

        //Button to transfer into Slider View Page
        Button btnSliderView = findViewById(R.id.btnSliderView);
        btnSliderView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openSliderView();
            }
        });

    }

    public void openViewFlipperPage() {
        Intent intent = new Intent(this, ViewFlipperActivity.class);
        startActivity(intent);
    }

    public void openSlideImages() {
        Intent intent = new Intent(this, SlideImagesCircleIndicatorViewPagerActivity.class);
        startActivity(intent);
    }

    public void openViewPager2() {
        Intent intent = new Intent(this, SlideImagesCircleIndicator3ViewPager2Activity.class);
        startActivity(intent);
    }

    public void openSliderView() {
        Intent intent = new Intent(this, SliderViewActivity.class);
        startActivity(intent);
    }
}