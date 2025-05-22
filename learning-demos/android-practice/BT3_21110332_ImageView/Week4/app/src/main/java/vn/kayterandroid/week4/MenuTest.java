package vn.kayterandroid.week4;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.ContextMenu;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

public class MenuTest extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu_test);

        Button btnButton = findViewById(R.id.button);

        btnButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PopupMenu popupMenu = new PopupMenu(MenuTest.this, v);
                popupMenu.getMenuInflater().inflate(R.menu.menu_test, popupMenu.getMenu());
                popupMenu.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                    @Override
                    public boolean onMenuItemClick(MenuItem item) {
                        int itemId = item.getItemId();

                        if (itemId == R.id.menuSetting) {
                            Toast.makeText(MenuTest.this, "Bạn đang chọn Setting", Toast.LENGTH_LONG).show();
                        } else if (itemId == R.id.menuShare) {
                            btnButton.setText("Chia sẻ");
                        } else if (itemId == R.id.menuLogout) {
                            ThongBaoDangXuat();
                        }

                        return false;
                    }
                });
                popupMenu.show();
            }
        });
        TextView textView = findViewById(R.id.textView);

        // Đăng ký ContextMenu cho TextView
        registerForContextMenu(textView);

        Button button = findViewById(R.id.button2);
        Dialog dialog = new Dialog(MenuTest.this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog);
        dialog.setCanceledOnTouchOutside(false);

        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.show();
            }
        });
        Button closeButton = dialog.findViewById(R.id.dialog_button);
        closeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_test,menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int itemId = item.getItemId();
        if (itemId == R.id.menuSetting) {
            Toast.makeText(MenuTest.this, "Bạn đang chọn Setting", Toast.LENGTH_LONG).show();
        } else if (itemId == R.id.menuShare) {
            Toast.makeText(MenuTest.this, "Chia sẻ thành công", Toast.LENGTH_LONG).show();
        } else if (itemId == R.id.menuLogout) {
            ThongBaoDangXuat();
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onCreateContextMenu(ContextMenu menu, View v,
                                    ContextMenu.ContextMenuInfo menuInfo) {
        getMenuInflater().inflate(R.menu.menu_test,menu);
        menu.setHeaderTitle("Context Menu");
        menu.setHeaderIcon(R.mipmap.ic_launcher);
        super.onCreateContextMenu(menu, v, menuInfo);
    }

    @Override
    public boolean onContextItemSelected(@NonNull MenuItem item) {
        int itemId = item.getItemId();

        if (itemId == R.id.menuSetting) {
            Toast.makeText(MenuTest.this, "Bạn đang chọn Setting", Toast.LENGTH_LONG).show();
        } else if (itemId == R.id.menuShare) {
            TextView textView = findViewById(R.id.textView);
            textView.setText("Nhấn giữ: [Chia sẻ]");
        } else if (itemId == R.id.menuLogout) {
            ThongBaoDangXuat();
        }
        return super.onContextItemSelected(item);
    }
    private void ThongBaoDangXuat(){
        AlertDialog.Builder alert = new AlertDialog.Builder(this);
        alert.setTitle("Thông báo");
        alert.setMessage("Bạn có muốn đăng xuất không");
        alert.setPositiveButton("Có", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Toast.makeText(MenuTest.this, "Bạn đã chọn đăng xuất", Toast.LENGTH_LONG).show();
            }
        });
        alert.setNegativeButton("Không", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Toast.makeText(MenuTest.this, "Không đăng xuất", Toast.LENGTH_LONG).show();
            }
        });
        alert.show();
    }
}