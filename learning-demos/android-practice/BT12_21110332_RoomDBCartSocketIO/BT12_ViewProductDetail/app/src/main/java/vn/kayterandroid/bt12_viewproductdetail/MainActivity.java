package vn.kayterandroid.bt12_viewproductdetail;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.kayterandroid.bt12_viewproductdetail.model.Food;
import vn.kayterandroid.bt12_viewproductdetail.recyclerview.MyAdapter;
import vn.kayterandroid.bt12_viewproductdetail.recyclerview.RecyclerViewClickListener;
import vn.kayterandroid.bt12_viewproductdetail.utils.APIService;
import vn.kayterandroid.bt12_viewproductdetail.utils.RetrofitClient;

public class MainActivity extends AppCompatActivity implements RecyclerViewClickListener {
    APIService apiService;
    List<Food> listFoods = new ArrayList<>();
    MyAdapter foodsAdapter;
    RecyclerView recyclerViewFoods;
    FloatingActionButton buttonCart;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        recyclerViewFoods = findViewById(R.id.recyclerViewFoods);
        buttonCart = findViewById(R.id.buttonCart);
        buttonCart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, CartActivity.class);
                startActivity(intent);
            }
        });
        getFoods();
    }

    void getFoods() {
        apiService = RetrofitClient.getAPIService();
        Call<ResponseBody> call = apiService.getFoods();
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        String jsonString = response.body().string();
                        JSONObject jsonObject = new JSONObject(jsonString);
                        JSONArray foodsArray = jsonObject.getJSONArray("foods");
                        for (int i = 0; i < foodsArray.length(); i++) {
                            JSONObject foodObject = foodsArray.getJSONObject(i);
                            listFoods.add(new Food(
                                    foodObject.getString("_id"),
                                    foodObject.getString("image"),
                                    foodObject.getString("title"),
                                    foodObject.getString("price"),
                                    foodObject.getString("description")
                            ));
                        }
                    } catch (JSONException | IOException e) {
                        e.printStackTrace();
                    }
                    foodsAdapter = new MyAdapter(MainActivity.this, listFoods, MainActivity.this);
                    recyclerViewFoods.setHasFixedSize(true);
                    recyclerViewFoods.setLayoutManager(new GridLayoutManager(getApplicationContext(), 2));
                    recyclerViewFoods.setAdapter(foodsAdapter);
                    foodsAdapter.notifyDataSetChanged();
                } else {
                    Toast.makeText(getApplicationContext(), "Response Failed", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.d("Failed to call API", t.getMessage());
            }
        });
    }

    @Override
    public void onItemClick(Food food) {
        Intent intent = new Intent(MainActivity.this, FoodDetailActivity.class);
        intent.putExtra("foodId", food.getId());
        startActivity(intent);
    }
}