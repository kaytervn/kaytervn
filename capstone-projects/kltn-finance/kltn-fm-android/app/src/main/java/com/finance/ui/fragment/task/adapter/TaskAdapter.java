package com.finance.ui.fragment.task.adapter;

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
import com.finance.data.model.api.response.task.TaskResponse;
import com.finance.databinding.ItemTaskBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;


public class TaskAdapter extends RecyclerView.Adapter<TaskAdapter.TaskViewHolder>
{

    @Getter
    @Setter
    private List<TaskResponse> listTaskResponse;

    @Getter
    private ViewBinderHelper viewBinderHelper = new ViewBinderHelper();
    private final OnItemClickListener onItemClickListener;
    @Getter
    @Setter
    private String secretKey;

    @Getter
    @Setter
    private List<Permission> permissions;

    public TaskAdapter(List<TaskResponse> mListTaskResponse, OnItemClickListener onItemClickListener) {
        this.listTaskResponse = mListTaskResponse;
        this.onItemClickListener = onItemClickListener;
        viewBinderHelper.setOpenOnlyOne(true);
    }

    @NonNull
    @Override
    public TaskViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new TaskViewHolder(ItemTaskBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull TaskViewHolder holder, @SuppressLint("RecyclerView") int position) {
        if (listTaskResponse == null){
            return;
        }
        TaskResponse task = listTaskResponse.get(position);
        holder.binding.setIvm(task);
        holder.binding.setSecretKey(secretKey);
        holder.binding.setPermissionChangeState(Permission.checkPermission(Constants.PERMISSION_TASK_CHANGE_STATE, MVVMApplication.getPermissions()));
        holder.binding.setPermissionDelete(Permission.checkPermission(Constants.PERMISSION_TASK_DELETE, MVVMApplication.getPermissions()));
        viewBinderHelper.bind(holder.binding.swipeLayout, task.getId().toString());
        holder.binding.executePendingBindings();
        holder.binding.layoutItem.setOnClickListener(v -> {
            if (onItemClickListener != null){
                onItemClickListener.onItemClick(v, position);
                viewBinderHelper.closeLayout(task.getId().toString());
            }
        });

        holder.binding.layoutChangeState.setOnClickListener(v -> {
            if (onItemClickListener != null){
                onItemClickListener.onItemChangeState(v, position);
                viewBinderHelper.closeLayout(task.getId().toString());
            }
        });

        holder.binding.layoutDelete.setOnClickListener(v -> {
            if (onItemClickListener != null){
                onItemClickListener.onItemClickDelete(v, position);
                viewBinderHelper.closeLayout(task.getId().toString());
            }
        });

    }

    public void addList(List<TaskResponse> items){
        if(items == null){
            return;
        }
        this.listTaskResponse.addAll(items);
        notifyItemRangeInserted(this.listTaskResponse.size() - items.size(),items.size());
    }

    @Override
    public int getItemCount() {
        return listTaskResponse.size();
    }

    public static class TaskViewHolder extends RecyclerView.ViewHolder {
        ItemTaskBinding binding;
        public TaskViewHolder(ItemTaskBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }

    public interface OnItemClickListener {
        void onItemClick(View view, int pos);
        void onItemChangeState(View view, int pos);
        void onItemClickDelete(View view, int pos);
    }
}
