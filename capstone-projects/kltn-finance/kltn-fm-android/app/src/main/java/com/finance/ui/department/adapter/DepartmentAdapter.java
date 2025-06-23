package com.finance.ui.department.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.data.model.api.response.department.DepartmentResponse;
import com.finance.databinding.ItemDepartmentBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class DepartmentAdapter extends RecyclerView.Adapter<DepartmentAdapter.DepartmentViewHolder> {

    @Getter
    @Setter
    private List<DepartmentResponse> departments;

    @Getter
    @Setter
    private boolean lock;

    private final ViewBinderHelper viewBinderHelper = new ViewBinderHelper();

    public DepartmentAdapter(){
        viewBinderHelper.setOpenOnlyOne(true);
    }
    @Getter
    @Setter
    private DepartmentListener departmentListener;

    public void updateItem(Integer position, DepartmentResponse departmentResponse) {
        departments.set(position, departmentResponse);
        notifyItemChanged(position);
    }

    public interface DepartmentListener{
        void itemClick(int position, DepartmentResponse department);
        void deleteDepartment(int position, DepartmentResponse department);
    }
    @NonNull
    @Override
    public DepartmentViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemDepartmentBinding binding = ItemDepartmentBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new DepartmentViewHolder(binding,departmentListener);
    }

    @Override
    public void onBindViewHolder(@NonNull DepartmentViewHolder holder, int position) {
        holder.onBind(position);
    }

    @Override
    public int getItemCount() {
        return departments!= null? departments.size() : 0;
    }

    public void addList(List<DepartmentResponse> departments){
        if(departments == null){
            return;
        }
        this.departments.addAll(departments);
        notifyItemRangeInserted(this.departments.size() - departments.size(),departments.size());
    }

    public void deleteItem(int position){
        departments.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, departments.size());
    }

    public class DepartmentViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        ItemDepartmentBinding binding;
        DepartmentListener departmentListener;
        int position;
        DepartmentResponse department;
        public DepartmentViewHolder(ItemDepartmentBinding binding, DepartmentListener departmentListener) {
            super(binding.getRoot());
            this.binding = binding;
            binding.getRoot().setOnClickListener(this);
            this.departmentListener = departmentListener;
        }

        void onBind(int position){
            this.position = position;
            department = departments.get(position);
            viewBinderHelper.bind(binding.swipeRevealLayout, String.valueOf(department.getId()));
            if(lock){
                viewBinderHelper.lockSwipe(String.valueOf(department.getId()));
            }
            binding.setIvm(department);
            binding.layoutDelete.setOnClickListener(view -> {
                departmentListener.deleteDepartment(position,department);
                viewBinderHelper.closeLayout(String.valueOf(department.getId()));
            });
            binding.layoutMain.setOnClickListener(view ->
                    departmentListener.itemClick(position,department)
            );
            binding.executePendingBindings();
        }

        @Override
        public void onClick(View view) {
            departmentListener.itemClick(position, department);
        }
    }
}
