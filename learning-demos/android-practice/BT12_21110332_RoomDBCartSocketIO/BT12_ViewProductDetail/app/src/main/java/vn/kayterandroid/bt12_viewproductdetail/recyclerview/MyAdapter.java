package vn.kayterandroid.bt12_viewproductdetail.recyclerview;

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

import vn.kayterandroid.bt12_viewproductdetail.R;
import vn.kayterandroid.bt12_viewproductdetail.model.Food;

public class MyAdapter extends RecyclerView.Adapter<MyAdapter.MyViewHolder> {

    Context context;
    List<Food> listFoods;
    RecyclerViewClickListener listener;

    public MyAdapter(Context context, List<Food> listFoods, RecyclerViewClickListener listener) {
        this.context = context;
        this.listFoods = listFoods;
        this.listener = listener;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new MyViewHolder(LayoutInflater.from(context).inflate(R.layout.food_item_view, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        holder.textTitle.setText(listFoods.get(position).getTitle());
        Glide.with(context)
                .load(listFoods.get(position).getImage())
                .into(holder.imagePicture);
    }

    @Override
    public int getItemCount() {
        return listFoods.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {

        ImageView imagePicture;
        TextView textTitle;

        public MyViewHolder(@NonNull View itemView) {
            super(itemView);
            imagePicture = itemView.findViewById(R.id.imagePicture);
            textTitle = itemView.findViewById(R.id.textTitle);
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View v) {
            if (listener != null) {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION) {
                    listener.onItemClick(listFoods.get(position));
                }
            }
        }
    }
}
