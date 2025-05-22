package vn.kayterandroid.foodappdemo.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

import vn.kayterandroid.foodappdemo.R;
import vn.kayterandroid.foodappdemo.model.Food;

public class FoodAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    final int VIEW_TYPE_ITEM = 0;
    final int VIEW_TYPE_LOADING = 1;
    Context context;
    List<Food> listFoods;
    RecyclerViewClickListener listener;

    public void setData(List<Food> foods) {
        this.listFoods = foods;
        notifyDataSetChanged();
    }

    public interface RecyclerViewClickListener {
        void onItemClick(Food food);
    }

    public FoodAdapter(Context context, RecyclerViewClickListener listener) {
        this.context = context;
        this.listener = listener;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == VIEW_TYPE_ITEM) {
            View view = LayoutInflater.from(context).inflate(R.layout.food_item_view, parent, false);
            return new FoodItemViewHolder(view, listener, listFoods);
        } else {
            View view = LayoutInflater.from(context).inflate(R.layout.food_loading_view, parent, false);
            return new FoodLoadingViewHolder(view);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if (holder instanceof FoodItemViewHolder) {
            ((FoodItemViewHolder) holder).textTitle.setText(listFoods.get(position).getTitle());
            Glide.with(context)
                    .load(listFoods.get(position).getImage())
                    .into(((FoodItemViewHolder) holder).imagePicture);
        }
    }

    @Override
    public int getItemViewType(int position) {
        return this.listFoods.get(position) == null ? VIEW_TYPE_LOADING : VIEW_TYPE_ITEM;
    }

    @Override
    public int getItemCount() {
        return this.listFoods == null ? 0 : listFoods.size();
    }
}
