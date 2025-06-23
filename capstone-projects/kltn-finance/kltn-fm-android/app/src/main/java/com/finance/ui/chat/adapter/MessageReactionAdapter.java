package com.finance.ui.chat.adapter;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.R;
import com.finance.data.model.api.response.chat.MessageReaction;
import com.finance.databinding.ItemReactionBinding;

import java.util.ArrayList;
import java.util.List;

public class MessageReactionAdapter extends RecyclerView.Adapter<MessageReactionAdapter.ReactionViewHolder> {

    private List<MessageReaction> reactionList;
    private OnReactionClickListener listener;

    public interface OnReactionClickListener {
        void onReactionClick(MessageReaction reaction, int position);
    }

    public MessageReactionAdapter(List<MessageReaction> reactionList, OnReactionClickListener listener) {
        this.reactionList = reactionList != null ? reactionList : new ArrayList<>();
        this.listener = listener;
    }


    @NonNull
    @Override
    public ReactionViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(parent.getContext());
        return new ReactionViewHolder(
                DataBindingUtil.inflate(inflater, R.layout.item_reaction, parent, false)
        );
    }

    @Override
    public void onBindViewHolder(@NonNull ReactionViewHolder holder, int position) {
        MessageReaction item = reactionList.get(position);
        holder.bind(item);
        holder.itemView.setOnClickListener(v -> {
            if (listener != null && position != RecyclerView.NO_POSITION) {
                listener.onReactionClick(item, position);
            }
        });
    }

    @Override
    public int getItemCount() {
        return reactionList.size();
    }

    public void updateReactions(List<MessageReaction> newReactions) {
        this.reactionList.clear();
        if (newReactions != null) {
            this.reactionList.addAll(newReactions);
        }
        notifyDataSetChanged();
    }

    public void addReaction(MessageReaction reaction) {
        reactionList.add(reaction);
        notifyItemInserted(reactionList.size() - 1);
    }

    public void removeReaction(int position) {
        if (position >= 0 && position < reactionList.size()) {
            reactionList.remove(position);
            notifyItemRemoved(position);
        }
    }



    public class ReactionViewHolder extends RecyclerView.ViewHolder {

        private ItemReactionBinding binding; // Thay bằng tên binding class của bạn

        public ReactionViewHolder(ItemReactionBinding binding) {
            super(binding.getRoot());
            this.binding = binding;

            // Set click listener
            binding.getRoot().setOnClickListener(v -> {
                if (listener != null && getAdapterPosition() != RecyclerView.NO_POSITION) {
                    listener.onReactionClick(reactionList.get(getAdapterPosition()), getAdapterPosition());
                }
            });
        }

        public void bind(MessageReaction item) {
            binding.tvReaction.setText(item.getEmojiByKind());
            binding.tvReactionCount.setText(String.valueOf(item.getTotalReactions()));
            binding.executePendingBindings();
        }
    }
}