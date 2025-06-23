package com.finance.ui.tag.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.R;
import com.finance.databinding.ItemTagKindBinding;


import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
public class TagKindAdapter extends RecyclerView.Adapter<TagKindAdapter.TagKindViewHolder> {

    private final List<String> tagKinds;

    @Setter
    private String selectedName;

    public TagKindAdapter(List<String> tagKinds, TagKindListener tagKindListener) {
        this.tagKinds = tagKinds;
        this.tagKindListener = tagKindListener;
    }
    
    @Setter
    private TagKindListener tagKindListener;
    @Setter
    private boolean lock;

    public void updateItem(Integer position, String String) {
        tagKinds.set(position, String);
        notifyItemChanged(position);
    }


    public interface TagKindListener{
        void itemClick(View view, int position);

    }
    @NonNull
    @Override
    public TagKindViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemTagKindBinding binding = ItemTagKindBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new TagKindViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull TagKindViewHolder holder, int position) {
        holder.onBind(position);
        holder.binding.layoutMain.setOnClickListener(view -> tagKindListener.itemClick(view, position));
    }

    @Override
    public int getItemCount() {
        return tagKinds!= null? tagKinds.size() : 0;
    }
    
    public void deleteItem(int position){
        tagKinds.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, tagKinds.size());
    }

    public class TagKindViewHolder extends RecyclerView.ViewHolder{
        ItemTagKindBinding binding;
        int position;
        String tagKind;
        public TagKindViewHolder(ItemTagKindBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void onBind(int position){
            this.position = position;
            if (position == 0){
                int marginStart = binding.getRoot().getContext().getResources()
                        .getDimensionPixelSize(R.dimen._12sdp);
                ViewGroup.MarginLayoutParams params =
                        (ViewGroup.MarginLayoutParams) binding.layoutMain.getLayoutParams();
                params.setMarginStart(marginStart);
                binding.layoutMain.setLayoutParams(params);
            }
            tagKind = tagKinds.get(position);
            binding.setTagName(tagKind);
            binding.setSelectedName(selectedName);
            binding.executePendingBindings();
        }

    }
}
