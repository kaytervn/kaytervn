package com.finance.ui.nofication.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.core.content.res.ResourcesCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.response.account.Permission;
import com.finance.data.model.api.response.notification.NotificationResponse;
import com.finance.databinding.ItemNotificationBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class NotificationAdapter extends RecyclerView.Adapter<NotificationAdapter.NotificationViewHolder> {

    @Getter
    private List<NotificationResponse> notifications;
    private final ViewBinderHelper viewBinderHelper = new ViewBinderHelper();


    public NotificationAdapter(){
        viewBinderHelper.setOpenOnlyOne(true);
    }

    @SuppressLint("NotifyDataSetChanged")
    public void setNotifications(List<NotificationResponse> notifications){
        this.notifications = notifications;
        notifyDataSetChanged();
    }
    @Getter
    @Setter
    private NotificationListener NotificationListener;
    public interface NotificationListener{
        void itemClick(int position, NotificationResponse Notification);
        void deleteNotification(int position, NotificationResponse Notification);
    }
    @NonNull
    @Override
    public NotificationViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemNotificationBinding binding = ItemNotificationBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new NotificationViewHolder(binding,NotificationListener);
    }

    @Override
    public void onBindViewHolder(@NonNull NotificationViewHolder holder, int position) {
        holder.onBind(position);
    }

    @Override
    public int getItemCount() {
        return notifications!= null? notifications.size() : 0;
    }

    public void addList(List<NotificationResponse> notifications){
        if(notifications == null){
            return;
        }
        this.notifications.addAll(notifications);
        notifyItemRangeInserted(this.notifications.size() - notifications.size(),notifications.size());
    }

    public void deleteItem(int position){
        notifications.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, notifications.size());
    }

    public void updateItem(Integer position, NotificationResponse NotificationResponse){
        notifications.set(position,NotificationResponse);
        notifyItemChanged(position);
    }

    public class NotificationViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        ItemNotificationBinding binding;
        NotificationListener notificationListener;
        int position;
        NotificationResponse notification;
        public NotificationViewHolder(ItemNotificationBinding binding, NotificationListener notificationListener) {
            super(binding.getRoot());
            this.binding = binding;
            binding.getRoot().setOnClickListener(this);
            this.notificationListener = notificationListener;
        }

        void onBind(int position){
            this.position = position;
            notification = notifications.get(position);
            viewBinderHelper.bind(binding.swipeRevealLayout, String.valueOf(notification.getId()));
            binding.setPermissionDelete(Permission.checkPermission(Constants.PERMISSION_NOTIFICATION_DELETE, MVVMApplication.getPermissions()));
            binding.setIvm(notification);
            binding.layoutDelete.setOnClickListener(view -> {
                NotificationListener.deleteNotification(position,notification);
                viewBinderHelper.closeLayout(String.valueOf(notification.getId()));
            });
            binding.layoutNotification.setOnClickListener(view -> NotificationListener.itemClick(position,notification));
            // Set font by State
            if (notification.getState() == 1){
                binding.tvContent.setTypeface(ResourcesCompat.getFont(binding.getRoot().getContext(), R.font.lato_medium));
            }else {
                binding.tvContent.setTypeface(ResourcesCompat.getFont(binding.getRoot().getContext(), R.font.lato_bold));
            }

            binding.executePendingBindings();
        }

        @Override
        public void onClick(View view) {
            NotificationListener.itemClick(position, notification);
        }
    }
}
