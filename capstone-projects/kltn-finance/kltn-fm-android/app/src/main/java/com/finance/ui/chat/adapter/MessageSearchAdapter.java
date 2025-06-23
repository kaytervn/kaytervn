package com.finance.ui.chat.adapter;

import android.annotation.SuppressLint;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.R;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.chat.AccountChatResponse;
import com.finance.data.model.api.response.chat.MessageReaction;
import com.finance.data.model.api.response.chat.detail.ChatDetailResponse;
import com.finance.databinding.ItemMessageBinding;
import com.finance.databinding.ItemMessageSearchBinding;
import com.finance.utils.AESUtils;
import com.finance.utils.BindingUtils;
import com.google.android.material.shape.ShapeAppearanceModel;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class MessageSearchAdapter extends RecyclerView.Adapter<MessageSearchAdapter.MessageViewHolder> {

    private List<ChatDetailResponse> messageList;

    public String secretKey;
    public String textSearch;

    public OnMessageSearchClickListener listener;
    public interface OnMessageSearchClickListener {
        void onMessageSearchClick(ChatDetailResponse message);
    }

    public MessageSearchAdapter(List<ChatDetailResponse> messages, OnMessageSearchClickListener listener) {
        this.messageList = messages;
        this.listener = listener;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void setMessages(List<ChatDetailResponse> messages) {
        this.messageList = messages;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public MessageViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemMessageSearchBinding binding = ItemMessageSearchBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
        return new MessageViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull MessageViewHolder holder, int position) {
        ChatDetailResponse message = messageList.get(position);

        holder.binding.setItem(message);
        BindingUtils.setImageUrl(holder.binding.imgAva, message.getSender().getAvatarPath());

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onMessageSearchClick(message);
            }
        });
    }

    @Override
    public int getItemCount() {
        return messageList.size();
    }

    public static class MessageViewHolder extends RecyclerView.ViewHolder {
        ItemMessageSearchBinding binding;

        public MessageViewHolder(@NonNull ItemMessageSearchBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }


        private boolean isTopMessage(int position, List<ChatDetailResponse> messages) {
            return position == 0 || !messages.get(position).getSender().getId().equals(messages.get(position - 1).getSender().getId());
        }

        private boolean isBottomMessage(int position, List<ChatDetailResponse> messages) {
            return position == messages.size() - 1 || !messages.get(position).getSender().getId().equals(messages.get(position + 1).getSender().getId());
        }
    }
}
