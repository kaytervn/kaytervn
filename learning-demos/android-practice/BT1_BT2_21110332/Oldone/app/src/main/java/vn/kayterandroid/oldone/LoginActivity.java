package vn.kayterandroid.oldone;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Ẩn tiêu đề Android
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.activity_login);

        // Ánh xạ
        TextView txtThongBao = (TextView) findViewById(R.id.txtThongBao);
        Button btnLogin = findViewById(R.id.btnLogin);
        EditText txtUsername = (EditText) findViewById(R.id.txtUsername);
        EditText txtPassword = (EditText) findViewById(R.id.txtPassword);

        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //viết code
                if (txtUsername.getText().toString().equals("trong") && txtPassword.getText().toString().equals("123")) {
                    setContentView(R.layout.activity_main);
                    TextView txtTextView = (TextView) findViewById(R.id.txtTextView);

                    // Set text
                    txtTextView.setText("Welcome, Kiến Đức Trọng!\n\tMSSV: 21110332\n\tHCMUTE");
                } else {
                    txtThongBao.setTextColor(getResources().getColor(R.color.red));
                    txtThongBao.setText("Đăng nhập thất bại: " + txtPassword.getText().toString());
                }
            }
        });
    }
}