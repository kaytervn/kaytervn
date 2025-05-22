package vn.kayterandroid.oldone;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.text.BreakIterator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class KiemTraSCP extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Ẩn tiêu đề Android
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.activity_input_array);

        // Ánh xạ
        TextView txtThongBao = (TextView) findViewById(R.id.txtThongBao);
        EditText editMangSo = (EditText) findViewById(R.id.editMangSo);
        Button btnThucHien = findViewById(R.id.btnThucHien);

        btnThucHien.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                xuLyMang(editMangSo, txtThongBao);
            }
        });
    }

    private void xuLyMang(EditText editMangSo, TextView txtThongBao) {
        String inputText = editMangSo.getText().toString().trim();
        List<String> inputList = Arrays.asList(inputText.split(" "));

        txtThongBao.setText("");
        // Convert inputList to ArrayList<Integer> if needed
        ArrayList<Integer> numberList = new ArrayList<>();
        for (String number : inputList) {
            try {
                numberList.add(Integer.parseInt(number.trim()));
            } catch (NumberFormatException e) {
                txtThongBao.setText("Vui lòng nhập số hợp lệ.");
            }
        }

        // Print perfect square numbers using Toast
        ArrayList<Integer> perfectSquareNumbers = findPerfectSquares(numberList);
        for (Integer perfectSquare : perfectSquareNumbers) {
            Toast.makeText(getApplicationContext(), "Perfect Square: " + perfectSquare, Toast.LENGTH_SHORT).show();
        }
    }

    private ArrayList<Integer> findPerfectSquares(ArrayList<Integer> numbers) {
        ArrayList<Integer> perfectSquareNumbers = new ArrayList<>();
        for (Integer number : numbers) {
            if (isPerfectSquare(number)) {
                perfectSquareNumbers.add(number);
            }
        }
        return perfectSquareNumbers;
    }

    private static boolean isPerfectSquare(int num) {
        double squareRoot = Math.sqrt(num);
        return squareRoot == (int) squareRoot;
    }
}