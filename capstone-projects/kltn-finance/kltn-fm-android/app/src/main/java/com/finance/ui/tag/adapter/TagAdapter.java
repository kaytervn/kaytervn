package com.finance.ui.tag.adapter;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;


import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.response.account.Permission;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.databinding.ItemTagBinding;
import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.utils.AESUtils;

import java.util.List;

import lombok.Getter;
import lombok.Setter;



public class TagAdapter extends RecyclerView.Adapter<TagAdapter.TagViewHolder> {
    @Getter
    @Setter
    private List<TagResponse> tagResponses;
    @Getter
    @Setter
    private ViewBinderHelper viewBinderHelper = new ViewBinderHelper();
    @Getter
    @Setter
    private String secretKey;

    private final TagListener tagListener;
    public TagAdapter(List<TagResponse> TagResponses, TagListener tagListener) {
        this.tagResponses = TagResponses;
        this.tagListener = tagListener;
        viewBinderHelper.setOpenOnlyOne(true);
    }

    public interface TagListener{
        void onItemClick(int position, View view);
        void onDeleteClick(int position, View view);
    }
    @NonNull
    @Override
    public TagViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemTagBinding binding = ItemTagBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new TagViewHolder(binding,tagListener);
    }

    @Override
    public void onBindViewHolder(@NonNull TagViewHolder holder, int position) {
        holder.onBind(position);
    }

    @Override
    public int getItemCount() {
        return tagResponses!= null? tagResponses.size() : 0;
    }

    public class TagViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        ItemTagBinding binding;
        TagListener tagListener;
        int position;
        TagResponse tag;
        public TagViewHolder(ItemTagBinding binding, TagListener tagListener) {
            super(binding.getRoot());
            this.binding = binding;
            binding.getRoot().setOnClickListener(this);
            this.tagListener = tagListener;
        }
        void onBind(int position){
            this.position = position;

            tag = tagResponses.get(position);
            viewBinderHelper.bind(binding.swipeRevealLayout, String.valueOf(tag.getId()));
            binding.setIvm(tag);
            binding.setSecretKey(secretKey);
            binding.setPermissionDelete(Permission.checkPermission(Constants.PERMISSION_TAG_DELETE, MVVMApplication.getPermissions()));
            binding.executePendingBindings();
            String color = AESUtils.decrypt(secretKey, tag.getColorCode());
            binding.imgTag.setColorFilter(Color.parseColor(color));
            binding.layoutDelete.setOnClickListener(view -> {
                viewBinderHelper.closeLayout(String.valueOf(tag.getId()));
                tagListener.onDeleteClick(position, view);
            });
            binding.layoutMain.setOnClickListener(view -> {
                viewBinderHelper.closeLayout(String.valueOf(tag.getId()));
                tagListener.onItemClick(position, view);
            });
        }
        @Override
        public void onClick(View view) {
            tagListener.onItemClick(position, view);
        }
    }
}
