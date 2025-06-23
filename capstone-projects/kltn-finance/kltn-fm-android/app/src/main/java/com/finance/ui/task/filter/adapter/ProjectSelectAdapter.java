package com.finance.ui.task.filter.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.data.SecretKey;
import com.finance.data.model.api.response.project.ProjectResponse;
import com.finance.databinding.ItemProjectSelectBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
public class ProjectSelectAdapter extends RecyclerView.Adapter<ProjectSelectAdapter.ProjectSelectViewHolder> {

    private final List<ProjectResponse> projects;

    @Setter
    private Long isSelected;

    public ProjectSelectAdapter(List<ProjectResponse> projects, ProjectSelectListener projectselectListener) {
        this.projects = projects;
        this.projectselectListener = projectselectListener;
    }

    @Setter
    private ProjectSelectListener projectselectListener;
    @Setter
    private boolean lock;

    public void updateItem(Integer position, ProjectResponse ProjectResponse) {
        projects.set(position, ProjectResponse);
        notifyItemChanged(position);
    }

    public interface ProjectSelectListener {
        void itemClick(View view, int position);
    }
    @NonNull
    @Override
    public ProjectSelectViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemProjectSelectBinding binding = ItemProjectSelectBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new ProjectSelectViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ProjectSelectViewHolder holder, int position) {
        holder.onBind(position);
        holder.binding.layoutMain.setOnClickListener(view -> projectselectListener.itemClick(view, position));
    }

    @Override
    public int getItemCount() {
        return projects!= null? projects.size() : 0;
    }

    public void addList(List<ProjectResponse> projects){
        if(projects == null){
            return;
        }
        this.projects.addAll(projects);
        notifyItemRangeInserted(this.projects.size() - projects.size(),projects.size());
    }

    public void deleteItem(int position){
        projects.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, projects.size());
    }

    public class ProjectSelectViewHolder extends RecyclerView.ViewHolder{
        ItemProjectSelectBinding binding;
        int position;
        ProjectResponse ProjectResponse;
        public ProjectSelectViewHolder(ItemProjectSelectBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void onBind(int position){
            this.position = position;
            ProjectResponse = projects.get(position);
            binding.setIvm(ProjectResponse);
            binding.setIvmSelectedId(isSelected);
            binding.setSecretKey(SecretKey.getInstance().getKey());
            binding.executePendingBindings();
        }

    }
}
