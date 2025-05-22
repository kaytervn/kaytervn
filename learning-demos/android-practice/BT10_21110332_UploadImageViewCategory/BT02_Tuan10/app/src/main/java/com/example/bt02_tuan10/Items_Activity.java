package com.example.bt02_tuan10;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Items_Activity extends AppCompatActivity {

    RecyclerView rcItem;

    ItemsAdapter ItemsAdapter;
    APIService apiService;
    List<Item> ItemList;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_items);
        Intent intent = getIntent();
        String nameCategory = intent.getStringExtra("nameCategory");
        TextView txtCate = (TextView) findViewById(R.id.txt_Category);
        txtCate.setText(String.valueOf(nameCategory));
        AnhXa();
        GetItems();
        ItemsAdapter adapter = new ItemsAdapter(this, ItemList);
        rcItem.setAdapter(adapter);
    }
    private void AnhXa(){
        rcItem = (RecyclerView) findViewById(R.id.rc_items);
    }
    private void GetItems(){
        Intent intent = getIntent();
        int idCategory = intent.getIntExtra("idCategory", 1);
        apiService = RetrofitClient.getRetrofit().create(APIService.class);
        apiService.getItemAll(String.valueOf(idCategory)).enqueue(new Callback<List<Item>>() {
            @Override
            public void onResponse(Call<List<Item>> call, Response<List<Item>> response) {
                if(response.isSuccessful()){
                    ItemList = response.body();
                    ItemsAdapter = new ItemsAdapter(Items_Activity.this, ItemList);
                    rcItem.setHasFixedSize(true);
                    rcItem.setLayoutManager(new GridLayoutManager(getApplicationContext(), 3));
                    rcItem.setAdapter(ItemsAdapter);
                    ItemsAdapter.notifyDataSetChanged();
                }else{
                    int statusCode = response.code();
                }
            }

            @Override
            public void onFailure(Call<List<Item>> call, Throwable t) {
                Log.d("logg", t.getMessage());
            }
        });
    }
}