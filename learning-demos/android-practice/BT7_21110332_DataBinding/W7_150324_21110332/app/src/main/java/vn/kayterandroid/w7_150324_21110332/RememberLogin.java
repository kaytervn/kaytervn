package vn.kayterandroid.w7_150324_21110332;

import androidx.appcompat.app.AppCompatActivity;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.Toast;

public class RememberLogin extends AppCompatActivity {
    EditText inputUsername, inputPassword;
    CheckBox cbRemember;
    Button btnLogin;
    SharedPreferences sharedPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_remember_login);
        AnhXa();

        btnLogin.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                String password = inputUsername.getText().toString().trim();
                String username = inputPassword.getText().toString().trim();
                if (username.equals("admin") && password.equals("admin")) {
                    Toast.makeText(RememberLogin.this, "Đăng nhập thành công", Toast.LENGTH_SHORT).show();
                    if (cbRemember.isChecked()) {
                        SharedPreferences.Editor editor = sharedPreferences.edit();
                        editor.putString("taikhoan", username);
                        editor.putString("matkhau", password);
                        editor.putBoolean("trangthai", true);
                        editor.commit();
                    } else {
                        SharedPreferences.Editor editor = sharedPreferences.edit();
                        editor.remove("taikhoan");
                        editor.remove("matkhau");
                        editor.remove("trangthai");
                        editor.commit();
                    }
                } else {
                    Toast.makeText(RememberLogin.this, "Đăng nhập thất bại", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    void AnhXa() {
        inputUsername = findViewById(R.id.inputUsername);
        inputPassword = findViewById(R.id.inputPassword);
        cbRemember = findViewById(R.id.cbRemember);
        btnLogin = findViewById(R.id.btnLogin);

        sharedPreferences = getSharedPreferences ("dataLogin", MODE_PRIVATE);
        inputUsername.setText(sharedPreferences.getString("taikhoan", ""));
        inputPassword.setText(sharedPreferences.getString("matkhau", ""));
        cbRemember.setChecked (sharedPreferences.getBoolean("trangthai", false));
    }
}