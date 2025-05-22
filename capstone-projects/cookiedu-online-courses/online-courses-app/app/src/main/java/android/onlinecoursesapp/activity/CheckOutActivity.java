package android.onlinecoursesapp.activity;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.onlinecoursesapp.adapter.CheckOutCoursesAdapter;
import android.onlinecoursesapp.model.CheckoutRequest;
import android.onlinecoursesapp.utils.APIService;
import android.onlinecoursesapp.utils.RetrofitClient;
import android.onlinecoursesapp.utils.SessionManager;
import android.os.Bundle;
import android.onlinecoursesapp.R;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONObject;

import java.util.ArrayList;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CheckOutActivity extends AppCompatActivity {
    TextView completePaymentTxt;
    private String selectedPaymentMethod = null;
    private boolean isCompleteEnabled = true;
    private RadioGroup paymentMethodRadioGroup;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_check_out);
        Toolbar toolbar = findViewById(R.id.toolbarcheckout);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        toolbar.setNavigationOnClickListener(v -> onBackPressed());

        paymentMethodRadioGroup = findViewById(R.id.paymentMethodRadioGroup);
        RadioButton momoRadioButton = findViewById(R.id.momoRadioButton);
        RadioButton paypalRadioButton = findViewById(R.id.paypalRadioButton);

        momoRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                selectedPaymentMethod = "MOMO";
                paypalRadioButton.setChecked(false);
            }
        });

        paypalRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                selectedPaymentMethod = "PAYPAL";
                momoRadioButton.setChecked(false);
            }
        });
        mapping();
        getCheckout();
        setupCompletePayment();
    }
    private void setupCompletePayment() {
        completePaymentTxt = findViewById(R.id.completePaymentTxt);
        completePaymentTxt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                performCheckout();
            }
        });
    }
    private void performCheckout() {
        String token = "Bearer " + SessionManager.getInstance(getApplicationContext()).getKeyToken();
        if (selectedPaymentMethod == null) {
            Toast.makeText(this, "Please select payment method", Toast.LENGTH_SHORT).show();
            return;
        }
        CheckoutRequest checkoutRequest = new CheckoutRequest(selectedPaymentMethod);

        APIService apiService = RetrofitClient.getAPIService();
        apiService.performCheckout(token, checkoutRequest).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        // Chuyển đổi ResponseBody thành chuỗi
                        String responseString = response.body().string();
                        // Xử lý chuỗi phản hồi, ví dụ phân tích JSON
                        JSONObject jsonObject = new JSONObject(responseString);
                        String message = jsonObject.getString("message"); // Lấy thông điệp từ JSON
                        Toast.makeText(CheckOutActivity.this, message, Toast.LENGTH_LONG).show();
                        navigateToMyCourse();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } else {
                    try {
                        // Lấy và xử lý lỗi từ phản hồi
                        String errorResponse = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorResponse);
                        String errorMessage = jsonObject.getString("error");
                        Toast.makeText(CheckOutActivity.this, "Thanh toán thất bại: " + errorMessage, Toast.LENGTH_LONG).show();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(CheckOutActivity.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    void mapping(){

    }
    private void getCheckout(){
        TextView totalTextView = findViewById(R.id.totalPaymentTxt);
        RecyclerView coursesRecyclerView = findViewById(R.id.view);

        // Nhận dữ liệu
        String totalCost = getIntent().getStringExtra("TotalCost");
        ArrayList<String> courseTitles = getIntent().getStringArrayListExtra("CourseTitles");
        ArrayList<String> coursePrices = getIntent().getStringArrayListExtra("CoursePrices");
        ArrayList<String> courseImages = getIntent().getStringArrayListExtra("CourseImages"); // Nhận danh sách URL hình ảnh

        totalTextView.setText(totalCost);

        // Sử dụng RecyclerView để hiển thị danh sách các khóa học
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        coursesRecyclerView.setLayoutManager(layoutManager);
        CheckOutCoursesAdapter adapter = new CheckOutCoursesAdapter(this, courseTitles, coursePrices, courseImages);
        coursesRecyclerView.setAdapter(adapter);
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Xử lý khi nút home được nhấn
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();  // Gọi phương thức quay lại hoạt động trước đó
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void navigateToMyCourse() {
        Intent homeIntent = new Intent(CheckOutActivity.this, MyCourseActivity.class);
        homeIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK); // Clear the activity stack
        startActivity(homeIntent);
        finish(); // End this activity
    }
}