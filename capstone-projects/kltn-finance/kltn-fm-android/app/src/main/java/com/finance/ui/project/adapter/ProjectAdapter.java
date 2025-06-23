package com.finance.ui.project.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.response.account.Permission;
import com.finance.data.model.api.response.project.ProjectResponse;
import com.finance.databinding.ItemProjectBinding;
import com.finance.utils.AESUtils;
import com.finance.utils.BindingUtils;

import java.util.List;

import lombok.Getter;
import lombok.Setter;


public class ProjectAdapter extends RecyclerView.Adapter<ProjectAdapter.ProjectSelectViewHolder> {
    @Getter
    @Setter
    private List<ProjectResponse> projectResponses;

    @Getter
    @Setter
    private String secretKey;

    private final ProjectListener projectListener;

    @Getter
    @Setter
    private ViewBinderHelper viewBinderHelper = new ViewBinderHelper();

    public ProjectAdapter(List<ProjectResponse> projectResponses, ProjectListener projectListener) {
        this.projectResponses = projectResponses;
        this.projectListener = projectListener;
        viewBinderHelper.setOpenOnlyOne(true);
    }

    public interface ProjectListener{
        void onItemClick(int position, View view);
        void onUpdateClick (int position, View view);
        void onDeleteClick(int position, View view);
    }

    @NonNull
    @Override
    public ProjectSelectViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemProjectBinding binding = ItemProjectBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new ProjectSelectViewHolder(binding,projectListener);
    }

    @Override
    public void onBindViewHolder(@NonNull ProjectSelectViewHolder holder, int position) {
        holder.onBind(position);
    }

    @Override
    public int getItemCount() {
        return projectResponses!= null? projectResponses.size() : 0;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void addList(List<ProjectResponse> items){
        if(items == null){
            return;
        }
        this.projectResponses.addAll(items);
        notifyDataSetChanged();
    }

    public void deleteItem(int position){
        projectResponses.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, projectResponses.size());
    }

    public class ProjectSelectViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        ItemProjectBinding binding;
        ProjectListener projectListener;
        int position;
        ProjectResponse project;
        public ProjectSelectViewHolder(ItemProjectBinding binding, ProjectListener ProjectListener) {
            super(binding.getRoot());
            this.binding = binding;
            binding.getRoot().setOnClickListener(this);
            this.projectListener = ProjectListener;
        }

        void onBind(int position){
            this.position = position;
            project = projectResponses.get(position);
            viewBinderHelper.bind(binding.swipeRevealLayout, String.valueOf(project.getId()));
            binding.setIvm(project);
            binding.setSecretKey(secretKey);
            binding.setPermissionUpdate(Permission.checkPermission(Constants.PERMISSION_PROJECT_UPDATE, MVVMApplication.getPermissions()));
            binding.setPermissionDelete(Permission.checkPermission(Constants.PERMISSION_PROJECT_DELETE, MVVMApplication.getPermissions()));
            BindingUtils.setImageUrlByDrawable(binding.imgLogo, AESUtils.decrypt(secretKey,project.getLogo(), false), R.drawable.ic_project_default);
            binding.executePendingBindings();
            binding.layoutDelete.setOnClickListener(view -> {
                projectListener.onDeleteClick(position, view);
                viewBinderHelper.closeLayout(String.valueOf(project.getId()));
            });
            binding.layoutUpdate.setOnClickListener(view -> {
                projectListener.onUpdateClick(position, view);
                viewBinderHelper.closeLayout(String.valueOf(project.getId()));
            });
            binding.layoutMain.setOnClickListener(view -> {
                projectListener.onItemClick(position,view);
                viewBinderHelper.closeLayout(String.valueOf(project.getId()));
            });
        }

        @Override
        public void onClick(View view) {
            ProjectAdapter.this.projectListener.onItemClick(position, view);
        }
    }
}
