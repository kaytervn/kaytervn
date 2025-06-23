package com.finance.ui.fragment.key.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.key.KeyResponse;
import com.finance.databinding.ItemKeyBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class KeyAdapter extends RecyclerView.Adapter<KeyAdapter.KeyViewHolder> {

    @Getter
    private List<KeyResponse> keys;
    @Getter
    @Setter
    private boolean lock;

    private final ViewBinderHelper viewBinderHelper = new ViewBinderHelper();

    public KeyAdapter(){
        viewBinderHelper.setOpenOnlyOne(true);
    }

    @SuppressLint("NotifyDataSetChanged")
    public void setKeys(List<KeyResponse> keys){
        this.keys = keys;
        notifyDataSetChanged();
    }
    @Getter
    @Setter
    private KeyListener keyListener;
    public interface KeyListener{
        void itemClick(int position, KeyResponse Key);
        void deleteKey(int position, KeyResponse Key);
    }
    @NonNull
    @Override
    public KeyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemKeyBinding binding = ItemKeyBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new KeyViewHolder(binding,keyListener);
    }

    @Override
    public void onBindViewHolder(@NonNull KeyViewHolder holder, int position) {
        holder.onBind(position);
    }

    @Override
    public int getItemCount() {
        return keys!= null? keys.size() : 0;
    }

    public void addList(List<KeyResponse> keys){
        if(keys == null){
            return;
        }
        this.keys.addAll(keys);
        notifyItemRangeInserted(this.keys.size() - keys.size(),keys.size());
    }

    @SuppressLint("NotifyDataSetChanged")
    public void deleteItem(int position){
        keys.remove(position);
        notifyDataSetChanged();
    }

    public void updateItem(Integer position, KeyResponse keyResponse){
        keys.set(position,keyResponse);
        notifyItemChanged(position);
    }

    public class KeyViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        ItemKeyBinding binding;
        KeyListener keyListener;
        int position;
        KeyResponse key;
        public KeyViewHolder(ItemKeyBinding binding, KeyListener keyListener) {
            super(binding.getRoot());
            this.binding = binding;
            binding.getRoot().setOnClickListener(this);
            this.keyListener = keyListener;
        }

        void onBind(int position){
            this.position = position;
            key = keys.get(position);
            viewBinderHelper.bind(binding.swipeRevealLayout, String.valueOf(key.getId()));
            if(lock){
                viewBinderHelper.lockSwipe(String.valueOf(key.getId()));
            }
            binding.setIvm(key);
            binding.setSecretKey(SecretKey.getInstance().getKey());
            binding.imgDelete.setOnClickListener(view -> {
                keyListener.deleteKey(position,key);
                viewBinderHelper.closeLayout(String.valueOf(key.getId()));
            });
            binding.layoutKey.setOnClickListener(view -> keyListener.itemClick(position,key));
            binding.executePendingBindings();
        }

        @Override
        public void onClick(View view) {
            keyListener.itemClick(position, key);
        }
    }
}
