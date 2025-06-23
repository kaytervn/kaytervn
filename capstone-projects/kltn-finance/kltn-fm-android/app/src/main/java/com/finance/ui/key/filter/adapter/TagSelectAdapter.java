package com.finance.ui.key.filter.adapter;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.data.SecretKey;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.databinding.ItemTagSelectBinding;
import com.finance.utils.AESUtils;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import timber.log.Timber;

@Getter
public class TagSelectAdapter extends RecyclerView.Adapter<TagSelectAdapter.TagViewHolder> {

    private final List<TagResponse> Tags;

    @Setter
    private Long isSelected;

    public TagSelectAdapter(List<TagResponse> Tags, TagSelectListener TagListener) {
        this.Tags = Tags;
        this.tagSelectListener = TagListener;
    }


    @Setter
    private TagSelectListener tagSelectListener;
    @Setter
    private boolean lock;

    public void updateItem(Integer position, TagResponse TagResponse) {
        Tags.set(position, TagResponse);
        notifyItemChanged(position);
    }

    public interface TagSelectListener {
        void itemClick(View view, int position);
    }
    @NonNull
    @Override
    public TagViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemTagSelectBinding binding = ItemTagSelectBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new TagViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull TagViewHolder holder, int position) {
        holder.onBind(position);
        holder.binding.layoutMain.setOnClickListener(view -> tagSelectListener.itemClick(view, position));
    }

    @Override
    public int getItemCount() {
        return Tags!= null? Tags.size() : 0;
    }

    public void addList(List<TagResponse> Tags){
        if(Tags == null){
            return;
        }
        this.Tags.addAll(Tags);
        notifyItemRangeInserted(this.Tags.size() - Tags.size(),Tags.size());
    }


    public class TagViewHolder extends RecyclerView.ViewHolder{
        ItemTagSelectBinding binding;
        int position;
        TagResponse tagResponse;
        public TagViewHolder(ItemTagSelectBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void onBind(int position){
            this.position = position;
            tagResponse = Tags.get(position);
            binding.setIvm(tagResponse);
            binding.setIvmSelectedId(isSelected);
            binding.setSecretKey(SecretKey.getInstance().getKey());
            if (tagResponse.getId()!=0L) {
                String color = AESUtils.decrypt(SecretKey.getInstance().getKey(), tagResponse.getColorCode());
                binding.imgTag.setColorFilter(Color.parseColor(color));
            }
            binding.executePendingBindings();
        }
    }
}
