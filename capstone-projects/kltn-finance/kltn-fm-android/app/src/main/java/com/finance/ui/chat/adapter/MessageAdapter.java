package com.finance.ui.chat.adapter;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.response.chat.AccountChatResponse;
import com.finance.data.model.api.response.chat.MessageReaction;
import com.finance.data.model.api.response.chat.detail.ChatDetailResponse;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.finance.databinding.ItemMessageBinding;
import com.finance.ui.image.ImageActivity;
import com.finance.utils.BindingUtils;
import com.google.android.material.shape.ShapeAppearanceModel;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

public class MessageAdapter extends RecyclerView.Adapter<MessageAdapter.MessageViewHolder> {

    @Getter
    private List<ChatDetailResponse> messageList;

    public String secretKey;

    public OnMessageClickListener listener;
    public interface OnMessageClickListener {
        void onMessageLongClick(ChatDetailResponse message, int position);
        void onReactionClick(List<MessageReaction> reactions, MessageReaction reaction);
        void onDocumentClick(DocumentResponse document, int position);
    }

    public MessageAdapter(List<ChatDetailResponse> messages, OnMessageClickListener listener) {
        this.messageList = messages;
        this.listener = listener;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void setMessages(List<ChatDetailResponse> messages) {
        this.messageList = messages;
        notifyDataSetChanged();
    }

    public void addMessage(ChatDetailResponse message) {
        this.messageList.add(0, message);
        notifyItemInserted(0);
    }
    public void updateMessage(int position, ChatDetailResponse message) {
        messageList.set(position, message);
        notifyItemChanged(position);
    }

    @NonNull
    @Override
    public MessageViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemMessageBinding binding = ItemMessageBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
        return new MessageViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull MessageViewHolder holder, int position) {
        ChatDetailResponse message = messageList.get(position);
        holder.bind(message, position, messageList);

        // onClickListener for message
        holder.itemView.setOnLongClickListener(v -> {
            if (listener != null) {
                listener.onMessageLongClick(message, position);
            }
            return false;
        });

        if (message.getMessageReactions() != null && !message.getMessageReactions().isEmpty()) {
            holder.binding.listReactions.setVisibility(View.VISIBLE);
            holder.binding.listReactions.setLayoutManager(
                    new LinearLayoutManager(holder.itemView.getContext(), LinearLayoutManager.HORIZONTAL, false)
            );
            MessageReactionAdapter reactionAdapter = new MessageReactionAdapter(getListMessageReactionsByKind(message), new MessageReactionAdapter.OnReactionClickListener() {
                @Override
                public void onReactionClick(MessageReaction reaction, int position) {
                    if (listener != null) {
                        listener.onReactionClick(getListMessageReactionsByKind(message), reaction);
                    }
                }
            });
            holder.binding.listReactions.setAdapter(reactionAdapter);
        } else {
            holder.binding.listReactions.setVisibility(View.GONE);
        }

        if (message.getDocument() != null) {
            holder.binding.listDocuments.setVisibility(View.VISIBLE);
            DocumentChatAdapter documentAdapter = new DocumentChatAdapter(holder.itemView.getContext(), message.getDocumentFile(), new DocumentChatAdapter.OnDocumentClickListener() {
                @Override
                public void onDocumentClick(DocumentResponse document, int position) {
                    if (listener != null) {
                        listener.onDocumentClick(document, position);
                    }
                }

                @Override
                public void onDocumentLongClick(DocumentResponse document, int position) {
                    if (listener != null) {
                        listener.onMessageLongClick(message, position);
                    }
                }
            });
            holder.binding.listDocuments.setLayoutManager(
                    new LinearLayoutManager(holder.itemView.getContext(), LinearLayoutManager.VERTICAL, false)
            );
            holder.binding.listDocuments.setAdapter(documentAdapter);
        } else {
            holder.binding.listDocuments.setVisibility(View.GONE);
        }
    }

    @Override
    public int getItemCount() {
        return messageList.size();
    }

    public static class MessageViewHolder extends RecyclerView.ViewHolder {
        ItemMessageBinding binding;

        public MessageViewHolder(@NonNull ItemMessageBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(ChatDetailResponse message, int position, List<ChatDetailResponse> messages) {
            if (message == null || message.getSender() == null) {
                return;
            }
            Boolean isSent = message.getIsSender();
            binding.setIsSender(message.getIsSender());
            binding.setItem(message);
            // Determine position in sequence
            boolean isTop = isTopMessage(position, messages);
            boolean isBottom = isBottomMessage(position, messages);
            // Get the appropriate shape appearance resource
            binding.imgSender.setVisibility(View.INVISIBLE);
            if (!isSent && isBottom) {
                binding.imgSender.setVisibility(View.VISIBLE);
                BindingUtils.setImageUrl(binding.imgSender, message.getSender().getAvatarPath());
            } else if (isSent){
                binding.imgSender.setVisibility(View.GONE);
            }

            ConstraintLayout.LayoutParams params = (ConstraintLayout.LayoutParams) binding.cardView.getLayoutParams();
            if (isSent) {
                params.endToEnd =  ConstraintLayout.LayoutParams.PARENT_ID;
                params.startToEnd = ConstraintLayout.LayoutParams.UNSET;
                params.setMarginEnd(8);
            } else {
                params.endToEnd = ConstraintLayout.LayoutParams.UNSET;
                params.startToEnd = binding.imgSender.getId();
                params.setMarginStart(8);
            }
            binding.cardView.setLayoutParams(params);

            ConstraintLayout.LayoutParams textParams = (ConstraintLayout.LayoutParams) binding.textViewMessage.getLayoutParams();
            if (isSent) {
                textParams.startToStart = ConstraintLayout.LayoutParams.UNSET;
                textParams.endToEnd = ConstraintLayout.LayoutParams.PARENT_ID;
            } else {
                textParams.endToEnd = ConstraintLayout.LayoutParams.UNSET;
                textParams.startToStart = ConstraintLayout.LayoutParams.PARENT_ID;
            }
            binding.textViewMessage.setLayoutParams(textParams);

            LinearLayout.LayoutParams paramsEdited = (LinearLayout.LayoutParams) binding.tvIsEdited.getLayoutParams();
            if (isSent) {
                paramsEdited.gravity = Gravity.END;
                paramsEdited.setMarginEnd(8);
            } else {
                paramsEdited.gravity = Gravity.START;
                paramsEdited.setMarginStart(100);
            }
            binding.tvIsEdited.setLayoutParams(paramsEdited);
        }

        private boolean isBottomMessage(int position, List<ChatDetailResponse> messages) {
            return position == 0 || (messages.get(position).getIsSender() != messages.get(position - 1).getIsSender());
        }

        private boolean isTopMessage(int position, List<ChatDetailResponse> messages) {
            return position == messages.size() - 1 || (messages.get(position).getIsSender() != messages.get(position + 1).getIsSender());
        }
    }

    public static List<MessageReaction> getListMessageReactionsByKind(ChatDetailResponse currentItem) {
        List<MessageReaction> listMessageReactions = new ArrayList<>(currentItem.getMessageReactions());
        Map<Integer, MessageReaction> reactionMap = new LinkedHashMap<>();
        for (MessageReaction reaction : listMessageReactions) {
            Integer kind = reaction.getKind();
            if (reactionMap.containsKey(kind)) {
                MessageReaction existingReaction = reactionMap.get(kind);
                existingReaction.setTotalReactions(existingReaction.getTotalReactions() + 1);
                existingReaction.getAccountReactions().add(existingReaction.getAccount());
            } else {
                MessageReaction newReaction = new MessageReaction();
                newReaction.setKind(reaction.getKind());
                newReaction.setTotalReactions(1);
                List<AccountChatResponse> accounts = new ArrayList<>();
                accounts.add(reaction.getAccount());
                newReaction.setAccountReactions(accounts);
                reactionMap.put(kind, newReaction);
            }
        }
        return new ArrayList<>(reactionMap.values());
    }
}
