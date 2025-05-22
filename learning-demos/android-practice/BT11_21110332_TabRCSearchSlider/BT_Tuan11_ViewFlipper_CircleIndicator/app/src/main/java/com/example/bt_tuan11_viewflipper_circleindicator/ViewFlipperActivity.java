package com.example.bt_tuan11_viewflipper_circleindicator;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.ViewFlipper;

import com.bumptech.glide.Glide;

import java.util.ArrayList;
import java.util.List;

public class ViewFlipperActivity extends AppCompatActivity {

    ViewFlipper viewFlipperMain;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_flipper);
        viewFlipperMain = findViewById(R.id.viewFlipperMain);
        ActionViewFlipperMain();
    }


    //hàm Flipper
    private void ActionViewFlipperMain() {
        List<String> arrayListFlipper = new ArrayList<>();
        arrayListFlipper.add("https://www.upmenu.com/wp-content/uploads/2023/10/food-advertisement-examples2.jpeg");
        arrayListFlipper.add("https://d1csarkz8obe9u.cloudfront.net/posterpreviews/special-coffee-ads-design-template-d33dc0a4129cb7636cbcfca295859f75_screen.jpg?ts=1656492492");
        arrayListFlipper.add("https://www.shutterstock.com/shutterstock/photos/1427946764/display_1500/stock-vector-pepperoni-pizza-ads-with-delicious-ingredients-on-chalkboard-background-in-d-illustration-1427946764.jpg");
        arrayListFlipper.add("https://c8.alamy.com/comp/R4W4HJ/craft-lager-beer-ads-with-splashing-realistic-glass-beer-bottle-with-flying-ice-cubes-on-shiny-blue-background-vector-3d-illustration-R4W4HJ.jpg");
        for(int i=0; i<arrayListFlipper.size(); i++){
            ImageView imageView = new ImageView(getApplicationContext());
            Glide.with(getApplicationContext()).load(arrayListFlipper.get(i)).into(imageView);
            imageView.setScaleType(ImageView.ScaleType.FIT_XY);
            viewFlipperMain.addView(imageView);
        }

        viewFlipperMain.setFlipInterval(3000);
        viewFlipperMain.setAutoStart(true);

        //thiet lap animation cho flipper
        Animation slide_in = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_in_right);
        Animation slide_out = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_out_right);
        viewFlipperMain.setInAnimation(slide_in);
        viewFlipperMain.setOutAnimation(slide_out);
    }


}