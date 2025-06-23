package com.finance.ui.chat.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.R;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.finance.databinding.ItemDocumentChatBinding;
import com.finance.utils.BindingUtils;

import java.util.ArrayList;
import java.util.List;

public class DocumentChatAdapter extends RecyclerView.Adapter<DocumentChatAdapter.DocumentViewHolder> {

    private Context context;
    private List<DocumentResponse> documentList;
    private OnDocumentClickListener clickListener;

    // Interface for click events
    public interface OnDocumentClickListener {
        void onDocumentClick(DocumentResponse document, int position);
        void onDocumentLongClick(DocumentResponse document, int position);
    }

    // Constructor
    public DocumentChatAdapter(Context context) {
        this.context = context;
        this.documentList = new ArrayList<>();
    }

    // Constructor with initial data
    public DocumentChatAdapter(Context context, List<DocumentResponse> documentList, OnDocumentClickListener clickListener) {
        this.context = context;
        this.documentList = documentList != null ? documentList : new ArrayList<>();
        this.clickListener = clickListener;
    }

    @NonNull
    @Override
    public DocumentViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        ItemDocumentChatBinding binding = DataBindingUtil.inflate(
                inflater,
                R.layout.item_document_chat,
                parent,
                false
        );
        return new DocumentViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull DocumentViewHolder holder, int position) {
        DocumentResponse document = documentList.get(position);
        holder.bind(document, position);
    }

    @Override
    public int getItemCount() {
        return documentList.size();
    }

    // Method to update the entire list
    public void updateList(List<DocumentResponse> newList) {
        this.documentList.clear();
        if (newList != null) {
            this.documentList.addAll(newList);
        }
        notifyDataSetChanged();
    }

    // Method to add single item
    public void addItem(DocumentResponse document) {
        if (document != null) {
            documentList.add(document);
            notifyItemInserted(documentList.size() - 1);
        }
    }

    // Method to add multiple items
    public void addItems(List<DocumentResponse> documents) {
        if (documents != null && !documents.isEmpty()) {
            int startPosition = documentList.size();
            documentList.addAll(documents);
            notifyItemRangeInserted(startPosition, documents.size());
        }
    }

    // Method to remove item
    public void removeItem(int position) {
        if (position >= 0 && position < documentList.size()) {
            documentList.remove(position);
            notifyItemRemoved(position);
        }
    }

    // Method to clear all items
    public void clearAll() {
        int size = documentList.size();
        documentList.clear();
        notifyItemRangeRemoved(0, size);
    }

    // Method to get item at position
    public DocumentResponse getItem(int position) {
        if (position >= 0 && position < documentList.size()) {
            return documentList.get(position);
        }
        return null;
    }

    // Method to get all items
    public List<DocumentResponse> getAllItems() {
        return new ArrayList<>(documentList);
    }

    // Setter for click listener
    public void setOnDocumentClickListener(OnDocumentClickListener listener) {
        this.clickListener = listener;
    }

    // ViewHolder class
    public class DocumentViewHolder extends RecyclerView.ViewHolder {

        private ItemDocumentChatBinding binding;

        public DocumentViewHolder(@NonNull ItemDocumentChatBinding binding) {
            super(binding.getRoot());
            this.binding = binding;

            // Set click listeners
            binding.getRoot().setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && clickListener != null) {
                    clickListener.onDocumentClick(documentList.get(position), position);
                }
            });

            binding.getRoot().setOnLongClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && clickListener != null) {
                    clickListener.onDocumentLongClick(documentList.get(position), position);
                    return true;
                }
                return false;
            });
        }

        public void bind(DocumentResponse document, int position) {
            // Set the document data to binding
            binding.setIvm(document);

            // Load image if it's an image file
            if (document.isImageFile()) {
                binding.layoutFile.setVisibility(View.GONE);
                binding.img.setVisibility(View.VISIBLE);
                BindingUtils.setImageUrl(binding.img, document.getUrl());
            } else {
                // Set document icon based on file type
                binding.layoutFile.setVisibility(View.VISIBLE);
                binding.img.setVisibility(View.GONE);
            }

            // Execute pending bindings
            binding.executePendingBindings();
        }
    }
}
