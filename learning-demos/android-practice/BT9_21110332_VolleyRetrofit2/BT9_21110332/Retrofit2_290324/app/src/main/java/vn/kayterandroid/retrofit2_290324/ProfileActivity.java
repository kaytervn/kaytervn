package vn.kayterandroid.retrofit2_290324;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;

public class ProfileActivity extends AppCompatActivity {
    TextView id, username, email, gender;
    Button buttonLogout;
    ImageView imagePicture;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);
        if (SharedPrefManager.getInstance(this).isLoggedIn()) {
            id = findViewById(R.id.textId);
            username = findViewById(R.id.textUsername);
            email = findViewById(R.id.textEmail);
            gender = findViewById(R.id.textGender);
            buttonLogout = findViewById(R.id.buttonLogout);
            imagePicture = findViewById(R.id.imagePicture);
            User user = SharedPrefManager.getInstance(this).getUser();
            id.setText(String.valueOf(user.getId()));
            email.setText(user.getEmail());
            gender.setText(user.getGender());
            username.setText(user.getUsername());
            Glide.with(getApplicationContext())
                    .load(user.getImages())
                    .into(imagePicture);
            buttonLogout.setOnClickListener(new View.OnClickListener() {

                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(ProfileActivity.this, LoginActitvity.class);
                    startActivity(intent);
                    finish();
                }
            });
        } else {
            Intent intent = new Intent(ProfileActivity.this, LoginActitvity.class);
            startActivity(intent);
            finish();
        }
    }
}