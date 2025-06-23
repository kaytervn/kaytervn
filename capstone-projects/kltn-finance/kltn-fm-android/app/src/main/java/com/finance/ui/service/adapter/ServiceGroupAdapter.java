package com.finance.ui.service.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.data.model.api.response.service.group.ServiceGroupResponse;
import com.finance.databinding.ItemGroupServiceBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;



public class ServiceGroupAdapter extends RecyclerView.Adapter<ServiceGroupAdapter.GroupServiceViewHolder> {
    @Getter
    @Setter
    private List<ServiceGroupResponse> groupServiceResponses;
    @Getter
    @Setter
    private ViewBinderHelper viewBinderHelper = new ViewBinderHelper();
    @Getter
    @Setter
    private String secretKey;


    public ServiceGroupAdapter(List<ServiceGroupResponse> groupServiceResponses, GroupServiceListener groupServiceListener) {
        this.groupServiceResponses = groupServiceResponses;
        this.groupServiceListener = groupServiceListener;
        viewBinderHelper.setOpenOnlyOne(true);
    }


    private final GroupServiceListener groupServiceListener;
    public interface GroupServiceListener{
        void onItemClick(int position, View view);
        void onDeleteClick(int position, View view);
    }
    @NonNull
    @Override
    public GroupServiceViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemGroupServiceBinding binding = ItemGroupServiceBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new GroupServiceViewHolder(binding,groupServiceListener);
    }

    @Override
    public void onBindViewHolder(@NonNull GroupServiceViewHolder holder, int position) {
        holder.onBind(position);
    }

    @Override
    public int getItemCount() {
        return groupServiceResponses!= null? groupServiceResponses.size() : 0;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void addList(List<ServiceGroupResponse> items){
        if(items == null){
            return;
        }
        this.groupServiceResponses.addAll(items);
       notifyDataSetChanged();
    }

    public void deleteItem(int position){
        groupServiceResponses.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, groupServiceResponses.size());
    }

    public class GroupServiceViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        ItemGroupServiceBinding binding;
        GroupServiceListener groupServiceListener;
        int position;
        ServiceGroupResponse groupService;
        public GroupServiceViewHolder(ItemGroupServiceBinding binding, GroupServiceListener groupServiceListener) {
            super(binding.getRoot());
            this.binding = binding;
            binding.getRoot().setOnClickListener(this);
            this.groupServiceListener = groupServiceListener;
        }

        void onBind(int position){
            this.position = position;
            groupService = groupServiceResponses.get(position);
            viewBinderHelper.bind(binding.swipeRevealLayout, String.valueOf(groupService.getId()));
            binding.setIvm(groupService);
            binding.setSecretKey(secretKey);
            binding.layoutDelete.setOnClickListener(view -> {
                groupServiceListener.onDeleteClick(position, view);
                viewBinderHelper.closeLayout(String.valueOf(groupService.getId()));
            });
            binding.layoutMain.setOnClickListener(view -> {
                groupServiceListener.onItemClick(position,view);
                viewBinderHelper.closeLayout(String.valueOf(groupService.getId()));
            });
            binding.executePendingBindings();
        }

        @Override
        public void onClick(View view) {
            groupServiceListener.onItemClick(position, view);
        }
    }
}
