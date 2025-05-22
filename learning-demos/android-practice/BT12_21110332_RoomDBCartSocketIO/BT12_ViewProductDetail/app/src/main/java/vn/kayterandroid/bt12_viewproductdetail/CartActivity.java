package vn.kayterandroid.bt12_viewproductdetail;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

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
import vn.kayterandroid.bt12_viewproductdetail.dao.CartItemDatabase;
import vn.kayterandroid.bt12_viewproductdetail.model.CartItem;
import vn.kayterandroid.bt12_viewproductdetail.model.Food;
import vn.kayterandroid.bt12_viewproductdetail.recyclerview.CartAdapter;
import vn.kayterandroid.bt12_viewproductdetail.recyclerview.MyAdapter;
import vn.kayterandroid.bt12_viewproductdetail.utils.APIService;
import vn.kayterandroid.bt12_viewproductdetail.utils.RetrofitClient;

public class CartActivity extends AppCompatActivity {
    List<CartItem> cartItems = new ArrayList<>();
    CartAdapter cartAdapter;
    RecyclerView recyclerViewCartItems;

    Button buttonContinueShopping;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cart);
        recyclerViewCartItems = findViewById(R.id.recyclerViewCartItems);
        buttonContinueShopping = findViewById(R.id.buttonContinueShopping);

        buttonContinueShopping.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(CartActivity.this, MainActivity.class);
                startActivity(intent);
            }
        });

        cartItems = CartItemDatabase.getInstance(this).cartItemDAO().getAll();
        cartAdapter = new CartAdapter(this, new CartAdapter.OnItemClickListener() {
            @Override
            public void onIncreaseButtonClick(CartItem cartItem) {
                cartItem.setQuantity(cartItem.getQuantity() + 1);
                CartItemDatabase.getInstance(CartActivity.this).cartItemDAO().updateCartItem(cartItem);
                loadData();
            }

            @Override
            public void onDecreaseButtonClick(CartItem cartItem) {
                if (cartItem.getQuantity() > 1) {
                    cartItem.setQuantity(cartItem.getQuantity() - 1);
                    CartItemDatabase.getInstance(CartActivity.this).cartItemDAO().updateCartItem(cartItem);
                    loadData();
                }
            }

            @Override
            public void onDeleteButtonClick(CartItem cartItem) {
                AlertDialog.Builder builder = new AlertDialog.Builder(CartActivity.this);
                builder.setTitle("Xác nhận xóa")
                        .setMessage("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?")
                        .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                CartItemDatabase.getInstance(CartActivity.this).cartItemDAO().deleteCartItem(cartItem);
                                loadData();
                            }
                        })
                        .setNegativeButton("No", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                            }
                        })
                        .show();
            }
        });

        cartAdapter.setData(cartItems);
        recyclerViewCartItems.setHasFixedSize(false);
        recyclerViewCartItems.setLayoutManager(new LinearLayoutManager(getApplicationContext()));
        recyclerViewCartItems.setAdapter(cartAdapter);
    }

    void loadData() {
        cartItems = CartItemDatabase.getInstance(this).cartItemDAO().getAll();
        cartAdapter.setData(cartItems);
    }
}