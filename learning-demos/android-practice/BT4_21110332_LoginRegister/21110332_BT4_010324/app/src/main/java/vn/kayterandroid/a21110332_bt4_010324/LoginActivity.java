package vn.kayterandroid.a21110332_bt4_010324;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        Intent intent = getIntent();
        String name = intent.getStringExtra("name");
        String email = intent.getStringExtra("email");
        String password = intent.getStringExtra("password");

        final EditText inputEmail = findViewById(R.id.inputEmail);
        final EditText inputPassword = findViewById(R.id.inputPassword);

        if(!TextUtils.isEmpty(email) && !TextUtils.isEmpty(password)){
            inputEmail.setText(email);
            inputPassword.setText(password);
        }


        TextView linkRegister = findViewById(R.id.linkRegister);

        linkRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
                startActivity(intent);
            }
        });

        ImageButton buttonLogin = findViewById(R.id.buttonLogin);

        buttonLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String inp_email = inputEmail.getText().toString();
                String inp_password = inputPassword.getText().toString();
                if(TextUtils.isEmpty(inp_email) || TextUtils.isEmpty(inp_password)) {
                    Toast.makeText(LoginActivity.this, "Vui lòng điền thông tin!", Toast.LENGTH_SHORT).show();
                }
                else if(TextUtils.isEmpty(name)){
                    Toast.makeText(LoginActivity.this, "Tài khoản chưa được đăng ký!", Toast.LENGTH_SHORT).show();
                }
                else{
                    Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
                    intent.putExtra("name", name);
                    intent.putExtra("email", email);
                    intent.putExtra("password", password);
                    startActivity(intent);
                }
            }
        });
    }
}