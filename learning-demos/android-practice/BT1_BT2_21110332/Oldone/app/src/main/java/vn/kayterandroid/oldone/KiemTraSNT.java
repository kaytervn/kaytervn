package vn.kayterandroid.oldone;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import java.util.ArrayList;
import java.util.Scanner;

public class KiemTraSNT {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Khởi tạo ArrayList để lưu trữ các số nguyên
        ArrayList<Integer> integerList = new ArrayList<>();

        System.out.print("Nhập số lượng phần tử trong mảng: ");
        int n = scanner.nextInt();

        System.out.println("Nhập " + n + " số nguyên:");

        for (int i = 0; i < n; i++) {
            System.out.print("Phần tử thứ " + (i + 1) + ": ");
            int number = scanner.nextInt();

            // Thêm số nguyên vào ArrayList
            integerList.add(number);
        }

        // Kiểm tra và hiển thị các số chính phương trong mảng
        System.out.println("Các số nguyên tố trong mảng:");

        for (int number : integerList) {
            if (isPrime(number)) {
                System.out.println(number);
            }
        }

        // Đóng Scanner để tránh rò rỉ tài nguyên
        scanner.close();
    }

    // Hàm kiểm tra số chính phương
    private static boolean isPrime(int number) {
        if (number <= 1) {
            return false;
        }
        for (int i = 2; i <= Math.sqrt(number); i++) {
            if (number % i == 0) {
                return false;
            }
        }
        return true;
    }
}
