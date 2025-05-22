package com.example.bt_tuan09;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;

public class Activity_Info extends AppCompatActivity implements View.OnClickListener{

    TextView id, userName, userEmail, gender;
    Button btnLogout;
    ImageView imageViewprofile;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_info);
        if(SharedPrefManager.getInstance(this).isLoggedIn()){
            id = findViewById(R.id.textid);
            userName = findViewById(R.id.textViewName);
            userEmail = findViewById(R.id.textemail);
            gender = findViewById(R.id.textgender);
            btnLogout = findViewById(R.id.btnLogout);
            imageViewprofile = findViewById(R.id.profile_image);
            User user = SharedPrefManager.getInstance(this).getUser();
            id.setText(String.valueOf(user.getId()));
            userEmail.setText(user.getEmail());
            gender.setText(user.getGender());
            userName.setText(user.getName());
            Glide.with(getApplicationContext()).load(user.getImages()).into(imageViewprofile);
            btnLogout.setOnClickListener(this);
        }else{
            Intent intent = new Intent(Activity_Info.this, MainActivity.class);
            startActivity(intent);
            finish();
        }
    }
    @Override
    public void onClick(View v) {
        if(v.equals(btnLogout)){
            SharedPrefManager.getInstance(getApplicationContext());
        }
    }
}