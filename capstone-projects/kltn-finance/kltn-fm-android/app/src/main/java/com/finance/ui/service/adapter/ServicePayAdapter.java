package com.finance.ui.service.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.data.SecretKey;
import com.finance.databinding.ItemServicePayBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ServicePayAdapter extends RecyclerView.Adapter<ServicePayAdapter.ServicePay> {

    @Getter
    private List<String> dates;

    private String isSelected;

    public ServicePayAdapter(List<String> dates, ServicePayListener organizationListener) {
        this.dates = dates;
        this.servicePayListener = organizationListener;
    }

    private ServicePayListener servicePayListener;
    private boolean lock;

    public void updateItem(Integer position, String date) {
        dates.set(position, date);
        notifyItemChanged(position);
    }
    
    public interface ServicePayListener {
        void itemClick(View view, int position);
    }
    @NonNull
    @Override
    public ServicePay onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemServicePayBinding binding = ItemServicePayBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new ServicePay(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ServicePay holder, int position) {
        holder.onBind(position);
        holder.binding.layoutMain.setOnClickListener(view -> servicePayListener.itemClick(view, position));
    }

    @Override
    public int getItemCount() {
        return 0;
    }

    public void addList(List<String> dates){
        if(dates == null){
            return;
        }
        this.dates.addAll(dates);
        notifyItemRangeInserted(this.dates.size() - dates.size(),dates.size());
    }

    public void deleteItem(int position){
        dates.remove(position);
        notifyItemRemoved(position);
        notifyItemRangeChanged(position, dates.size());
    }

    public class ServicePay extends RecyclerView.ViewHolder{
        ItemServicePayBinding binding;
        int position;
        String date;
        public ServicePay(ItemServicePayBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void onBind(int position){
            this.position = position;
            date = dates.get(position);
            binding.setDate(date);
            binding.setDateChoose(isSelected);
            binding.setSecretKey(SecretKey.getInstance().getKey());
            binding.executePendingBindings();
        }

    }
}
