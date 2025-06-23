package com.finance.ui.chat.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.data.model.api.response.chat.AccountChatResponse;
import com.finance.databinding.ItemSeenMemberBinding;
import com.finance.utils.BindingUtils;

import java.util.List;

public class SeenMembersAdapter extends RecyclerView.Adapter<SeenMembersAdapter.SeenMemberViewHolder> {

    private List<AccountChatResponse> seenMembers;
    private Context context;

    public SeenMembersAdapter(Context context, List<AccountChatResponse> seenMembers) {
        this.context = context;
        this.seenMembers = seenMembers;
    }

    @NonNull
    @Override
    public SeenMemberViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(parent.getContext());
        ItemSeenMemberBinding binding = ItemSeenMemberBinding.inflate(inflater, parent, false);
        return new SeenMemberViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull SeenMemberViewHolder holder, int position) {
        AccountChatResponse member = seenMembers.get(position);
        if (member.getAvatarPath() != null && !member.getAvatarPath().isEmpty()) {
            BindingUtils.setImageUrl(holder.binding.imgAva, member.getAvatarPath());
        }
    }

    @Override
    public int getItemCount() {
        return seenMembers != null ? seenMembers.size() : 0;
    }


    public static class SeenMemberViewHolder extends RecyclerView.ViewHolder {
        ItemSeenMemberBinding binding;

        SeenMemberViewHolder(@NonNull ItemSeenMemberBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }
}
