package vn.kayterandroid.foodappdemo;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.app.Activity;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.MimeTypeMap;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.github.dhaval2404.imagepicker.ImagePicker;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.io.File;
import java.io.IOException;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.kayterandroid.foodappdemo.dao.CartItemDatabase;
import vn.kayterandroid.foodappdemo.databinding.ActivityCartBinding;
import vn.kayterandroid.foodappdemo.databinding.ActivityProfileBinding;
import vn.kayterandroid.foodappdemo.utils.APIService;
import vn.kayterandroid.foodappdemo.utils.RealPathUtil;
import vn.kayterandroid.foodappdemo.utils.RetrofitClient;
import vn.kayterandroid.foodappdemo.utils.SessionManager;

public class ProfileActivity extends Fragment {
    APIService apiService;
    ImageView imagePicture;
    TextView textName, textEmail, textPassword;
    Button buttonLogout;
    String id;
    FloatingActionButton buttonUpload;
    ActivityProfileBinding binding;
    Context context;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    void getUser() {
        id = SessionManager.getInstance(context).getId();
        apiService = RetrofitClient.getAPIService();
        Call<ResponseBody> call = apiService.getUser(id);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        String json = response.body().string();
                        JsonObject userObject = new Gson().fromJson(json, JsonObject.class).getAsJsonObject("user");
                        textName.setText(userObject.get("name").getAsString());
                        textEmail.setText(userObject.get("email").getAsString());
                        textPassword.setText(userObject.get("password").getAsString());
                        if (userObject.get("image").getAsString().length() > 0) {
                            Glide.with(context).load(userObject.get("image").getAsString()).into(imagePicture);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } else {
                    Toast.makeText(context, "Response Failed", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.d("Failed to call API", t.getMessage());
            }
        });
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_OK && data != null) {
            Uri uri = data.getData();
            if (uri != null) {
                imagePicture.setImageURI(uri);
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setTitle("Cập nhật ảnh đại diện");
                builder.setMessage("Bạn muốn cập nhật ảnh này chứ?");
                builder.setPositiveButton("Xác nhận", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        String realPath = RealPathUtil.getRealPath(context, uri);
                        File file = new File(realPath);

                        RequestBody requestFile = RequestBody.create(MediaType.parse("multipart/form-data"), file);
                        MultipartBody.Part imagePart = MultipartBody.Part.createFormData("image", file.getName(), requestFile);

                        apiService = RetrofitClient.getAPIService();
                        Call<ResponseBody> call = apiService.updateUser(id, imagePart);
                        call.enqueue(new Callback<ResponseBody>() {
                            @Override
                            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                                if (response.isSuccessful()) {
                                    Toast.makeText(context, "Cập nhật ảnh thành công", Toast.LENGTH_SHORT).show();
                                } else {
                                    String errorMessage = "";
                                    try {
                                        JsonObject errorJson = new Gson().fromJson(response.errorBody().string(), JsonObject.class);
                                        errorMessage = errorJson.get("error").getAsString();
                                    } catch (IOException e) {
                                        throw new RuntimeException(e);
                                    }
                                    Toast.makeText(context, errorMessage, Toast.LENGTH_SHORT).show();
                                }
                                Intent intent = new Intent(context, HomeActivity.class);
                                intent.putExtra("tabIndex", 0);
                                startActivity(intent);
                            }

                            @Override
                            public void onFailure(Call<ResponseBody> call, Throwable t) {
                                Toast.makeText(context, t.getMessage(), Toast.LENGTH_SHORT).show();
                                Log.d("Failed to call API", t.getMessage());
                            }
                        });
                    }
                });
                builder.setNegativeButton("Hủy", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });

                AlertDialog dialog = builder.create();
                dialog.show();
            }
        }
    }


    void mapping() {
        context = getActivity();
        imagePicture = binding.imagePicture;
        textName = binding.textName;
        textEmail = binding.textEmail;
        textPassword = binding.textPassword;
        buttonLogout = binding.buttonLogout;
        buttonUpload = binding.buttonUpload;
        buttonUpload.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ImagePicker.Companion.with(ProfileActivity.this).crop().compress(512).maxResultSize(200, 200).start();
            }
        });
        buttonLogout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setTitle("Đăng xuất").setMessage("Bạn có chắc muốn đăng xuất tài khoản không?")
                        .setPositiveButton("Có", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                SessionManager.getInstance(context).clearLoginUser();
                                Intent intent = new Intent(context, MainActivity.class);
                                startActivity(intent);
                            }
                        }).setNegativeButton("Không", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                            }
                        }).show();
            }
        });
    }

    @Nullable
    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater,
            @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        binding = ActivityProfileBinding.inflate(inflater, container, false);
        mapping();
        getUser();
        return binding.getRoot();
    }
}