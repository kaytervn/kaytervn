package vn.kayterandroid.a211103332_w6_080324;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.GridView;
import android.widget.ListView;

import java.util.ArrayList;

public class GridViewActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_grid_view);
        GridView listView = findViewById(R.id.gridView1);
        ArrayList<MonHoc> arrayList = new ArrayList<>();
        arrayList.add(new MonHoc("Java","Lập trình Java",R.drawable.java));
        arrayList.add(new MonHoc("C#","Lập trình C++",R.drawable.cpp));
        arrayList.add(new MonHoc("PHP","Lập trình PHP",R.drawable.php));
        arrayList.add(new MonHoc("Kotlin","Lập trình Kotlin",R.drawable.kotlin));
        arrayList.add(new MonHoc("Dart","Lập trình Dart",R.drawable.dart));

        MonHocAdapter adapter = new MonHocAdapter(GridViewActivity.this,
                R.layout.row_monhoc_grid,
                arrayList
        );
        listView.setAdapter(adapter);
    }
}