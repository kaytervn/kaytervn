package vn.kayterandroid.foodappdemo;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

import vn.kayterandroid.foodappdemo.adapter.CartAdapter;
import vn.kayterandroid.foodappdemo.dao.CartItemDatabase;
import vn.kayterandroid.foodappdemo.databinding.ActivityCartBinding;
import vn.kayterandroid.foodappdemo.databinding.ActivityDashboardBinding;
import vn.kayterandroid.foodappdemo.model.CartItem;
import vn.kayterandroid.foodappdemo.utils.SessionManager;

public class CartActivity extends Fragment {
    List<CartItem> cartItems = new ArrayList<>();
    CartAdapter cartAdapter;
    RecyclerView recyclerViewCartItems;
    String userId;
    Button buttonContinueShopping;
    ActivityCartBinding binding;
    Context context;
    EditText editSearch;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    void mapping() {
        context = getActivity();
        editSearch = binding.editSearch;
        recyclerViewCartItems = binding.recyclerViewCartItems;
        buttonContinueShopping = binding.buttonContinueShopping;
        userId = SessionManager.getInstance(context).getId();
        buttonContinueShopping.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context, HomeActivity.class);
                intent.putExtra("tabIndex", 0);
                startActivity(intent);
            }
        });
        editSearch.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                    searchCartItems();
                    hideSoftKeyboard();
                }
                return false;
            }
        });
        cartItemsMapping();
    }

    void searchCartItems() {
        String strKey = editSearch.getText().toString().trim();
        cartItems = new ArrayList<>();
        cartItems = CartItemDatabase.getInstance(context).cartItemDAO().findByTitle(strKey);
        if (cartItems.size() == 0) {
            Toast.makeText(context, "Không có kết quả", Toast.LENGTH_SHORT).show();
        }
        cartAdapter.setData(cartItems);
    }

    void cartItemsMapping() {

        cartItems = CartItemDatabase.getInstance(context).cartItemDAO().getAll(userId);
        cartAdapter = new CartAdapter(context, new CartAdapter.OnItemClickListener() {
            @Override
            public void onIncreaseButtonClick(CartItem cartItem) {
                cartItem.setQuantity(cartItem.getQuantity() + 1);
                CartItemDatabase.getInstance(context).cartItemDAO().updateCartItem(cartItem);
                loadData();
            }

            @Override
            public void onDecreaseButtonClick(CartItem cartItem) {
                if (cartItem.getQuantity() > 1) {
                    cartItem.setQuantity(cartItem.getQuantity() - 1);
                    CartItemDatabase.getInstance(context).cartItemDAO().updateCartItem(cartItem);
                    loadData();
                }
            }

            @Override
            public void onDeleteButtonClick(CartItem cartItem) {
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setTitle("Xác nhận xóa").setMessage("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?").setPositiveButton("Có", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        CartItemDatabase.getInstance(context).cartItemDAO().deleteCartItem(cartItem);
                        loadData();
                        Toast.makeText(context, "Xóa thành công", Toast.LENGTH_SHORT).show();
                    }
                }).setNegativeButton("Không", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                    }
                }).show();
            }
        });

        cartAdapter.setData(cartItems);
        recyclerViewCartItems.setHasFixedSize(false);
        recyclerViewCartItems.setLayoutManager(new LinearLayoutManager(context));
        recyclerViewCartItems.setAdapter(cartAdapter);
    }

    void hideSoftKeyboard() {
        try {
            InputMethodManager inputMethodManager = (InputMethodManager) requireContext().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(requireView().getWindowToken(), 0);
        } catch (NullPointerException ex) {
            ex.printStackTrace();
        }
    }

    void loadData() {
        cartItems = CartItemDatabase.getInstance(context).cartItemDAO().getAll(userId);
        cartAdapter.setData(cartItems);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = ActivityCartBinding.inflate(inflater, container, false);
        mapping();
        return binding.getRoot();
    }
}