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
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.List;

import vn.kayterandroid.foodappdemo.CartActivity;
import vn.kayterandroid.foodappdemo.R;
import vn.kayterandroid.foodappdemo.model.CartItem;

public class CartAdapter extends RecyclerView.Adapter<CartAdapter.ItemViewHolder> {

    Context context;
    List<CartItem> cartItems;
    OnItemClickListener listener;

    public CartAdapter(Context context, OnItemClickListener listener) {
        this.context = context;
        this.listener = listener;
    }

    public void setData(List<CartItem> cartItems) {
        this.cartItems = cartItems;
        notifyDataSetChanged();
    }

    public interface OnItemClickListener {
        void onIncreaseButtonClick(CartItem cartItem);

        void onDecreaseButtonClick(CartItem cartItem);

        void onDeleteButtonClick(CartItem cartItem);
    }

    @NonNull
    @Override
    public ItemViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ItemViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.cart_item_view, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull ItemViewHolder holder, int position) {
        holder.bind(cartItems.get(position), listener);
        holder.textTitle.setText(cartItems.get(position).getTitle());
        holder.textQuantity.setText(String.valueOf(cartItems.get(position).getQuantity()));
        holder.textPrice.setText(String.valueOf(cartItems.get(position).getSubTotal()) + "$");
        Glide.with(context)
                .load(cartItems.get(position).getImage())
                .into(holder.imagePicture);
    }

    @Override
    public int getItemCount() {
        return cartItems.size();
    }

    public class ItemViewHolder extends RecyclerView.ViewHolder {

        ImageView imagePicture;
        TextView textTitle;
        TextView textPrice;

        FloatingActionButton buttonDecrease, buttonIncrease, buttonDelete;
        TextView textQuantity;

        public ItemViewHolder(@NonNull View itemView) {
            super(itemView);
            imagePicture = itemView.findViewById(R.id.imagePicture);
            textTitle = itemView.findViewById(R.id.textTitle);
            textPrice = itemView.findViewById(R.id.textPrice);
            textQuantity = itemView.findViewById(R.id.textQuantity);
            buttonDecrease = itemView.findViewById(R.id.buttonDecrease);
            buttonIncrease = itemView.findViewById(R.id.buttonIncrease);
            buttonDelete = itemView.findViewById(R.id.buttonDelete);
        }

        public void bind(CartItem cartItem, final OnItemClickListener listener) {
            buttonIncrease.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    listener.onIncreaseButtonClick(cartItem);
                }
            });

            buttonDecrease.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    listener.onDecreaseButtonClick(cartItem);
                }
            });

            buttonDelete.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    listener.onDeleteButtonClick(cartItem);
                }
            });
        }
    }
}
