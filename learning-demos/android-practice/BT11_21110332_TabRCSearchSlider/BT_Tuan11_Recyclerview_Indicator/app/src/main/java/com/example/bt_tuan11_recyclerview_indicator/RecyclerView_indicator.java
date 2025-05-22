package com.example.bt_tuan11_recyclerview_indicator;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.widget.SearchView;
import java.util.ArrayList;

public class RecyclerView_indicator extends AppCompatActivity {

    private RecyclerView rcIcon;
    private IconAdapter iconAdapter;
    private ArrayList<IconModel> arrayList1;
    private SearchView searchView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recycler_view_indicator);

        rcIcon = findViewById(R.id.rcIcon);
        arrayList1 = new ArrayList<>();
        arrayList1.add(new IconModel(R.drawable.thunder, "Icon 1"));
        arrayList1.add(new IconModel(R.drawable.shopee_sieu_re, "Icon 2"));
        arrayList1.add(new IconModel(R.drawable.voucher, "Icon 3"));
        arrayList1.add(new IconModel(R.drawable.icon_free_ship, "Icon 4"));
        arrayList1.add(new IconModel(R.drawable.outlet50, "Icon 5"));
        arrayList1.add(new IconModel(R.drawable.voucher_extra, "Icon 6"));
        arrayList1.add(new IconModel(R.drawable.hangquocte, "Icon 7"));

        iconAdapter = new IconAdapter(this, arrayList1);
        rcIcon.setAdapter(iconAdapter);
        rcIcon.setLayoutManager(new LinearLayoutManager(this));

        searchView = findViewById(R.id.searchView);
        searchView.clearFocus();
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                filterListener(newText);
                return true;
            }
        });
    }

    private void filterListener(String text) {
        ArrayList<IconModel> filteredList = new ArrayList<>();
        for (IconModel iconModel : arrayList1) {
            if (iconModel.getDesc().toLowerCase().contains(text.toLowerCase())) {
                filteredList.add(iconModel);
            }
        }
        if (filteredList.isEmpty()) {
            Toast.makeText(this, "Không có dữ liệu", Toast.LENGTH_SHORT).show();
        } else {
            iconAdapter.setListenerList(filteredList);
        }
    }
}