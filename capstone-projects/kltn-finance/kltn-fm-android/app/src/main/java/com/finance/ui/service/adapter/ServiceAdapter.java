package com.finance.ui.service.adapter;

import android.annotation.SuppressLint;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.MVVMApplication;
import com.finance.constant.Constants;
import com.finance.data.model.api.response.account.Permission;
import com.finance.data.model.api.response.service.ServiceResponse;
import com.finance.databinding.ItemServiceBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;


public class ServiceAdapter extends RecyclerView.Adapter<ServiceAdapter.ServiceViewHolder> {
    @Getter
    @Setter
    private List<ServiceResponse> serviceResponses;
    @Getter
    @Setter
    private ViewBinderHelper viewBinderHelper = new ViewBinderHelper();
    @Getter
    @Setter
    private String secretKey;

    public ServiceAdapter(List<ServiceResponse> ServiceResponses, ServiceListener ServiceListener) {
        this.serviceResponses = ServiceResponses;
        this.ServiceListener = ServiceListener;
        viewBinderHelper.setOpenOnlyOne(true);
    }
    private final ServiceListener ServiceListener;
    public interface ServiceListener{
        void onItemClick(int position, View view);
        void onDeleteClick(int position, View view);
        void onCalendarClick(int position, View view);
        void onPayClick(int position, View view);
    }
    @NonNull
    @Override
    public ServiceViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemServiceBinding binding = ItemServiceBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new ServiceViewHolder(binding,ServiceListener);
    }

    @Override
    public void onBindViewHolder(@NonNull ServiceViewHolder holder, int position) {
        holder.onBind(position);
    }

    @Override
    public int getItemCount() {
        return serviceResponses!= null? serviceResponses.size() : 0;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void addList(List<ServiceResponse> items){
        if(items == null){
            return;
        }
        this.serviceResponses.addAll(items);
       notifyDataSetChanged();
    }

    public void deleteItem(int position){
        serviceResponses.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, serviceResponses.size());
    }

    public class ServiceViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        ItemServiceBinding binding;
        ServiceListener ServiceListener;
        int position;
        ServiceResponse Service;
        public ServiceViewHolder(ItemServiceBinding binding, ServiceListener ServiceListener) {
            super(binding.getRoot());
            this.binding = binding;
            binding.getRoot().setOnClickListener(this);
            this.ServiceListener = ServiceListener;
        }
        void onBind(int position){
            this.position = position;
            Service = serviceResponses.get(position);
            viewBinderHelper.bind(binding.swipeRevealLayout, String.valueOf(Service.getId()));
            binding.setIvm(Service);
            binding.setSecretKey(secretKey);
            binding.setPermissionResolve(Permission.checkPermission(Constants.PERMISSION_SERVICE_RESOLVE, MVVMApplication.getPermissions()));
            binding.setPermissionDelete(Permission.checkPermission(Constants.PERMISSION_SERVICE_DELETE,MVVMApplication.getPermissions()));
            binding.executePendingBindings();

            binding.layoutDelete.setOnClickListener(view -> {
                viewBinderHelper.closeLayout(String.valueOf(Service.getId()));
                ServiceListener.onDeleteClick(position, view);
            });
            binding.layoutService.setOnClickListener(view -> {
                viewBinderHelper.closeLayout(String.valueOf(Service.getId()));
                ServiceListener.onItemClick(position, view);
            });
            binding.layoutCalendar.setOnClickListener(view -> {
                viewBinderHelper.closeLayout(String.valueOf(Service.getId()));
                Handler handler = new Handler(Looper.getMainLooper());
                handler.postDelayed(() -> ServiceListener.onCalendarClick(position, view), 304); // Delay in milliseconds
            });
            binding.layoutPay.setOnClickListener(view -> {
                viewBinderHelper.closeLayout(String.valueOf(Service.getId()));
                Handler handler = new Handler(Looper.getMainLooper());
                handler.postDelayed(() -> ServiceListener.onPayClick(position, view), 304);
            });


        }
        @Override
        public void onClick(View view) {
            ServiceListener.onItemClick(position, view);
        }
    }
}
