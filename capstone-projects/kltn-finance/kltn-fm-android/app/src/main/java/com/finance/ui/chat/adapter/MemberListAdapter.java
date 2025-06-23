package com.finance.ui.chat.adapter;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.data.model.api.response.chat.AutoCompleteAccountResponse;
import com.finance.data.model.api.response.chat.ChatRoomMemberResponse;
import com.finance.databinding.ItemMemberBinding;
import com.finance.utils.BindingUtils;

import java.util.List;

public class MemberListAdapter extends RecyclerView.Adapter<MemberListAdapter.MemberViewHolder> {

    private List<ChatRoomMemberResponse> members;
    private OnMemberActionListener listener;
    private Boolean isOwner = false;

    public interface OnMemberActionListener {
        void onDeleteMember(Long id);
    }

    public MemberListAdapter(List<ChatRoomMemberResponse> members, Boolean isOwner, OnMemberActionListener listener) {
        this.members = members;
        this.isOwner = isOwner;
        this.listener = listener;
    }

    @NonNull
    @Override
    public MemberViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemMemberBinding binding = ItemMemberBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
        return new MemberViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull MemberViewHolder holder, int position) {
        ChatRoomMemberResponse member = members.get(position);
        BindingUtils.setImageUrl(holder.binding.imgAva, member.getMember().getAvatarPath());
        holder.binding.setItem(member.getMember());
        holder.binding.setIsOwner(isOwner);
        holder.binding.imgDelete.setOnClickListener(v -> {
            if (listener != null) {
                listener.onDeleteMember(member.getId());
            }
        });
    }

    @Override
    public int getItemCount() {
        return members.size();
    }

    public void removeMember(int position) {
        if (position >= 0 && position < members.size()) {
            members.remove(position);
            notifyItemRemoved(position);
        }
    }

    class MemberViewHolder extends RecyclerView.ViewHolder {
        ItemMemberBinding binding;
        public MemberViewHolder(@NonNull ItemMemberBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }
}