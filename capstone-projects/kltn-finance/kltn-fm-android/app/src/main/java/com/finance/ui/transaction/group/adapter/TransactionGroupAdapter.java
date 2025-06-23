package com.finance.ui.transaction.group.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.data.model.api.response.transaction.group.TransactionGroupResponse;
import com.finance.databinding.ItemGroupTransactionBinding;


import java.util.List;
import lombok.Getter;
import lombok.Setter;

public class TransactionGroupAdapter extends RecyclerView.Adapter<TransactionGroupAdapter.GroupTransactionViewHolder> {
    @Getter
    @Setter
    private List<TransactionGroupResponse> groupTransactionResponses;
    @Getter
    @Setter
    private ViewBinderHelper viewBinderHelper = new ViewBinderHelper();
    @Getter
    @Setter
    private String secretKey;

    public TransactionGroupAdapter(List<TransactionGroupResponse> groupTransactionResponses, GroupTransactionListener groupTransactionListener) {
        this.groupTransactionResponses = groupTransactionResponses;
        this.groupTransactionListener = groupTransactionListener;
        viewBinderHelper.setOpenOnlyOne(true);
    }

    private final GroupTransactionListener groupTransactionListener;
    public interface GroupTransactionListener{
        void onItemClick(int position, View view);
        void onDeleteClick(int position, View view);
    }
    @NonNull
    @Override
    public GroupTransactionViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemGroupTransactionBinding binding = ItemGroupTransactionBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new GroupTransactionViewHolder(binding,groupTransactionListener);
    }

    @Override
    public void onBindViewHolder(@NonNull GroupTransactionViewHolder holder, int position) {
        holder.onBind(position);
    }

    @Override
    public int getItemCount() {
        return groupTransactionResponses!= null? groupTransactionResponses.size() : 0;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void addList(List<TransactionGroupResponse> items){
        if(items == null){
            return;
        }
        this.groupTransactionResponses.addAll(items);
       notifyDataSetChanged();
    }

    public void deleteItem(int position){
        groupTransactionResponses.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, groupTransactionResponses.size());
    }

    public class GroupTransactionViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        ItemGroupTransactionBinding binding;
        GroupTransactionListener groupTransactionListener;
        int position;
        TransactionGroupResponse groupTransaction;
        public GroupTransactionViewHolder(ItemGroupTransactionBinding binding, GroupTransactionListener groupTransactionListener) {
            super(binding.getRoot());
            this.binding = binding;
            binding.getRoot().setOnClickListener(this);
            this.groupTransactionListener = groupTransactionListener;
        }

        void onBind(int position){
            this.position = position;
            groupTransaction = groupTransactionResponses.get(position);
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
