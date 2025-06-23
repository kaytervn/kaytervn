package com.finance.ui.fragment.statistics.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.ui.swipe.ViewBinderHelper;
import com.finance.data.model.api.response.statistics.StatisticsResponse;
import com.finance.databinding.ItemStatisticsBinding;
import com.finance.utils.AESUtils;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
public class StatisticAdapter extends RecyclerView.Adapter<StatisticAdapter.StatisticViewHolder> {

    @Setter
    private List<StatisticsResponse> statistics;

    private final ViewBinderHelper viewBinderHelper = new ViewBinderHelper();
    public StatisticAdapter(){
        viewBinderHelper.setOpenOnlyOne(true);
    }
    @Getter
    @Setter
    private String secretKey;
    @Setter
    private StatisticListener statisticListener;
    public interface StatisticListener{
        void itemClick(int position, StatisticsResponse statistic);
        void recalculateAt(int position, StatisticsResponse statistic);
        void approvePaymentPeriod(int position, StatisticsResponse statistics);
    }
    @NonNull
    @Override
    public StatisticViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemStatisticsBinding binding = ItemStatisticsBinding.inflate(LayoutInflater.from(parent.getContext()),parent, false);
        return new StatisticViewHolder(binding,statisticListener);
    }

    @Override
    public void onBindViewHolder(@NonNull StatisticViewHolder holder, int position) {
        holder.onBind(position);
    }

    @Override
    public int getItemCount() {
        return statistics!= null? statistics.size() : 0;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void addList(List<StatisticsResponse> Statistics){
        if(Statistics == null){
            return;
        }
        this.statistics.addAll(Statistics);
        notifyDataSetChanged();
    }



    public void updateItem(Integer position, StatisticsResponse StatisticResponse){
        statistics.set(position,StatisticResponse);
        notifyItemChanged(position);
    }

    public class StatisticViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        ItemStatisticsBinding binding;
        StatisticListener statisticListener;
        int position;
        StatisticsResponse statistic;
        public StatisticViewHolder(ItemStatisticsBinding binding, StatisticListener statisticListener) {
            super(binding.getRoot());
            this.binding = binding;
            this.statisticListener = statisticListener;
            binding.getRoot().setOnClickListener(this);
        }

        @SuppressLint("UseCompatLoadingForDrawables")
        void onBind(int position){
            this.position = position;
            statistic = statistics.get(position);

            viewBinderHelper.bind(binding.swipeRevealLayout, statistic.getId().toString());
            if(statistic.getState() == 1){
                viewBinderHelper.unlockSwipe(statistic.getId().toString());
            }else {
                viewBinderHelper.lockSwipe(statistic.getId().toString());
            }
            binding.layoutApprove.setOnClickListener(view -> {
                statisticListener.approvePaymentPeriod(position,statistic);
                viewBinderHelper.closeLayout(statistic.getId().toString());
            });
            binding.layoutRecalculate.setOnClickListener(view -> {
                statisticListener.recalculateAt(position,statistic);
                viewBinderHelper.closeLayout(statistic.getId().toString());
            });

            binding.itemLayout.setOnClickListener(view -> {
                statisticListener.itemClick(position, statistic);
                viewBinderHelper.closeLayout(statistic.getId().toString());
            });

            double totalIncome = Double.parseDouble(AESUtils.decrypt(secretKey, statistic.getTotalIncome()));
            double totalOutcome = Double.parseDouble(AESUtils.decrypt(secretKey, statistic.getTotalExpenditure()));
            if (totalIncome == totalOutcome && totalIncome == 0)
                binding.layoutMoney.setVisibility(View.GONE);
            else
                binding.layoutMoney.setVisibility(View.VISIBLE);
            binding.setSecretKey(secretKey);
            binding.setIvm(statistic);
            binding.executePendingBindings();
        }

        @Override
        public void onClick(View view) {
            statisticListener.itemClick(position, statistic);
        }
    }
}
