package com.finance.ui.document.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.R;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.finance.databinding.ItemDocumentBinding;


import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class DocumentAdapter extends RecyclerView.Adapter<DocumentAdapter.DocumentViewHolder>
{
    @Getter
    @Setter
    private List<DocumentResponse> listDocument;
    private final OnItemClickListener onItemClickListener;
    public DocumentAdapter(List<DocumentResponse> mListDocument, OnItemClickListener onItemClickListener) {
        this.listDocument = mListDocument;
        this.onItemClickListener = onItemClickListener;
    }

    @NonNull
    @Override
    public DocumentViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new DocumentViewHolder(ItemDocumentBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false));
    }

    @SuppressLint("UseCompatLoadingForDrawables")
    @Override
    public void onBindViewHolder(@NonNull DocumentViewHolder holder, @SuppressLint("RecyclerView") int position) {
        if (listDocument == null){
            return;
        }
        DocumentResponse documentResponse = listDocument.get(position);
        holder.binding.setIvm(documentResponse);
        String type = documentResponse.getName().substring(documentResponse.getName().lastIndexOf(".") + 1);
        if (type.equals("pdf"))
            holder.binding.imgDocument.setImageDrawable(holder.binding.getRoot().getResources().getDrawable(R.drawable.ic_pdf, null));
        else
            holder.binding.imgDocument.setImageDrawable(holder.binding.getRoot().getResources().getDrawable(R.drawable.ic_image, null));

        holder.binding.layoutMainItemDocument.setOnClickListener(v -> onItemClickListener.onItemClick(v, position));
        holder.binding.layoutDelete.setOnClickListener(v -> onItemClickListener.onDeleteClick(v, position));


    }

    @Override
    public int getItemCount() {
        if (listDocument == null){
            return 0;
        }
        return listDocument.size();
    }

    public static class DocumentViewHolder extends RecyclerView.ViewHolder {
        ItemDocumentBinding binding;
        public DocumentViewHolder(ItemDocumentBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }

    public interface OnItemClickListener {
        void onItemClick(View view, int pos);
        void onDeleteClick(View view, int pos);
    }

}
