package vn.kayterandroid.bttuan10_21110332;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import java.io.IOException;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity {
    APIService apiService;
    TextView id, username, email, gender;
    ImageView imagePicture;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        id = findViewById(R.id.textId);
        username = findViewById(R.id.textUsername);
        email = findViewById(R.id.textEmail);
        gender = findViewById(R.id.textGender);
        imagePicture = findViewById(R.id.imagePicture);
        try {
            apiService = RetrofitClient.getRetrofit().create(APIService.class);
            Call<ResponseBody> call = apiService.login("trung2", "123");
            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    Gson gson = new GsonBuilder().create();
                    if (response.isSuccessful()) {
                        try {
                            String jsonString = response.body().string();
                            JsonObject jsonObject = new Gson().fromJson(jsonString, JsonObject.class);
                            JsonObject userObject = jsonObject.getAsJsonObject("user");
                            User user = new User(
                                    userObject.get("id").getAsString(),
                                    userObject.get("username").getAsString(),
                                    userObject.get("email").getAsString(),
                                    userObject.get("gender").getAsString(),
                                    userObject.get("images").getAsString()
                            );
                            id.setText(String.valueOf(user.getId()));
                            email.setText(user.getEmail());
                            gender.setText(user.getGender());
                            username.setText(user.getUsername());
                            Glide.with(getApplicationContext())
                                    .load(user.getImages())
                                    .into(imagePicture);
                            Toast.makeText(getApplicationContext(), user.getImages(), Toast.LENGTH_SHORT).show();
                            imagePicture.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View view) {
                                    // Start the new activity here
                                    Intent intent = new Intent(MainActivity.this, UploadActivity.class);
                                    intent.putExtra("id", user.getId());
                                    startActivity(intent);
                                }
                            });
                        } catch (IOException e) {
                            Toast.makeText(getApplicationContext(), e.getMessage(), Toast.LENGTH_SHORT).show();
                            Log.d("Exception Failure", e.getMessage());
                        }
                    } else {
                        Toast.makeText(getApplicationContext(), "Đăng nhập thất bại", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Toast.makeText(getApplicationContext(), t.getMessage(), Toast.LENGTH_SHORT).show();
                    Log.d("Response Failure", t.getMessage());
                }
            });
        } catch (Exception e) {
            Toast.makeText(getApplicationContext(), e.getMessage(), Toast.LENGTH_SHORT).show();
            Log.d("Login Error", e.getMessage());
        }
    }
}