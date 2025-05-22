package vn.kayterandroid.foodappdemo.adapter;

import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import vn.kayterandroid.foodappdemo.R;

public class FoodLoadingViewHolder extends RecyclerView.ViewHolder {

    ProgressBar progressBar;

    public FoodLoadingViewHolder(@NonNull View itemView) {
        super(itemView);
        progressBar = itemView.findViewById(R.id.progressBar);
    }
}
