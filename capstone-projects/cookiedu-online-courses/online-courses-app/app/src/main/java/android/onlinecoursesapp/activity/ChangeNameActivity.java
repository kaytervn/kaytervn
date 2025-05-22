package android.onlinecoursesapp.activity;

import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.onlinecoursesapp.model.User;
import android.onlinecoursesapp.utils.APIService;
import android.onlinecoursesapp.utils.RetrofitClient;
import android.onlinecoursesapp.utils.SessionManager;
import android.os.Bundle;
import android.onlinecoursesapp.R;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.github.dhaval2404.imagepicker.ImagePicker;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChangeNameActivity extends AppCompatActivity {

    EditText inputName;
    Button buttonChangeName;
    TextView textCancel;
    Button buttonHome, buttonMyCourses, buttonCart, buttonProfile;
    APIService apiService;
    String token;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_change_name);
        mapping();
        getUser();
        setEvent();
    }

    void mapping() {
        buttonHome = findViewById(R.id.buttonHome);
        buttonMyCourses = findViewById(R.id.buttonMyCourses);
        buttonCart = findViewById(R.id.buttonCart);
        buttonProfile = findViewById(R.id.buttonProfile);

        inputName = findViewById(R.id.inputName);
        buttonChangeName = findViewById(R.id.buttonChangeName);
        textCancel = findViewById(R.id.textCancel);
    }

    void setEvent() {
        buttonProfile.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#E91E63")));
        buttonHome.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ChangeNameActivity.this, HomeActivity.class);
                startActivity(intent);
                finish();
            }
        });
        buttonMyCourses.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(ChangeNameActivity.this, MyCourseActivity.class);
                startActivity(intent);
            }
        });
        buttonCart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(ChangeNameActivity.this, CartActivity.class);
                startActivity(intent);
            }
        });

        textCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ChangeNameActivity.this, ProfileActivity.class);
                startActivity(intent);
                finish();
            }
        });

        buttonChangeName.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AlertDialog.Builder builder = new AlertDialog.Builder(ChangeNameActivity.this);
                builder.setTitle("Update name").setMessage("Confirm change?")
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                changeName();
                            }
                        }).setNegativeButton("No", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                            }
                        }).show();
            }
        });

    }

    void getUser() {
        token = SessionManager.getInstance(ChangeNameActivity.this).getKeyToken();
        if (token == "") {
            Intent intent = new Intent(ChangeNameActivity.this, LoginActivity.class);
            startActivity(intent);
            finish();
        } else {
            apiService = RetrofitClient.getAPIService();
            Call<ResponseBody> call = apiService.getUser("Bearer " + token);
            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        try {
                            String json = response.body().string();
                            JsonObject userObject = new Gson().fromJson(json, JsonObject.class).getAsJsonObject("user");
                            inputName.setText(userObject.get("name").getAsString());
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    } else {
                        Toast.makeText(ChangeNameActivity.this, "Response Failed", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Log.d("Failed to call API", t.getMessage());
                }
            });
        }
    }

    private void changeName() {
        apiService = RetrofitClient.getAPIService();
        User changeUserName = new User(inputName.getText().toString());
        Call<ResponseBody> call = apiService.changeUserName("Bearer " + token, changeUserName);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(ChangeNameActivity.this, "User name updated successfully!", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(ChangeNameActivity.this, ProfileActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    String errorMessage = "";
                    try {
                        JsonObject errorJson = new Gson().fromJson(response.errorBody().string(), JsonObject.class);
                        errorMessage = errorJson.get("error").getAsString();
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                    Toast.makeText(ChangeNameActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.d("Failed to call API", t.getMessage());
            }
        });
    }
}