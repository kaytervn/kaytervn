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
import com.finance.databinding.ItemServiceScheduleBinding;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class ServiceScheduleAdapter extends RecyclerView.Adapter<ServiceScheduleAdapter.ServiceScheduleViewHolder> {

    @Getter
    @Setter
    private List<Integer> listNumbers;
    private final OnItemClickListener onItemClickListener;
    @Getter
    @Setter
    private ViewBinderHelper viewBinderHelper = new ViewBinderHelper();

    public ServiceScheduleAdapter(List<Integer> listNumbers, OnItemClickListener onItemClickListener) {
        this.listNumbers = listNumbers;
        this.onItemClickListener = onItemClickListener;
        viewBinderHelper.setOpenOnlyOne(true);
    }

    @NonNull
    @Override
    public ServiceScheduleViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ServiceScheduleViewHolder(ItemServiceScheduleBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull ServiceScheduleViewHolder holder, @SuppressLint("RecyclerView") int position) {
        if (listNumbers == null) {
            return;
        }

        Integer num = listNumbers.get(position);
        viewBinderHelper.bind(holder.binding.swipeRevealLayout, String.valueOf(num));
        holder.binding.setNum(num);
        holder.binding.layoutDelete.setOnClickListener(v -> {
            onItemClickListener.onDeleteClick(v, position);
            viewBinderHelper.closeLayout(String.valueOf(num));
        });
        holder.binding.layoutUpdate.setOnClickListener(v -> {
            viewBinderHelper.closeLayout(String.valueOf(num));
            Handler handler = new Handler(Looper.getMainLooper());
            handler.postDelayed(() -> onItemClickListener.onItemClick(v, position), 304); // Delay in milliseconds
        });

    }

    @Override
    public int getItemCount() {
        if (listNumbers == null) {
            return 0;
        }
        return listNumbers.size();
    }

    public static class ServiceScheduleViewHolder extends RecyclerView.ViewHolder {
        ItemServiceScheduleBinding binding;

        public ServiceScheduleViewHolder(ItemServiceScheduleBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }

    public interface OnItemClickListener {
        void onItemClick(View view, int pos);

        void onDeleteClick(View view, int pos);
    }
}

