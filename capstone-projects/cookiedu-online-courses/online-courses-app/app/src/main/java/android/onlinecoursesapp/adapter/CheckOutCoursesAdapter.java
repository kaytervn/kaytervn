package android.onlinecoursesapp.adapter;

import android.content.Context;
import android.onlinecoursesapp.R;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;

public class CheckOutCoursesAdapter extends RecyclerView.Adapter<CheckOutCoursesAdapter.ViewHolder> {

    private Context context;
    private ArrayList<String> titles;
    private ArrayList<String> prices;
    private ArrayList<String> imageUrls; // Danh sách URL hình ảnh

    public CheckOutCoursesAdapter(Context context, ArrayList<String> titles, ArrayList<String> prices, ArrayList<String> imageUrls) {
        this.context = context;
        this.titles = titles;
        this.prices = prices;
        this.imageUrls = imageUrls; // Khởi tạo với danh sách URL hình ảnh
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.checkout_course_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.titleTextView.setText(titles.get(position));
        holder.priceTextView.setText(prices.get(position));
        Glide.with(context) // Sử dụng Glide để tải hình ảnh
                .load(imageUrls.get(position)) // Lấy URL hình ảnh tương ứng
                .into(holder.imageCourseView); // Đặt vào ImageView trong ViewHolder
    }

    @Override
    public int getItemCount() {
        return titles.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView titleTextView;
        TextView priceTextView;
        ImageView imageCourseView; // ImageView để hiển thị hình ảnh

        public ViewHolder(View view) {
            super(view);
            titleTextView = view.findViewById(R.id.titleCourseCheckoutTxt);
            priceTextView = view.findViewById(R.id.priceCourseCheckoutTxt);
            imageCourseView = view.findViewById(R.id.imageCourseCheckout); // Liên kết với ImageView trong layout
        }
    }
}
