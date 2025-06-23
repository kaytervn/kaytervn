package com.finance.ui.key.filter.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.data.SecretKey;
import com.finance.databinding.ItemKindSelectBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
public class KindSelectAdapter extends RecyclerView.Adapter<KindSelectAdapter.OrganizationViewHolder> {

    private final List<String> kinds;

    @Setter
    private String isSelected;

    public KindSelectAdapter(List<String> kinds, KindSelectListener kindSelectListener) {
        this.kinds = kinds;
        this.kindSelectListener = kindSelectListener;
    }


    @Setter
    private KindSelectListener kindSelectListener;
    @Setter
    private boolean lock;

    public void updateItem(Integer position, String String) {
        kinds.set(position, String);
        notifyItemChanged(position);
    }


    public interface KindSelectListener {
        void itemClick(View view, int position);

    }
    @NonNull
    @Override
    public OrganizationViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemKindSelectBinding binding = ItemKindSelectBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new OrganizationViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull OrganizationViewHolder holder, int position) {
        holder.onBind(position);
        holder.binding.layoutMain.setOnClickListener(view -> kindSelectListener.itemClick(view,position));
    }


    @Override
    public int getItemCount() {
        return kinds!= null? kinds.size() : 0;
    }

    public void addList(List<String> kinds){
        if(kinds == null){
            return;
        }
        this.kinds.addAll(kinds);
        notifyItemRangeInserted(this.kinds.size() - kinds.size(),kinds.size());
    }

    public void deleteItem(int position){
        kinds.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, kinds.size());
    }

    public class OrganizationViewHolder extends RecyclerView.ViewHolder{
        ItemKindSelectBinding binding;
        int position;
        String String;
        public OrganizationViewHolder(ItemKindSelectBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void onBind(int position){
            this.position = position;
            String = kinds.get(position);
            binding.setIvm(String);
            binding.setIvmSelectedName(isSelected);
            binding.setSecretKey(SecretKey.getInstance().getKey());
            binding.executePendingBindings();
        }

    }
}
