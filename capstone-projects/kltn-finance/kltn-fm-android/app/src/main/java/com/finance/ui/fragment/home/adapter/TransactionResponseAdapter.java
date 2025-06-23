package com.finance.ui.fragment.home.adapter;

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
import com.finance.data.model.api.response.transaction.TransactionResponse;
import com.finance.databinding.ItemTransactionBinding;

import java.util.List;
import lombok.Getter;
import lombok.Setter;


public class TransactionResponseAdapter extends RecyclerView.Adapter<TransactionResponseAdapter.TransactionViewHolder>
{
    @Getter
    @Setter
    private List<TransactionResponse> listTransactionResponse;
    @Getter
    private ViewBinderHelper viewBinderHelper = new ViewBinderHelper();
    private final OnItemClickListener onItemClickListener;
    @Getter
    @Setter
    private String secretKey;

    public TransactionResponseAdapter(List<TransactionResponse> mListTransactionResponse, OnItemClickListener onItemClickListener) {
        this.listTransactionResponse = mListTransactionResponse;
        this.onItemClickListener = onItemClickListener;
        viewBinderHelper.setOpenOnlyOne(true);
    }

    @NonNull
    @Override
    public TransactionViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new TransactionViewHolder(ItemTransactionBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull TransactionViewHolder holder, @SuppressLint("RecyclerView") int position) {
        if (listTransactionResponse == null){
            return;
        }
        TransactionResponse myTran = listTransactionResponse.get(position);
        holder.binding.setIvm(myTran);
        //Check permission
        holder.binding.setPermissionApprove(Permission.checkPermission(Constants.PERMISSION_TRANSACTION_APPROVE, MVVMApplication.getPermissions()));
        holder.binding.setPermissionReject(Permission.checkPermission(Constants.PERMISSION_TRANSACTION_REJECT, MVVMApplication.getPermissions()));
        holder.binding.setPermissionDelete(Permission.checkPermission(Constants.PERMISSION_TRANSACTION_DELETE, MVVMApplication.getPermissions()));
        holder.binding.setSecretKey(secretKey);
        viewBinderHelper.bind(holder.binding.swipeLayout, myTran.getId().toString());
        holder.binding.executePendingBindings();

        holder.binding.layoutItem.setOnClickListener(v -> {
            if (onItemClickListener != null){
                onItemClickListener.onItemClick(v, position);
                viewBinderHelper.closeLayout(myTran.getId().toString());
            }
        });
        holder.binding.layoutApprove.setOnClickListener(v -> {
            if (onItemClickListener != null){
                onItemClickListener.onApproveClick(v, position);
                viewBinderHelper.closeLayout(myTran.getId().toString());
            }
        });
        holder.binding.layoutDelete.setOnClickListener(v -> {
            if (onItemClickListener != null){
                onItemClickListener.onItemClickDelete(v, position);
                viewBinderHelper.closeLayout(myTran.getId().toString());
            }
        });
        holder.binding.layoutReject.setOnClickListener(v -> {
            if (onItemClickListener != null){
                onItemClickListener.onRejectClick(v, position);
                viewBinderHelper.closeLayout(myTran.getId().toString());
            }
        });
    }

    public void addList(List<TransactionResponse> items){
        if(items == null){
            return;
        }
        this.listTransactionResponse.addAll(items);
        notifyItemRangeInserted(this.listTransactionResponse.size() - items.size(),items.size());
    }

    @Override
    public int getItemCount() {
        return listTransactionResponse.size();
    }

    public static class TransactionViewHolder extends RecyclerView.ViewHolder {
        ItemTransactionBinding binding;
        public TransactionViewHolder(ItemTransactionBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }

    public interface OnItemClickListener {
        void onItemClick(View view, int pos);
        void onApproveClick(View view, int pos);
        void onRejectClick(View view, int pos);
        void onItemClickDelete(View view, int pos);
    }
}
