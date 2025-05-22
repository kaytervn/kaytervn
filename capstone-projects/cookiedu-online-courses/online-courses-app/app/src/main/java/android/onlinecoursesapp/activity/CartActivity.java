package android.onlinecoursesapp.activity;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.onlinecoursesapp.adapter.CartItemsAdapter;
import android.os.Bundle;
import android.util.Log;
import android.onlinecoursesapp.R;
import android.onlinecoursesapp.model.Course;
import android.onlinecoursesapp.utils.APIService;
import android.onlinecoursesapp.utils.RetrofitClient;
import android.onlinecoursesapp.utils.SessionManager;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CartActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private CartItemsAdapter cartItemsAdapter;
    private List<Course> courses = new ArrayList<>();
    private int expectedCourses = 0;
    private TextView emptyCartTextView, totalCartTxt ;
    Button buttonHome, buttonMyCourses, buttonCart, buttonProfile ;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cart);

        recyclerView = findViewById(R.id.view);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        findViewById(R.id.loadingPanel1).setVisibility(View.VISIBLE);
        mapping();
        setEvent();
        getCart();
    }
    private void setEvent() {
        buttonCart.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#E91E63")));
        buttonHome.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(CartActivity.this, HomeActivity.class);
                startActivity(intent);
                finish();
            }
        });
        buttonProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(CartActivity.this, ProfileActivity.class);
                startActivity(intent);
                finish();
            }
        });
        buttonMyCourses.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(CartActivity.this, MyCourseActivity.class);
                startActivity(intent);
            }
        });

    }
    private void getCart() {

        String token = SessionManager.getInstance(getApplicationContext()).getKeyToken();
        APIService apiService = RetrofitClient.getAPIService();

        Call<ResponseBody> call = apiService.getCart("Bearer " + token);

        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {

                if (response.isSuccessful()) {
                    try {

                        String json = response.body().string();
                        JsonObject jsonObject = new Gson().fromJson(json, JsonObject.class);
                        JsonArray jsonArray = jsonObject.getAsJsonArray("cartItems");
                        expectedCourses = jsonArray.size();
                        if (expectedCourses == 0) {
                            emptyCartTextView.setVisibility(View.VISIBLE);
                        } else {
                            emptyCartTextView.setVisibility(View.GONE);
                            for (JsonElement element : jsonArray) {
                                String courseId = element.getAsJsonObject().get("courseId").getAsString();
                                fetchCourseDetails(courseId);
                            }
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } else {
                    Log.e("CartActivity", "Failed to load cart items");
                }
                findViewById(R.id.loadingPanel1).setVisibility(View.GONE);
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.e("CartActivity", "Error: " + t.getMessage());
            }
        });
    }

    private void fetchCourseDetails(String courseId) {
        String cartId = SessionManager.getInstance(getApplicationContext()).getKeyCartId();
        Log.d("CartActivity", "cart id: " + cartId);
        APIService apiService = RetrofitClient.getAPIService();
        Call<ResponseBody> call = apiService.getCourse(courseId);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        String json = response.body().string();
                        Course.CourseDetailsResponse courseDetailsResponse = new Gson().fromJson(json, Course.CourseDetailsResponse.class);
                        Course course = courseDetailsResponse.getCourse();
                        courses.add(course);
                        if (courses.size() == expectedCourses) {
                            cartItemsAdapter = new CartItemsAdapter(getApplicationContext(), courses, apiService, cartId, CartActivity.this::updateTotalCost);
                            recyclerView.setAdapter(cartItemsAdapter);
                            updateTotalCost();
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.e("GET_COURSE", "Failed to fetch course: " + t.getMessage());
            }
        });
    }

    void mapping() {
        buttonHome = findViewById(R.id.buttonHome);
        buttonMyCourses = findViewById(R.id.buttonMyCourses);
        buttonCart = findViewById(R.id.buttonCart);
        buttonProfile = findViewById(R.id.buttonProfile);
        emptyCartTextView = findViewById(R.id.emptyCartTextView);
        totalCartTxt = findViewById(R.id.totalCartTxt);
        TextView checkoutCartTxt = findViewById(R.id.checkoutCartTxt);
        checkoutCartTxt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                goToCheckOut();
            }
        });
        updateCheckoutButtonState();
    }
    public void updateTotalCost() {
        double totalCost = 0;
        for (Course course : courses) {
            totalCost += course.getPrice();
        }
        String formattedTotalCost = String.format("%.2f$", totalCost);
        totalCartTxt.setText(formattedTotalCost);
        updateCheckoutButtonState();
    }
    private void updateCheckoutButtonState() {
        TextView checkoutCartTxt = findViewById(R.id.checkoutCartTxt);
        if (courses.isEmpty()) {
            checkoutCartTxt.setEnabled(false);
            checkoutCartTxt.setTextColor(Color.GRAY); // Đặt màu chữ thành màu xám để chỉ ra rằng nút bị vô hiệu
        } else {
            checkoutCartTxt.setEnabled(true);
            checkoutCartTxt.setTextColor(Color.BLACK); // Đặt màu chữ thành màu đen khi nút có thể nhấn
        }
    }
    private void goToCheckOut() {
        Intent intent = new Intent(CartActivity.this, CheckOutActivity.class);
        intent.putExtra("TotalCost", totalCartTxt.getText().toString());

        ArrayList<String> courseTitles = new ArrayList<>();
        ArrayList<String> coursePrices = new ArrayList<>();
        ArrayList<String> courseImages = new ArrayList<>(); // Danh sách để lưu trữ URL hình ảnh của mỗi khóa học

        for (Course course : courses) {
            courseTitles.add(course.getTitle());
            coursePrices.add(String.valueOf(course.getPrice()));
            courseImages.add(course.getPicture()); // Lấy URL hình ảnh từ mỗi khóa học
        }

        intent.putStringArrayListExtra("CourseTitles", courseTitles);
        intent.putStringArrayListExtra("CoursePrices", coursePrices);
        intent.putStringArrayListExtra("CourseImages", courseImages); // Thêm danh sách URL hình ảnh vào intent

        startActivity(intent);
    }


}
