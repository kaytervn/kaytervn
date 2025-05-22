package vn.kayterandroid.a211103332_w6_080324;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.GridView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.tabs.TabLayout;

import java.util.ArrayList;

public class ListViewActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list_view);
        ListView listView = findViewById(R.id.listView1);
        ArrayList<MonHoc> arrayList = new ArrayList<>();
        arrayList.add(new MonHoc("Java", "Lập trình Java", R.drawable.java));
        arrayList.add(new MonHoc("C#", "Lập trình C++", R.drawable.cpp));
        arrayList.add(new MonHoc("PHP", "Lập trình PHP", R.drawable.php));
        arrayList.add(new MonHoc("Kotlin", "Lập trình Kotlin", R.drawable.kotlin));
        arrayList.add(new MonHoc("Dart", "Lập trình Dart", R.drawable.dart));

        MonHocAdapter adapter = new MonHocAdapter(ListViewActivity.this,
                R.layout.row_monhoc,
                arrayList
        );
        listView.setAdapter(adapter);

        TabLayout tabLayout = findViewById(R.id.tabLayout);
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                int position = tab.getPosition();

                switch (position) {
                    case 1:
                        startActivity(new Intent(ListViewActivity.this, GridViewActivity.class));
                        break;
                    case 2:
//                        startActivity(new Intent(MainActivity.this, ThirdActivity.class));
                        break;
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {
            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {
            }
        });

//        ListView listView = findViewById(R.id.listview1);
//        ArrayList<MonHoc> arrayList = new ArrayList<>();
//        arrayList.add(new MonHoc("Java","Lập trình Java",R.drawable.java));
//        arrayList.add(new MonHoc("C#","Lập trình C++",R.drawable.cpp));
//        arrayList.add(new MonHoc("PHP","Lập trình PHP",R.drawable.php));
//        arrayList.add(new MonHoc("Kotlin","Lập trình Kotlin",R.drawable.kotlin));
//        arrayList.add(new MonHoc("Dart","Lập trình Dart",R.drawable.dart));
//
//        MonHocAdapter adapter = new MonHocAdapter(ListViewActivity.this,
//                R.layout.row_monhoc,
//                arrayList
//        );
//        listView.setAdapter(adapter);
//        TextView textId = findViewById(R.id.textViewId);
//
//        Button btnAdd = findViewById(R.id.btnAdd);
//        Button btnUpdate = findViewById(R.id.btnUpdate);
//        Button btnDelete = findViewById(R.id.btnDelete);
//
//        EditText inputText = findViewById(R.id.inputText);
//        int index = Integer.parseInt(textId.getText().toString());

//        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
//            @Override
//            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
//                textId.setText("" + i);
//                Toast.makeText(ListViewActivity.this, "Item thứ " + i + 1 + " đã được Click", Toast.LENGTH_SHORT).show();
//            }
//        });

//        listView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
//            @Override
//            public boolean
//            onItemLongClick(AdapterView<?> adapterView,
//                            View view, int i, long l) {
//                Toast.makeText(ListViewActivity.this, "Bạn đang nhấn giữ " + i + " - " + arrayList.get(i),
//                        Toast.LENGTH_SHORT).show();
//                return false;
//            }
//        });

//        btnAdd.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                String name = inputText.getText().toString();
//                arrayList.add(name);
//                adapter.notifyDataSetChanged();
//            }
//        });
//        btnUpdate.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                try {
//                    arrayList.set(index, inputText.getText().toString());
//                    adapter.notifyDataSetChanged();
//                } catch (Exception e) {
//                    Toast.makeText(ListViewActivity.this, "Vui lòng chọn một Item", Toast.LENGTH_SHORT).show();
//                }
//            }
//        });

//        btnDelete.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                try {
//                    arrayList.remove((index));
//                    adapter.notifyDataSetChanged();
//                } catch (Exception e) {
//                    Toast.makeText(ListViewActivity.this, "Vui lòng chọn một Item", Toast.LENGTH_SHORT).show();
//                }
//            }
//        });
    }
}