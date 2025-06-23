package com.finance.ui.category.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.category.CateResponse;
import com.finance.databinding.ItemCategoryBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class CategoryAdapter extends RecyclerView.Adapter<CategoryAdapter.CategoryViewHolder> {

    @Getter
    private List<CateResponse> categories;

    @Getter
    @Setter
    private boolean lock;

    private final ViewBinderHelper viewBinderHelper = new ViewBinderHelper();

    public CategoryAdapter(){
        viewBinderHelper.setOpenOnlyOne(true);
    }

    @SuppressLint("NotifyDataSetChanged")
    public void setCategories(List<CateResponse> categories){
        this.categories = categories;
        notifyDataSetChanged();
    }
    @Getter
    @Setter
    private CategoryListener categoryListener;

    public void updateItem(Integer position, CateResponse cateResponse) {
        categories.set(position, cateResponse);
        notifyItemChanged(position);
    }

    public interface CategoryListener{
        void itemClick(int position, CateResponse cateResponse);
        void deleteCategory(int position, CateResponse cateResponse);
    }
    @NonNull
    @Override
    public CategoryAdapter.CategoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemCategoryBinding binding = ItemCategoryBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new CategoryViewHolder(binding,categoryListener);
    }

    @Override
    public void onBindViewHolder(@NonNull CategoryAdapter.CategoryViewHolder holder, int position) {
        holder.onBind(position);
    }

    @Override
    public int getItemCount() {
        return categories != null? categories.size() : 0;
    }

    public void addList(List<CateResponse> categories){
        if(categories == null){
            return;
        }
        this.categories.addAll(categories);
        notifyItemRangeInserted(this.categories.size() - categories.size(),categories.size());
    }

    public void deleteItem(int position){
        categories.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, categories.size());
    }

    public class CategoryViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        ItemCategoryBinding binding;
        CategoryListener categoryListener;
        int position;
        CateResponse cateResponse;
        public CategoryViewHolder(ItemCategoryBinding binding, CategoryListener categoryListener) {
            super(binding.getRoot());
            this.binding = binding;
            binding.getRoot().setOnClickListener(this);
            this.categoryListener = categoryListener;
        }

        void onBind(int position){
            this.position = position;
            cateResponse = categories.get(position);
            viewBinderHelper.bind(binding.swipeRevealLayout, String.valueOf(cateResponse.getId()));
            if(lock){
                viewBinderHelper.lockSwipe(String.valueOf(cateResponse.getId()));
            }
            binding.setIvm(cateResponse);
            binding.setSecretKey(SecretKey.getInstance().getKey());
            binding.layoutDelete.setOnClickListener(view -> {
                categoryListener.deleteCategory(position,cateResponse);
                viewBinderHelper.closeLayout(String.valueOf(cateResponse.getId()));
            });
            binding.layoutMain.setOnClickListener(view -> categoryListener.itemClick(position,cateResponse));
            binding.executePendingBindings();
        }

        @Override
        public void onClick(View view) {
            categoryListener.itemClick(position, cateResponse);
        }
    }
}
