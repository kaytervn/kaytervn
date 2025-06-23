package com.finance.ui.key.group.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.data.model.api.response.key.KeyGroupResponse;
import com.finance.data.model.api.response.transaction.group.TransactionGroupResponse;
import com.finance.databinding.ItemGroupTransactionBinding;
import com.finance.databinding.ItemKeyGroupBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class KeyGroupAdapter extends RecyclerView.Adapter<KeyGroupAdapter.KeyGroupViewHolder> {
    @Getter
    @Setter
    private List<KeyGroupResponse> keyGroupResponses;
    @Getter
    @Setter
    private ViewBinderHelper viewBinderHelper = new ViewBinderHelper();
    @Getter
    @Setter
    private String secretKey;

    public KeyGroupAdapter(List<KeyGroupResponse> groupTransactionResponses, KeyGroupListener groupTransactionListener) {
        this.keyGroupResponses = groupTransactionResponses;
        this.groupTransactionListener = groupTransactionListener;
        viewBinderHelper.setOpenOnlyOne(true);
    }

    private final KeyGroupListener groupTransactionListener;
    public interface KeyGroupListener{
        void onItemClick(int position, View view);
        void onDeleteClick(int position, View view);
    }
    @NonNull
    @Override
    public KeyGroupViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemKeyGroupBinding binding = ItemKeyGroupBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new KeyGroupViewHolder(binding,groupTransactionListener);
    }

    @Override
    public void onBindViewHolder(@NonNull KeyGroupViewHolder holder, int position) {
        holder.onBind(position);
    }

    @Override
    public int getItemCount() {
        return keyGroupResponses != null? keyGroupResponses.size() : 0;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void addList(List<KeyGroupResponse> items){
        if(items == null){
            return;
        }
        this.keyGroupResponses.addAll(items);
       notifyDataSetChanged();
    }

    public void deleteItem(int position){
        keyGroupResponses.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, keyGroupResponses.size());
    }

    public class KeyGroupViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        ItemKeyGroupBinding binding;
        KeyGroupListener groupTransactionListener;
        int position;
        KeyGroupResponse groupTransaction;
        public KeyGroupViewHolder(ItemKeyGroupBinding binding, KeyGroupListener groupTransactionListener) {
            super(binding.getRoot());
            this.binding = binding;
            binding.getRoot().setOnClickListener(this);
            this.groupTransactionListener = groupTransactionListener;
        }

        void onBind(int position){
            this.position = position;
            groupTransaction = keyGroupResponses.get(position);
            viewBinderHelper.bind(binding.swipeRevealLayout, String.valueOf(groupTransaction.getId()));
            binding.setIvm(groupTransaction);
            binding.setSecretKey(secretKey);
            binding.layoutDelete.setOnClickListener(view -> {
                groupTransactionListener.onDeleteClick(position, view);
                viewBinderHelper.closeLayout(String.valueOf(groupTransaction.getId()));
            });
            binding.layoutMain.setOnClickListener(view -> {
                groupTransactionListener.onItemClick(position,view);
                viewBinderHelper.closeLayout(String.valueOf(groupTransaction.getId()));
            });

            binding.executePendingBindings();
        }

        @Override
        public void onClick(View view) {
            groupTransactionListener.onItemClick(position, view);
        }
    }
}
