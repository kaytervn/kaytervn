package android.onlinecoursesapp.activity;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.onlinecoursesapp.adapter.CoursesAdapter;
import android.onlinecoursesapp.model.CartItem;
import android.onlinecoursesapp.model.Course;
import android.onlinecoursesapp.utils.APIService;
import android.onlinecoursesapp.utils.RetrofitClient;
import android.onlinecoursesapp.utils.SessionManager;
import android.os.Bundle;
import android.onlinecoursesapp.R;
import android.os.Handler;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HomeActivity extends AppCompatActivity {

    Button buttonHome, buttonMyCourses, buttonCart, buttonProfile;
    TextView textName;
    ImageView imagePicture;
    APIService apiService;
    EditText editSearch;
    Spinner selectSort, selectTopic;
    int currentPage = 1;
    List<Course> courses;
    boolean isLoading = false;
    boolean isLastPage = false;
    RecyclerView recyclerViewCourses;
    CoursesAdapter coursesAdapter;
    Handler handler;
    TextView textMessage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        mapping();
        setEvent();
        getUser();
        initAdapter();
    }

    private void initAdapter() {
        coursesAdapter = new CoursesAdapter(HomeActivity.this, new CoursesAdapter.OnItemClickListener() {

            @Override
            public void onViewIntroClick(Course course) {
                Log.d("addtocart", "view intro");
                Intent intent = new Intent(HomeActivity.this, CourseIntroActivity.class);
                intent.putExtra("course_id", course.getId());
                startActivity(intent);

            }

            @Override
            public void onAddToCartClick(Course course) {
                String cartId = SessionManager.getInstance(HomeActivity.this).getKeyCartId();
                String token = SessionManager.getInstance(HomeActivity.this).getKeyToken();
                CartItem cartItemRequest = new CartItem(cartId, course.getId());

                apiService.addToCart("Bearer " + token, cartItemRequest).enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        if (response.isSuccessful()) {
                            Toast.makeText(HomeActivity.this, "Course added to cart successfully", Toast.LENGTH_SHORT).show();
                        } else {
                            // Handle error response
                            String errorMessage = "Failed to add course to cart"; // Default error message
                            if (response.errorBody() != null) {
                                try {
                                    // Try to parse the error body to get detailed error message
                                    String errorBody = response.errorBody().string();
                                    JSONObject errorObject = new JSONObject(errorBody);
                                    if (errorObject.has("error")) {
                                        errorMessage = errorObject.getString("error");
                                    }
                                } catch (IOException | JSONException e) {
                                    e.printStackTrace(); // Log the exception
                                }
                            }
                            Toast.makeText(HomeActivity.this, errorMessage, Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        Toast.makeText(HomeActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
            }

        });
        coursesAdapter.setData(courses);
        recyclerViewCourses.setHasFixedSize(false);
        recyclerViewCourses.setLayoutManager(new LinearLayoutManager(HomeActivity.this));
        recyclerViewCourses.setAdapter(coursesAdapter);
        recyclerViewCourses.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
            }

            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);
                LinearLayoutManager layoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
                if (!isLoading && !isLastPage) {
                    if (layoutManager != null && layoutManager.findLastCompletelyVisibleItemPosition() == courses.size() - 1) {
                        loadMoreData();
                        isLoading = true;
                    }
                }
            }
        });
    }

    String getSortValue(String sort) {
        switch (sort) {
            case "Newest":
                return "newest";
            case "Oldest":
                return "oldest";
            case "Highest Price":
                return "highestPrice";
            case "Lowest Price":
                return "lowestPrice";
            default:
                return "newest";
        }
    }

    private void loadMoreData() {
        List<Course> newCourses = new ArrayList<>();
        newCourses.addAll(courses);
        newCourses.add(null);
        coursesAdapter.setData(newCourses);
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                currentPage++;
                searchCourses();
                isLoading = false;
            }
        }, 1000);
    }

    private void searchCourses() {
        apiService = RetrofitClient.getAPIService();
        Course.SearchCourses searchCourses = new Course.SearchCourses(editSearch.getText().toString(), selectTopic.getSelectedItem().toString(), getSortValue(selectSort.getSelectedItem().toString()), currentPage);
        Call<ResponseBody> call = apiService.searchCourses(searchCourses);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        String jsonString = response.body().string();
                        JSONObject jsonObject = new JSONObject(jsonString);
                        JSONArray coursesArray = jsonObject.getJSONArray("courses");

                        if (coursesArray.length() == 0) {
                            isLastPage = true;
                        } else {
                            for (int i = 0; i < coursesArray.length(); i++) {
                                JSONObject courseObject = coursesArray.getJSONObject(i);

                                String date = courseObject.getString("createdAt");
                                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                                    DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                                    DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                                    date = LocalDate.parse(courseObject.getString("createdAt"), inputFormatter).format(outputFormatter);
                                }

                                courses.add(new Course(courseObject.getString("_id"), courseObject.getString("instructorName"), courseObject.getString("title"), courseObject.getString("topic"), courseObject.getString("picture"), courseObject.getString("description"), date, Float.parseFloat(courseObject.getString("price"))));
                            }
                        }
                    } catch (JSONException | IOException e) {
                        e.printStackTrace();
                    }
                    if (courses.size() == 0) {
                        textMessage.setVisibility(View.VISIBLE);
                        Toast.makeText(HomeActivity.this, "Course Not Found.", Toast.LENGTH_SHORT).show();
                    }
                    else{
                        textMessage.setVisibility(View.GONE);
                    }
                    coursesAdapter.setData(courses);
                } else {
                    Toast.makeText(HomeActivity.this, "Response Failed", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.d("Failed to call API", t.getMessage());
            }
        });
    }

    private void setEvent() {
        textMessage.setVisibility(View.GONE);
        buttonHome.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#E91E63")));
        buttonMyCourses.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(HomeActivity.this, MyCourseActivity.class);
                startActivity(intent);
            }
        });
        buttonCart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                Intent intent = new Intent(HomeActivity.this, CartActivity.class);
                startActivity(intent);
            }
        });
        buttonProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(HomeActivity.this, ProfileActivity.class);
                startActivity(intent);
                finish();
            }
        });
        editSearch.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                    hideSoftKeyboard();
                    filer();
                    return true;
                }
                return false;
            }
        });
        final boolean[] isFirstSelection = {true};

        selectSort.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                if (!isFirstSelection[0]) {
                    filer();
                } else {
                    isFirstSelection[0] = false;
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parentView) {
            }
        });

        selectTopic.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                filer();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parentView) {
            }
        });
    }

    void hideSoftKeyboard() {
        View view = this.getCurrentFocus();
        if (view != null) {
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }

    void filer() {
        List<Course> newCourses = new ArrayList<>();
        newCourses.add(null);
        coursesAdapter.setData(newCourses);
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                courses.clear();
                currentPage = 1;
                isLastPage = false;
                searchCourses();
                isLoading = false;
            }
        }, 1000);
    }

    void getUser() {
        String token = SessionManager.getInstance(HomeActivity.this).getKeyToken();
        if (token == "") {
            Intent intent = new Intent(HomeActivity.this, LoginActivity.class);
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
                            textName.setText(userObject.get("name").getAsString());
                            String imageURL = userObject.get("picture").getAsString();
                            if (imageURL.length() > 0) {
                                Glide.with(HomeActivity.this).load(imageURL).into(imagePicture);
                            }
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    } else {
                        Toast.makeText(HomeActivity.this, "Response Failed", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Log.d("Failed to call API", t.getMessage());
                }
            });
        }
    }

    void mapping() {
        courses = new ArrayList<>();
        buttonHome = findViewById(R.id.buttonHome);
        buttonMyCourses = findViewById(R.id.buttonMyCourses);
        buttonCart = findViewById(R.id.buttonCart);
        buttonProfile = findViewById(R.id.buttonProfile);
        textName = findViewById(R.id.textName);
        imagePicture = findViewById(R.id.imagePicture);
        editSearch = findViewById(R.id.editSearch);
        selectSort = findViewById(R.id.selectSort);
        selectTopic = findViewById(R.id.selectTopic);
        recyclerViewCourses = findViewById(R.id.recyclerViewCourses);
        textMessage = findViewById(R.id.textMessage);
        handler = new Handler();
    }
}