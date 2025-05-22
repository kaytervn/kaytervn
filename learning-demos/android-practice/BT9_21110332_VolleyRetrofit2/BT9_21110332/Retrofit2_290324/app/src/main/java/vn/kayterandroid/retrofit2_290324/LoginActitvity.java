package vn.kayterandroid.retrofit2_290324;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActitvity extends AppCompatActivity {
    EditText inputUsername, inputPassword;
    APIService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_actitvity);
        if (SharedPrefManager.getInstance(this).isLoggedIn()) {
            finish();
            startActivity(new Intent(this, ProfileActivity.class));
        }
        inputUsername = findViewById(R.id.inputUsername);
        inputPassword = findViewById(R.id.inputPassword);
        findViewById(R.id.buttonSubmit).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                userLogin();
            }
        });
    }

    private void userLogin() {
        final String username = inputUsername.getText().toString();
        final String password = inputPassword.getText().toString();
        if (TextUtils.isEmpty(username)) {
            inputUsername.setError("Please enter your username");
            inputUsername.requestFocus();
            return;
        }
        if (TextUtils.isEmpty(password)) {
            inputPassword.setError("Please enter your password");
            inputPassword.requestFocus();
            return;
        }
        try {
            apiService = RetrofitClient.getRetrofit().create(APIService.class);
            Call<ResponseBody> call = apiService.login(username, password);
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
                                    userObject.get("id").getAsInt(),
                                    userObject.get("username").getAsString(),
                                    userObject.get("email").getAsString(),
                                    userObject.get("gender").getAsString(),
                                    userObject.get("images").getAsString()
                            );
                            SharedPrefManager.getInstance(getApplicationContext()).userLogin(user);
                            finish();
//                            Intent intent = new Intent(LoginActitvity.this, ProfileActivity.class);
//                            startActivity(intent);
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