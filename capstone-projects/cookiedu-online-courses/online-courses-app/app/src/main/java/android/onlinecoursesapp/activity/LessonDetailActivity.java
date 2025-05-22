package android.onlinecoursesapp.activity;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.onlinecoursesapp.adapter.DocumentsAdapter;
import android.onlinecoursesapp.model.CourseIntro;
import android.onlinecoursesapp.model.Document;
import android.onlinecoursesapp.utils.APIService;
import android.onlinecoursesapp.utils.RetrofitClient;
import android.os.Bundle;
import android.onlinecoursesapp.R;
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
import java.util.Arrays;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LessonDetailActivity extends AppCompatActivity {
    Button buttonHome, buttonMyCourses, buttonCart, buttonProfile;
    private TextView textTitle, textDescription, textInstructorName, textTopic, textAverageStar;
    private ImageView imagePicture;
    private APIService apiService;

    private RecyclerView recyclerViewDocuments;
    private DocumentsAdapter documentsAdapter;
    private List<Document> documentList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lesson_detail);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        toolbar.setNavigationOnClickListener(v -> onBackPressed());

        textTitle = findViewById(R.id.tvTitleCourse2);
        textDescription = findViewById(R.id.tvDescriptionCourse2);
        textInstructorName = findViewById(R.id.tvInstructorNameCourse2);
        textTopic = findViewById(R.id.tvTopicCourse2);
        imagePicture = findViewById(R.id.ivPictureCourse2);
        textAverageStar = findViewById(R.id.tvRatingStar2);

        recyclerViewDocuments = findViewById(R.id.recyclerViewDocuments);
        recyclerViewDocuments.setLayoutManager(new LinearLayoutManager(this));

        String lessonId = getIntent().getStringExtra("lesson_id");
        String courseId = getIntent().getStringExtra("course_id");

        mapping();
        setEvent();
        findViewById(R.id.loadingPanel).setVisibility(View.VISIBLE);
        getCourseDetails(courseId);
        getLessonDocuments(lessonId);
    }

    private void setEvent(){
        buttonProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(LessonDetailActivity.this, ProfileActivity.class);
                startActivity(intent);
            }
        });

        buttonMyCourses.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(LessonDetailActivity.this, MyCourseActivity.class);
                startActivity(intent);
            }
        });
        buttonHome.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(LessonDetailActivity.this, HomeActivity.class);
                startActivity(intent);
            }
        });
        buttonCart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(LessonDetailActivity.this, CartActivity.class);
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
                        Glide.with(LessonDetailActivity.this).load(course.getPicture()).into(imagePicture);


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

    private void getLessonDocuments(String lessonId) {

        APIService apiService = RetrofitClient.getAPIService();
        Call<ResponseBody> call = apiService.getLessonDocuments(new Document(lessonId));
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        String responseBody = response.body().string();
                        JSONObject jsonResponse = new JSONObject(responseBody);

                        JSONArray documentsJSONArray = jsonResponse.getJSONArray("documents");
                        Document[] documents = new Document[documentsJSONArray.length()];
                        for (int i = 0; i < documentsJSONArray.length(); i++) {
                            JSONObject documentJSON = documentsJSONArray.getJSONObject(i);
                            Document document = new Document(
                                    documentJSON.getString("_id"),
                                    documentJSON.getString("lessonId"),
                                    documentJSON.getString("cloudinary"),
                                    documentJSON.getString("title"),
                                    documentJSON.getString("description"),
                                    documentJSON.getString("content")
                            );
                            documents[i] = document;
                        }

                        showDocuments(Arrays.asList(documents));

                    } catch (IOException | JSONException e) {
                        Toast.makeText(LessonDetailActivity.this, "Lỗi: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                        e.printStackTrace();
                    }
                } else {
                    Toast.makeText(LessonDetailActivity.this, "Lỗi: Response not successful", Toast.LENGTH_SHORT).show();
                }
                findViewById(R.id.loadingPanel).setVisibility(View.GONE);
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(LessonDetailActivity.this, "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                t.printStackTrace();
            }
        });
    }

    private void showDocuments(List<Document> documentList) {
        documentsAdapter = new DocumentsAdapter(LessonDetailActivity.this, documentList);
        recyclerViewDocuments.setAdapter(documentsAdapter);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();

        overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right);
    }
}
