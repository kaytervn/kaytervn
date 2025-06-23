package com.finance.ui.chat.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.R;
import com.finance.data.model.api.response.chat.AutoCompleteAccountResponse;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class AddMembersAdapter extends RecyclerView.Adapter<AddMembersAdapter.ViewHolder> {
    private List<AutoCompleteAccountResponse> nameList;
    private Context context;
    private OnItemClickListener onItemClickListener;

    // Interface cho click listener
    public interface OnItemClickListener {
        void onItemClick(String name, int position);
        void onCancelClick(AutoCompleteAccountResponse item);
    }

    public AddMembersAdapter(Context context, HashSet<AutoCompleteAccountResponse> nameList, OnItemClickListener onItemClickListener) {
        this.context = context;
        this.nameList = nameList != null ? new ArrayList<>(nameList) : new ArrayList<>();
        this.onItemClickListener = onItemClickListener;
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.onItemClickListener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_member_group, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        String name = nameList.get(position).getFullName();
        holder.tvMemberGroupName.setText(name);
        holder.itemView.setOnClickListener(v -> {
            if (onItemClickListener != null) {
                onItemClickListener.onItemClick(name, position);
            }
        });
        holder.ivMemberGroupIcon.setOnClickListener(v -> {
            if (onItemClickListener != null) {
                onItemClickListener.onCancelClick(nameList.get(position));
            }
        });
    }

    @Override
    public int getItemCount() {
        return nameList.size();
    }

    // Phương thức để cập nhật danh sách
    public void updateList(HashSet<AutoCompleteAccountResponse> newList) {
        this.nameList = newList != null ? new ArrayList<>(newList) : new ArrayList<>();
        notifyDataSetChanged();
    }

    // Phương thức để thêm item
    public void addItem(AutoCompleteAccountResponse name) {
        nameList.add(name);
        notifyItemInserted(nameList.size() - 1);
    }

    // Phương thức để xóa item
    public void removeItem(int position) {
        if (position >= 0 && position < nameList.size()) {
            nameList.remove(position);
            notifyItemRemoved(position);
            notifyItemRangeChanged(position, nameList.size());
        }
    }

    // ViewHolder class
    public class ViewHolder extends RecyclerView.ViewHolder {
        private TextView tvMemberGroupName;
        private ImageView ivMemberGroupIcon;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvMemberGroupName = itemView.findViewById(R.id.tv_member_group_name);
            ivMemberGroupIcon = itemView.findViewById(R.id.iv_member_group_icon);
        }
    }
}
