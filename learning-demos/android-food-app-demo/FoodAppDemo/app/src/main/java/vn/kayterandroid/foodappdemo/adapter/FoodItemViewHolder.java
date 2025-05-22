package vn.kayterandroid.foodappdemo.adapter;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import vn.kayterandroid.foodappdemo.R;
import vn.kayterandroid.foodappdemo.model.Food;

public class FoodItemViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
    ImageView imagePicture;
    TextView textTitle;
    List<Food> foods;
    private FoodAdapter.RecyclerViewClickListener listener;

    public FoodItemViewHolder(@NonNull View itemView, FoodAdapter.RecyclerViewClickListener listener, List<Food> foods) {
        super(itemView);
        this.listener = listener;
        this.foods = foods;
        imagePicture = itemView.findViewById(R.id.imagePicture);
        textTitle = itemView.findViewById(R.id.textTitle);
        itemView.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        if (listener != null) {
            int position = getAdapterPosition();
            if (position != RecyclerView.NO_POSITION) {
                listener.onItemClick(foods.get(position));
            }
        }
    }
}