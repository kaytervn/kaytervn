package android.onlinecoursesapp.activity;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.onlinecoursesapp.model.User;
import android.onlinecoursesapp.utils.APIService;
import android.onlinecoursesapp.utils.RetrofitClient;
import android.onlinecoursesapp.utils.SessionManager;
import android.os.Bundle;
import android.onlinecoursesapp.R;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    EditText inputEmail;
    EditText inputPassword;
    TextView textRegister;
    Button buttonLogin;
    APIService apiService;
    String token, cartId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        mapping();
        setEvent();
        if (token != "") {
            Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
            startActivity(intent);
            finish();
        }
    }

    void setEvent() {
        textRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
                startActivity(intent);
                finish();
            }
        });

        buttonLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loginUser();
            }
        });
    }

    void loginUser() {
        apiService = RetrofitClient.getAPIService();
        User loginUser = new User(inputEmail.getText().toString(), inputPassword.getText().toString());
        Call<ResponseBody> call = apiService.login(loginUser);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        String json = response.body().string();
                        JsonObject jsonObject = JsonParser.parseString(json).getAsJsonObject();
                        String token = jsonObject.get("token").getAsString();
                        String cartId = jsonObject.get("cartId").getAsString();
                        SessionManager.getInstance(LoginActivity.this).saveLoginUser(token, cartId);
                        Log.d("infor", token + " va : " + cartId);
                        Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                        startActivity(intent);
                        finish();
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
                    Toast.makeText(LoginActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.d("Failed to call API", t.getMessage());
            }
        });
    }

    void mapping() {
        inputEmail = findViewById(R.id.inputEmail);
        inputPassword = findViewById(R.id.inputPassword);
        buttonLogin = findViewById(R.id.buttonLogin);
        textRegister = findViewById(R.id.textRegister);
        token = SessionManager.getInstance(LoginActivity.this).getKeyToken();
        cartId = SessionManager.getInstance(LoginActivity.this).getKeyCartId();

    }
}