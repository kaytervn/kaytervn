package com.finance.ui.fragment.statistics;


import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.statistics.StatisticsResponse;
import com.finance.databinding.FragmentStatisticsBinding;
import com.finance.di.component.FragmentComponent;
import com.finance.ui.base.BaseFragment;
import com.finance.ui.fragment.statistics.adapter.StatisticAdapter;
import com.finance.ui.fragment.statistics.detail.StaticsDetailActivity;
import com.finance.ui.view.EndlessRecyclerViewScrollListener;

import java.util.ArrayList;
import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;
import timber.log.Timber;

public class StatisticsFragment extends BaseFragment<FragmentStatisticsBinding, StatisticsFragmentViewModel> {

    StatisticAdapter adapter;
    EndlessRecyclerViewScrollListener endlessRecyclerViewScrollListener;

    Long currentPaymentPeriodId;
    Integer currentPosition;
    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    protected int getLayoutId() {
        return R.layout.fragment_statistics;
    }

    @Override
    protected void performDataBinding() {
        adapter = new StatisticAdapter();
        setStatistics();
        binding.swipeLayout.setOnRefreshListener(() -> {
            endlessRecyclerViewScrollListener.resetState();
            viewModel.pageNumber.set(0);
            getPaymentPeriods();
            binding.swipeLayout.setRefreshing(false);
        });

        viewModel.validKey.observe(getViewLifecycleOwner(), valid->{
            if(valid){
                getPaymentPeriods();
                adapter.setSecretKey(SecretKey.getInstance().getKey());
                viewModel.isValidKey.set(true);
            }else {
                viewModel.isValidKey.set(false);
            }
        });
    }

    @Override
    protected void performDependencyInjection(FragmentComponent buildComponent) {
        buildComponent.inject(this);
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getPaymentPeriods(){
        if (Objects.requireNonNull(viewModel.pageNumber.get()) == 0) {
            viewModel.showLoading();
        }
        compositeDisposable.add(viewModel.getPaymentPeriod()
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(response -> {
                            if(response.isResult()) {
//                        viewModel.totalElement.set(response.getData().getTotalElements().intValue());
                                if(response.getData().getContent()!=null){
                                    if (Objects.requireNonNull(viewModel.pageNumber.get()) == 0) {
                                        adapter.setStatistics(response.getData().getContent());
                                        adapter.notifyDataSetChanged();
                                    }else {
                                        adapter.addList(response.getData().getContent());
                                    }
                                }else {
                                    if (Objects.requireNonNull(viewModel.pageNumber.get()) == 0) {
                                        adapter.setStatistics(new ArrayList<>());
                                        adapter.notifyDataSetChanged();
                                    }
                                }
                                viewModel.totalElement.set(adapter.getItemCount());
                            }
                            viewModel.hideLoading();
                        },error->{
                            viewModel.showErrorMessage(getString(R.string.newtwork_error));
                            Timber.d(error);
                            viewModel.hideLoading();
                        })
        );
    }
    public void setStatistics(){
        LinearLayoutManager layout = new LinearLayoutManager(getActivity(),LinearLayoutManager.VERTICAL, false);
        binding.rcvStatistics.setAdapter(adapter);

        adapter.setStatisticListener(new StatisticAdapter.StatisticListener() {
            @Override
            public void itemClick(int position, StatisticsResponse statistic) {
                Intent intent = new Intent(getContext(), StaticsDetailActivity.class);
                intent.putExtra(Constants.PAYMENT_PERIOD_ID, statistic.getId());
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            }

            @Override
            public void recalculateAt(int position, StatisticsResponse statistics) {
                currentPaymentPeriodId = statistics.getId();
                currentPosition = position;
                openRecalculateDialog();
            }

            @Override
            public void approvePaymentPeriod(int position, StatisticsResponse statistics) {
                currentPaymentPeriodId = statistics.getId();
                currentPosition = position;
                openApproveDialog();
            }
        });

        endlessRecyclerViewScrollListener
                = new EndlessRecyclerViewScrollListener(layout) {
            @Override
            public void onLoadMore(int page, int totalItemsCount, RecyclerView view){
                int pageCurrent = Objects.requireNonNull(viewModel.pageNumber.get());
                viewModel.pageNumber.set(pageCurrent+1);
//                getStatistic();
                getPaymentPeriods();
            }
        };
        binding.rcvStatistics.addOnScrollListener(endlessRecyclerViewScrollListener);
        binding.rcvStatistics.setLayoutManager(layout);
    }

    public void checkSecretKey(){
        setSecretKeyListener();
        if(checkSecretKeyValid()){
            if(Boolean.FALSE.equals(viewModel.validKey.getValue())){
                viewModel.validKey.setValue(true);
            }
        }else {
            viewModel.validKey.setValue(false);
        }
    }


    private void approvePaymentPeriod(Long id){
        viewModel.showLoading();
        compositeDisposable.add(viewModel.approvePayment(id)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(response -> {
                            if(response.isResult()) {
                                viewModel.showSuccessMessage(getString(R.string.approve_payment_success));
                                adapter.getStatistics().get(currentPosition).setState(2);
                                adapter.notifyItemChanged(currentPosition);
                            }
                            viewModel.hideLoading();
                        },error->{
                            viewModel.showErrorMessage(getString(R.string.newtwork_error));
                            Timber.d(error);
                            viewModel.hideLoading();
                        })
        );
    }
    private void recalculatePaymentPeriod(Long id){
        viewModel.showLoading();
        compositeDisposable.add(viewModel.recalculatePayment(id)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    if(response.isResult()) {
                        viewModel.showSuccessMessage(getString(R.string.recalculate_payment_success));
                    }
                    viewModel.hideLoading();
                },error->{
                    viewModel.showErrorMessage(getString(R.string.newtwork_error));
                    Timber.d(error);
                    viewModel.hideLoading();
                })
        );
    }

    @SuppressLint("NotifyDataSetChanged")
    private void openApproveDialog(){
        // Show Dialog custom
        Dialog dialog = new Dialog(this.requireContext());
        dialog.setContentView(R.layout.dialog_aprrove);
        Window window = dialog.getWindow();
        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);
        Button btnApprove = dialog.findViewById(R.id.btn_approve);
        Button btnCancel = dialog.findViewById(R.id.btn_cancel);

        btnCancel.setOnClickListener(v -> dialog.dismiss());

        btnApprove.setOnClickListener(v -> {
            approvePaymentPeriod(currentPaymentPeriodId);
            adapter.notifyDataSetChanged();
            dialog.dismiss();
        });
        dialog.show();
    }

    @SuppressLint("NotifyDataSetChanged")
    private void openRecalculateDialog(){
        // Show Dialog custom
        Dialog dialog = new Dialog(requireContext());
        dialog.setContentView(R.layout.dialog_recalculate);
        Window window = dialog.getWindow();
        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);
        Button btnConfirm = dialog.findViewById(R.id.btn_confirm);
        Button btnCancel = dialog.findViewById(R.id.btn_cancel);

        btnCancel.setOnClickListener(v -> dialog.dismiss());

        btnConfirm.setOnClickListener(v -> {
            recalculatePaymentPeriod(currentPaymentPeriodId);
            adapter.notifyDataSetChanged();
            dialog.dismiss();
        });
        dialog.show();
    }
}