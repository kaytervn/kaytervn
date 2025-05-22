package android.onlinecoursesapp.activity;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.onlinecoursesapp.R;
import android.onlinecoursesapp.adapter.LessonAdapter;
import android.onlinecoursesapp.model.CourseIntro;
import android.onlinecoursesapp.model.Lesson;
import android.onlinecoursesapp.utils.APIService;
import android.onlinecoursesapp.utils.RetrofitClient;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CourseDetailActivity extends AppCompatActivity {

    Button buttonHome, buttonMyCourses, buttonCart, buttonProfile;
    private TextView textTitle, textDescription, textInstructorName, textTopic, textAverageStar;
    private ImageView imagePicture;
    private RecyclerView recyclerViewLessons;
    private LessonAdapter lessonAdapter;
    private APIService apiService;
    private String courseId;
    private TextView tvNoLessons;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_course_detail);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        toolbar.setNavigationOnClickListener(v -> onBackPressed());

        textTitle = findViewById(R.id.tvTitleCourse1);
        textDescription = findViewById(R.id.tvDescriptionCourse1);
        textInstructorName = findViewById(R.id.tvInstructorNameCourse1);
        textTopic = findViewById(R.id.tvTopicCourse1);
        imagePicture = findViewById(R.id.ivPictureCourse1);
        textAverageStar = findViewById(R.id.tvRatingStar1);

        recyclerViewLessons = findViewById(R.id.recyclerViewLessons);
        recyclerViewLessons.setLayoutManager(new LinearLayoutManager(this));




        tvNoLessons = findViewById(R.id.tvNoLessons);
        mapping();
        setEvent();
        findViewById(R.id.loadingPanel).setVisibility(View.VISIBLE);

        courseId = getIntent().getStringExtra("course_id");
        getCourseDetails(courseId);
        getCourseLessons(courseId);
    }

    private void setEvent(){
        buttonProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(CourseDetailActivity.this, ProfileActivity.class);
                startActivity(intent);
            }
        });
        buttonMyCourses.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(CourseDetailActivity.this, MyCourseActivity.class);
                startActivity(intent);
            }
        });
        buttonHome.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(CourseDetailActivity.this, HomeActivity.class);
                startActivity(intent);
            }
        });
        buttonCart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(CourseDetailActivity.this, CartActivity.class);
                startActivity(intent);
            }
        });
    }

    private void mapping(){
        buttonHome = findViewById(R.id.buttonHome);
        buttonMyCourses = findViewById(R.id.buttonMyCourses);
        buttonCart = findViewById(R.id.buttonCart);
        buttonProfile = findViewById(R.id.buttonProfile);
    }

    private void getCourseDetails(String courseId) {
        apiService = RetrofitClient.getAPIService();
        Call<ResponseBody> call = apiService.getCourseIntro(courseId);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        String responseBody = response.body().string();
                        JSONObject jsonResponse = new JSONObject(responseBody);

                        JSONObject courseJSON = jsonResponse.getJSONObject("course");
                        double averageStars = jsonResponse.getDouble("averageStars");
                        Gson gson = new Gson();
                        CourseIntro course = gson.fromJson(courseJSON.toString(), CourseIntro.class);

                        textTitle.setText(course.getTitle());
                        textDescription.setText(course.getDescription());
                        textInstructorName.setText(course.getInstructorName());
                        textTopic.setText(course.getTopic());
                        textAverageStar.setText(String.valueOf(averageStars));
                        Glide.with(CourseDetailActivity.this).load(course.getPicture()).into(imagePicture);


                    } catch (IOException | JSONException e) {
                        textDescription.setText("Error: " + e.getMessage());
                        e.printStackTrace();
                    }
                } else {
                    textDescription.setText("Error: Response not successful");
                }
                findViewById(R.id.loadingPanel).setVisibility(View.GONE);
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                textDescription.setText("Error: " + t.getMessage());
                t.printStackTrace();
            }
        });
    }
    private void getCourseLessons(String courseId) {

        apiService = RetrofitClient.getAPIService();
        Call<ResponseBody> call = apiService.getCourseLessons(new Lesson(courseId));
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        String responseBody = response.body().string();
                        JSONObject jsonResponse = new JSONObject(responseBody);

                        JSONArray lessonsJSONArray = jsonResponse.getJSONArray("lessons");
                        if (lessonsJSONArray.length() == 0) {
                            tvNoLessons.setVisibility(View.VISIBLE);
                            recyclerViewLessons.setVisibility(View.GONE);
                        } else {
                            List<Lesson> lessonList = new ArrayList<>();
                            for (int i = 0; i < lessonsJSONArray.length(); i++) {
                                JSONObject lessonJSON = lessonsJSONArray.getJSONObject(i);
                                Lesson lesson = new Lesson(
                                        lessonJSON.getString("_id"),
                                        lessonJSON.getString("courseId"),
                                        lessonJSON.getString("title"),
                                        lessonJSON.getString("description")
                                );
                                lessonList.add(lesson);
                            }
                            showLessons(lessonList);
                        }

                    } catch (IOException | JSONException e) {
                        Toast.makeText(CourseDetailActivity.this, "Error: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                        e.printStackTrace();
                    }
                } else {
                    Toast.makeText(CourseDetailActivity.this, "Error: Response not successful", Toast.LENGTH_SHORT).show();
                }
                findViewById(R.id.loadingPanel).setVisibility(View.GONE);
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(CourseDetailActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                t.printStackTrace();
            }
        });
    }

    private void showLessons(List<Lesson> lessonList) {
        lessonAdapter = new LessonAdapter(this, lessonList);
        recyclerViewLessons.setAdapter(lessonAdapter);
        tvNoLessons.setVisibility(View.GONE);
        recyclerViewLessons.setVisibility(View.VISIBLE);
    }
    @Override
    public void onBackPressed() {
        super.onBackPressed();

         overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right);
    }
}
