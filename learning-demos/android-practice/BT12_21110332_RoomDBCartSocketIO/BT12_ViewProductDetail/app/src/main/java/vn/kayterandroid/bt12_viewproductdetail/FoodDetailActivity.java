package vn.kayterandroid.bt12_viewproductdetail;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.io.IOException;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.kayterandroid.bt12_viewproductdetail.dao.CartItemDatabase;
import vn.kayterandroid.bt12_viewproductdetail.model.CartItem;
import vn.kayterandroid.bt12_viewproductdetail.recyclerview.CartAdapter;
import vn.kayterandroid.bt12_viewproductdetail.utils.APIService;
import vn.kayterandroid.bt12_viewproductdetail.utils.RetrofitClient;

public class FoodDetailActivity extends AppCompatActivity {

    String id;
    Intent intent;
    APIService apiService;
    TextView textTitle, textPrice, textDescription;
    ImageView imagePicture;
    Button buttonAddToCart;
    CartAdapter cartAdapter;
    String imageURL;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_food_detail);
        mapping();
        getFoodDetail();
        buttonAddToCart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (CartItemDatabase.getInstance(FoodDetailActivity.this).cartItemDAO()
                        .checkCartItemExistence(
                                imageURL,
                                textTitle.getText().toString(),
                                Integer.parseInt(textPrice.getText().toString())) > 0) {
                    CartItem item = CartItemDatabase.getInstance(FoodDetailActivity.this).cartItemDAO().getCartItem(
                            imageURL,
                            textTitle.getText().toString(),
                            Integer.parseInt(textPrice.getText().toString())
                    );
                    item.setQuantity(item.getQuantity() + 1);
                    CartItemDatabase.getInstance(FoodDetailActivity.this).cartItemDAO().updateCartItem(item);
                } else {
                    CartItemDatabase.getInstance(FoodDetailActivity.this).cartItemDAO().addCartItem(new CartItem(
                            imageURL,
                            textTitle.getText().toString(),
                            Integer.parseInt(textPrice.getText().toString()),
                            1
                    ));
                }
                Intent intent = new Intent(FoodDetailActivity.this, CartActivity.class);
                startActivity(intent);
            }
        });
    }

    void mapping() {
        textTitle = findViewById(R.id.textTitle);
        textPrice = findViewById(R.id.textPrice);
        textDescription = findViewById(R.id.textDescription);
        imagePicture = findViewById(R.id.imagePicture);
        buttonAddToCart = findViewById(R.id.buttonAddToCart);
    }

    void getFoodDetail() {
        intent = getIntent();
        id = intent.getExtras().getString("foodId");
        apiService = RetrofitClient.getAPIService();
        Call<ResponseBody> call = apiService.getFood(id);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        String json = response.body().string();
                        JsonObject userObject = new Gson().fromJson(json, JsonObject.class)
                                .getAsJsonObject("food");
                        textTitle.setText(userObject.get("title").getAsString());
                        textPrice.setText(userObject.get("price").getAsString());
                        textDescription.setText(userObject.get("description").getAsString());
                        imageURL = userObject.get("image").getAsString();
                        if (userObject.get("image").getAsString().length() > 0) {
                            Glide.with(getApplicationContext())
                                    .load(userObject.get("image").getAsString())
                                    .into(imagePicture);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
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
}