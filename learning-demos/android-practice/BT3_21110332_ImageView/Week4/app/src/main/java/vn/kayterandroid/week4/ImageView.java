package vn.kayterandroid.week4;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.ContextMenu;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageButton;
import android.widget.PopupMenu;
import android.widget.ProgressBar;
import android.widget.RadioGroup;
import android.widget.Switch;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Random;

public class ImageView extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_image_view);

        ConstraintLayout bg = (ConstraintLayout) findViewById(R.id.constraintLayout1);
        bg.setBackgroundColor(Color.BLUE);

        ArrayList<Integer> arrayList = new ArrayList<>();
        arrayList.add(R.drawable.background);
        arrayList.add(R.drawable.bg2);
        arrayList.add(R.drawable.bg3);
        arrayList.add(R.drawable.bg4);
        arrayList.add(R.drawable.ic_launcher_background);

        ImageButton img2 = (ImageButton) findViewById(R.id.imageButton1);
        img2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Random random = new Random();
                int vitri = random.nextInt(arrayList.size());
                bg.setBackgroundResource(arrayList.get(vitri));

            }
        });

        Switch sw = (Switch) findViewById(R.id.switch1);
        sw.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if(isChecked){ //isChecked = true
                    Toast.makeText(ImageView.this,"Đã bật WIFI lên",Toast.LENGTH_LONG).show();
                }else{
                    Toast.makeText(ImageView.this,"Bạn đã tắt WIFI",Toast.LENGTH_LONG).show();
                }
            }
        });

        CheckBox ck1 = (CheckBox) findViewById(R.id.checkBox);
        ck1.setOnCheckedChangeListener(new
           CompoundButton.OnCheckedChangeListener() {
               @Override
               public void onCheckedChanged(CompoundButton buttonView, boolean isChecked)
               {
                   if(isChecked){
                       bg.setBackgroundResource(R.drawable.bg4);
                   }else{
                       bg.setBackgroundResource(R.drawable.ic_launcher_background);
                   }
               }
           });

        // RadioGroup
        RadioGroup radioGroup = (RadioGroup) findViewById(R.id.radioGroup1);
        radioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                // Kiểm tra ID của RadioButton được chọn
                if (checkedId == R.id.radioButton1) {
                    // Đặt background cho bg khi radioButton1 được chọn
                    bg.setBackgroundResource(R.drawable.background);
                } else if (checkedId == R.id.radioButton2) {
                    bg.setBackgroundResource(R.drawable.bg2);
                } else if (checkedId == R.id.radioButton3) {
                    // Đặt background cho bg khi radioButton2 hoặc radioButton3 được chọn
                    bg.setBackgroundResource(R.drawable.bg3);
                }
            }
        });

        //progrebar
        ProgressBar progressBar = (ProgressBar) findViewById(R.id.progressBar);
        img2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //tự đếm progress
                CountDownTimer countDownTimer = new CountDownTimer(10000,1000) {
                    @Override
                    public void onTick(long millisUntilFinished) {
                        int current = progressBar.getProgress();
                    //chạy đều đều >100 quay về 0
                        if (current>= progressBar.getMax()){
                            current=0;
                        }
                        progressBar.setProgress(current + 10); //thiết lập progress
                    }
                    @Override
                    public void onFinish() {
                        Toast.makeText(ImageView.this,"Đã tải xong",Toast.LENGTH_LONG).show();
                    }
                };
                countDownTimer.start();
            }
        });
    }
    public void changeActivity(android.view.View view) {
        Intent intent = new Intent(ImageView.this, MenuTest.class);
        startActivity(intent);
    }
}