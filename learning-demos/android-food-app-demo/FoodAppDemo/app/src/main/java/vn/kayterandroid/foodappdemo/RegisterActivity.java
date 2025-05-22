package vn.kayterandroid.foodappdemo;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.io.IOException;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.kayterandroid.foodappdemo.model.User;
import vn.kayterandroid.foodappdemo.utils.APIService;
import vn.kayterandroid.foodappdemo.utils.RetrofitClient;
import vn.kayterandroid.foodappdemo.utils.SessionManager;

public class RegisterActivity extends AppCompatActivity {

    EditText inputName, inputEmail, inputPassword;
    TextView textLogin;
    APIService apiService;
    Button buttonRegister;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        mapping();
        textLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
                startActivity(intent);
            }
        });

        buttonRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                apiService = RetrofitClient.getAPIService();
                User registerUser = new User(
                        inputName.getText().toString(),
                        inputEmail.getText().toString(),
                        inputPassword.getText().toString()
                );
                Call<ResponseBody> call = apiService.register(registerUser);
                call.enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        if (response.isSuccessful()) {
                            try {
                                String json = response.body().string();
                                JsonObject userObject = new Gson().fromJson(json, JsonObject.class)
                                        .getAsJsonObject("user");
                                SessionManager.getInstance(getApplicationContext()).saveLoginUser(
                                        userObject.get("_id").getAsString()
                                );
                                Intent intent = new Intent(RegisterActivity.this, HomeActivity.class);
                                startActivity(intent);
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        } else {
                            String errorMessage = "";
                            try {
                                JsonObject errorJson = new Gson().fromJson(response.errorBody().string(), JsonObject.class);
                                errorMessage = errorJson.get("error").getAsString();
                            } catch (IOException e) {
                                throw new RuntimeException(e);
                            }
                            Toast.makeText(getApplicationContext(), errorMessage, Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        Log.d("Failed to call API", t.getMessage());
                    }
                });
            }
        });
    }

    void mapping() {
        inputName = findViewById(R.id.inputName);
        inputEmail = findViewById(R.id.inputEmail);
        inputPassword = findViewById(R.id.inputPassword);
        textLogin = findViewById(R.id.textLogin);
        buttonRegister = findViewById(R.id.buttonRegister);
    }
}