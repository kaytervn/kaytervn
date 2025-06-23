package com.finance.ui.key.filter.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.data.SecretKey;
import com.finance.data.model.api.response.key.KeyGroupResponse;
import com.finance.databinding.ItemGroupBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
public class KeyGroupSelectAdapter extends RecyclerView.Adapter<KeyGroupSelectAdapter.KeyGroupSelectViewHolder> {

    private final List<KeyGroupResponse> keyGroups;

    @Setter
    private Long isSelected;

    public KeyGroupSelectAdapter(List<KeyGroupResponse> keyGroups, KeyGroupSelectListener keyGroupSelectListener) {
        this.keyGroups = keyGroups;
        this.keyGroupSelectListener = keyGroupSelectListener;
    }


    @Setter
    private KeyGroupSelectListener keyGroupSelectListener;
    @Setter
    private boolean lock;

    public void updateItem(Integer position, KeyGroupResponse keyGroupResponse) {
        keyGroups.set(position, keyGroupResponse);
        notifyItemChanged(position);
    }


    public interface KeyGroupSelectListener{
        void itemClick(View view, int position);

    }
    @NonNull
    @Override
    public KeyGroupSelectViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemGroupBinding binding = ItemGroupBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new KeyGroupSelectViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull KeyGroupSelectViewHolder holder, int position) {
        holder.onBind(position);
        holder.binding.layoutMain.setOnClickListener(view -> keyGroupSelectListener.itemClick(view, position));
    }

    @Override
    public int getItemCount() {
        return keyGroups!= null? keyGroups.size() : 0;
    }

    public void addList(List<KeyGroupResponse> keyGroups){
        if(keyGroups == null){
            return;
        }
        this.keyGroups.addAll(keyGroups);
        notifyItemRangeInserted(this.keyGroups.size() - keyGroups.size(),keyGroups.size());
    }

    public void deleteItem(int position){
        keyGroups.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, keyGroups.size());
    }

    public class KeyGroupSelectViewHolder extends RecyclerView.ViewHolder{
        ItemGroupBinding binding;
        int position;
        KeyGroupResponse keyGroup;
        public KeyGroupSelectViewHolder(ItemGroupBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void onBind(int position){
            this.position = position;
            keyGroup = keyGroups.get(position);
            binding.setIvm(keyGroup);
            binding.setIvmSelectedId(isSelected);
            binding.setSecretKey(SecretKey.getInstance().getKey());
            binding.executePendingBindings();
        }

    }
}
