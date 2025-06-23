package com.finance.ui.debit.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.MVVMApplication;
import com.finance.constant.Constants;
import com.finance.data.model.api.response.account.Permission;
import com.finance.data.model.api.response.debit.DebitResponse;
import com.finance.databinding.ItemDebitBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;


public class DebitResponseAdapter extends RecyclerView.Adapter<DebitResponseAdapter.DebitViewHolder>
{
    @Getter
    @Setter
    private List<DebitResponse> listDebitResponse;

    @Getter
    private ViewBinderHelper viewBinderHelper = new ViewBinderHelper();
    private final OnItemClickListener onItemClickListener;
    @Getter
    @Setter
    private String secretKey;

    @Getter
    @Setter
    private List<Permission> permissions;

    public DebitResponseAdapter(List<DebitResponse> mListDebitResponse, OnItemClickListener onItemClickListener) {
        this.listDebitResponse = mListDebitResponse;
        this.onItemClickListener = onItemClickListener;
        viewBinderHelper.setOpenOnlyOne(true);
    }

    @NonNull
    @Override
    public DebitViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new DebitViewHolder(ItemDebitBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull DebitViewHolder holder, @SuppressLint("RecyclerView") int position) {
        if (listDebitResponse == null){
            return;
        }
        DebitResponse debit = listDebitResponse.get(position);
        holder.binding.setIvm(debit);
        holder.binding.setSecretKey(secretKey);
        holder.binding.setPermissionApprove(Permission.checkPermission(Constants.PERMISSION_DEBIT_APPROVE, MVVMApplication.getPermissions()));
        holder.binding.setPermissionDelete(Permission.checkPermission(Constants.PERMISSION_DEBIT_DELETE, MVVMApplication.getPermissions()));
        viewBinderHelper.bind(holder.binding.swipeLayout, debit.getId().toString());
        holder.binding.executePendingBindings();

        holder.binding.layoutItem.setOnClickListener((v) -> {
            if (onItemClickListener != null){
                onItemClickListener.onItemClick(v, position);
                viewBinderHelper.closeLayout(debit.getId().toString());
            }
        });
        holder.binding.layoutApprove.setOnClickListener((v) -> {
            if (onItemClickListener != null){
                onItemClickListener.onApproveClick(v, position);
                viewBinderHelper.closeLayout(debit.getId().toString());
            }
        });
        holder.binding.layoutDelete.setOnClickListener( (v) -> {
            if (onItemClickListener != null){
                onItemClickListener.onDeleteClick(v, position);
                viewBinderHelper.closeLayout(debit.getId().toString());
            }
        });
    }

    public void addList(List<DebitResponse> items){
        if(items == null){
            return;
        }
        this.listDebitResponse.addAll(items);
        notifyItemRangeInserted(this.listDebitResponse.size() - items.size(),items.size());
    }

    @Override
    public int getItemCount() {
        return listDebitResponse.size();
    }

    public static class DebitViewHolder extends RecyclerView.ViewHolder {
        ItemDebitBinding binding;
        public DebitViewHolder(ItemDebitBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }

    public interface OnItemClickListener {
        void onItemClick(View view, int pos);
        void onApproveClick(View view, int pos);
        void onDeleteClick(View view, int pos);
    }
}
