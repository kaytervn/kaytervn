package com.finance.ui.chat.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.R;
import com.finance.data.model.api.response.chat.AccountChatResponse;
import com.finance.data.model.api.response.chat.ChatRoomResponse;
import com.finance.data.model.api.response.chat.MessageReaction;
import com.finance.databinding.ItemChatBinding;
import com.finance.databinding.ItemUserReactionBinding;
import com.finance.utils.BindingUtils;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserReactionAdapter extends RecyclerView.Adapter<UserReactionAdapter.UserReactionViewHolder> {

    public UserReactionAdapter(List <AccountChatResponse> userList) {
        this.userList = userList != null ? userList : new ArrayList<>();
    }

    private List<AccountChatResponse> userList = new ArrayList<>();

    @SuppressLint("NotifyDataSetChanged")
    public void updateUsers(List<AccountChatResponse> users) {
        userList = new ArrayList<>();
        userList.addAll(users);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public UserReactionViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemUserReactionBinding binding = DataBindingUtil.inflate(
                LayoutInflater.from(parent.getContext()),
                R.layout.item_user_reaction,
                parent,
                false
        );
        return new UserReactionViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull UserReactionViewHolder holder, int position) {
        holder.bind(userList.get(position));
    }

    @Override
    public int getItemCount() {
        return userList.size();
    }

    public class UserReactionViewHolder extends RecyclerView.ViewHolder {
        private ItemUserReactionBinding binding;

        public UserReactionViewHolder(ItemUserReactionBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(AccountChatResponse user) {
            // Set user name
            binding.tvUserName.setText(user.getFullName() != null ? user.getFullName() : "Unknown User");

            // Load avatar using Glide
            BindingUtils.setImageUrl(binding.ivAvatar, user.getAvatarPath());

            binding.executePendingBindings();
        }
    }
}
