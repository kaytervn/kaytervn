package com.finance.ui.chat.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;


import com.finance.R;
import com.finance.data.model.api.response.chat.ChatRoomResponse;
import com.finance.databinding.ItemChatBinding;
import com.finance.utils.AESUtils;
import com.finance.utils.BindingUtils;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRoomAdapter extends RecyclerView.Adapter<ChatRoomAdapter.ChatViewHolder> {
    private List<ChatRoomResponse> chatList;
    private OnChatClickListener listener;
    @Getter
    @Setter
    private String secretKey;

    public ChatRoomAdapter(List<ChatRoomResponse> chatList, OnChatClickListener listener) {
        this.chatList = new ArrayList<>();
        this.chatList.addAll(chatList);
        this.listener = listener;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void setChatList(List<ChatRoomResponse> chatList) {
        this.chatList = chatList;
        notifyDataSetChanged();
    }

    public void addChat(ChatRoomResponse chat) {
        this.chatList.add(chat);
        notifyItemInserted(chatList.size() - 1);
    }



    @NonNull
    @Override
    public ChatViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemChatBinding binding = ItemChatBinding.inflate(
                LayoutInflater.from(parent.getContext()),
                parent,
                false
        );
        return new ChatViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ChatViewHolder holder, int position) {
        ChatRoomResponse itemCurrent = chatList.get(position);
        if (itemCurrent.getLastMessage() != null) {
            if ( itemCurrent.getLastMessage().getIsDeleted() != null && itemCurrent.getLastMessage().getIsDeleted()) {
                holder.binding.tvLastMessage.setText(holder.binding.getRoot().getContext().getString(R.string.text_removed));
            } else if (itemCurrent.getLastMessage().getDocument() != null && !itemCurrent.getLastMessage().getDocument().isEmpty()) {
                holder.binding.tvLastMessage.setText(itemCurrent.getLastMessage().getSender().getFullName() + " " + holder.binding.getRoot().getContext().getString(R.string.text_document));
            } else {
                holder.binding.tvLastMessage.setText(AESUtils.decrypt(secretKey, itemCurrent.getLastMessage().getContent(), false));
            }
        } else {
            holder.binding.tvLastMessage.setText(holder.binding.getRoot().getContext().getString(R.string.text_no_message));
        }

        holder.bind(itemCurrent);
    }

    @Override
    public int getItemCount() {
        return chatList.size();
    }

    public class ChatViewHolder extends RecyclerView.ViewHolder {
        private ItemChatBinding binding;

        public ChatViewHolder(ItemChatBinding binding) {
            super(binding.getRoot());
            this.binding = binding;

            binding.getRoot().setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && listener != null) {
                    listener.onChatClick(chatList.get(position));
                }
            });
        }

        public void bind(ChatRoomResponse chat) {
            binding.setItem(chat);
            BindingUtils.setImageUrl(binding.imgUser, chat.getAvatar());
            binding.setSecretKey(secretKey);
            binding.executePendingBindings();
        }
    }

    public interface OnChatClickListener {
        void onChatClick(ChatRoomResponse chat);
    }
}
