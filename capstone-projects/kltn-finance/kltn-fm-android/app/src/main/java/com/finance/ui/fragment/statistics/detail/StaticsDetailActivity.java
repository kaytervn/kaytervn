package com.finance.ui.fragment.statistics.detail;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.request.transaction.TransactionRemoveRequest;
import com.finance.data.model.api.response.transaction.TransactionResponse;
import com.finance.databinding.ActivityStatisticsDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.fragment.home.adapter.TransactionResponseAdapter;
import com.finance.ui.transaction.detail.TransactionDetailActivity;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class StaticsDetailActivity extends BaseActivity<ActivityStatisticsDetailBinding, StatisticsDetailViewModel>
{
    private TransactionResponseAdapter adapter;
    private Long paymentPeriodId;
    //Approve


    @Override
    public int getLayoutId() {
        return R.layout.activity_statistics_detail;
    }

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    public void performDependencyInjection(ActivityComponent buildComponent) {
        buildComponent.inject(this);
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //Get month, startDate, endDate from intent
        String monthYear = getIntent().getStringExtra(Constants.MONTH_YEAR);
        if (monthYear != null) {
            viewModel.monthYear.set(monthYear);
        }
        paymentPeriodId = getIntent().getLongExtra(Constants.PAYMENT_PERIOD_ID, 0);
        checkPrivateKey();
        //Get transactions from api
        getListTransactionResponses();

    }

    @SuppressLint("NotifyDataSetChanged")
    private void getListTransactionResponses() {
        viewModel.transactions.observe(this, transactions -> {
            if (transactions == null || transactions.isEmpty())
                return;
            if (adapter == null)
                setupAdapter();
            for (int i = 0; i < transactions.size(); i++) {
                transactions.get(i).setName(decrypt(transactions.get(i).getName()));
            }
            viewModel.totalElements.set(transactions.size());
            if (Objects.requireNonNull(viewModel.kind.get()) == 0)
                calculateTotal(transactions);
            adapter.setListTransactionResponse(transactions);
            adapter.notifyDataSetChanged();

        });
    }
    private void setupAdapter() {
        adapter = new TransactionResponseAdapter(new ArrayList<>(), new TransactionResponseAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int pos) {
                if (checkPermission(Constants.PERMISSION_TRANSACTION_GET)){
                    TransactionResponse transactionResponse = adapter.getListTransactionResponse().get(pos);
                    Intent intent = new Intent(view.getContext(), TransactionDetailActivity.class);
                    intent.putExtra(Constants.TRANSACTION_ID, transactionResponse.getId());
                    startActivity(intent);
                }
            }

            @Override
            public void onApproveClick(View view, int pos) {
            }

            @Override
            public void onRejectClick(View view, int pos) {
                removeAt(view.getContext(), pos);
            }


            @Override
            public void onItemClickDelete(View view, int pos) {
                deleteAt(pos);
            }
        });

        viewBinding.rcvTransaction.setAdapter(adapter);
        viewBinding.rcvTransaction.setLayoutManager(new LinearLayoutManager(
                this,
                LinearLayoutManager.VERTICAL,
                false)
        );
    }



    public void getTransByKind(int kind){
        viewModel.kind.set(kind);
        viewModel.getMyTransactions(paymentPeriodId,kind);
    }

    public void getAllTrans(){
        viewModel.kind.set(0);
        viewModel.getMyTransactions(paymentPeriodId,null);
    }

    public void removeAt(Context context, int pos){
        // Show Dialog custom
        Dialog dialog = new Dialog(context);
        dialog.setContentView(R.layout.dialog_remove_transaction);
        Window window = dialog.getWindow();
        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);
        Button btnRemove = dialog.findViewById(R.id.btn_remove);
        Button btnCancel = dialog.findViewById(R.id.btn_cancel);
        btnCancel.setOnClickListener(v -> dialog.dismiss());

        btnRemove.setOnClickListener(v -> {
            //Reject transaction
            TransactionRemoveRequest request = new TransactionRemoveRequest();
            request.setId(adapter.getListTransactionResponse().get(pos).getId());
            viewModel.removeFromPeriod(request, new BaseCallBack() {
                @Override
                public void doError(Throwable throwable) {
                    viewModel.showErrorMessage(getString(R.string.can_not_move));
                    dialog.dismiss();
                }

                @SuppressLint("NotifyDataSetChanged")
                @Override
                public void doSuccess() {
                    String decrypted = decrypt(adapter.getListTransactionResponse().get(pos).getMoney());
                    Double money = Double.valueOf(decrypted);
                    if (adapter.getListTransactionResponse().get(pos).getKind() == 1){
                        viewModel.totalIncome.set(
                                Objects.requireNonNull(viewModel.totalIncome.get()) - money);
                    } else {
                        viewModel.totalExpenditure.set(
                                Objects.requireNonNull(viewModel.totalExpenditure.get()) - money);
                    }
                    adapter.getListTransactionResponse().remove(pos);
                    adapter.notifyItemChanged(pos);
                    dialog.dismiss();
                }
            });

        });
        dialog.show();
    }

    @SuppressLint("NotifyDataSetChanged")
    private void checkPrivateKey() {
        viewModel.validKey.observe(this,valid->{
            if(valid){
                //Default data
                setupAdapter();
                adapter.setListTransactionResponse(new ArrayList<>());
                adapter.setSecretKey(SecretKey.getInstance().getKey());
                adapter.notifyDataSetChanged();
                viewModel.getMyTransactions(paymentPeriodId, null);
            }else {
                if (adapter != null){
                    adapter.setListTransactionResponse(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                showInputKey();
            }
        });

    }

    public void deleteAt(int pos){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.transaction), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                viewModel.deleteTransaction(adapter.getListTransactionResponse().get(pos).getId(), new BaseCallBack() {
                    @Override
                    public void doError(Throwable throwable) {
                        viewModel.showErrorMessage(throwable.getMessage());
                    }

                    @SuppressLint("NotifyDataSetChanged")
                    @Override
                    public void doSuccess() {
                        String decrypted = decrypt(adapter.getListTransactionResponse().get(pos).getMoney());
                        Double money = Double.valueOf(decrypted);
                        if (Objects.requireNonNull(viewModel.transactions.getValue())
                                .get(pos).getKind() == 1){
                            viewModel.totalIncome.set(
                                    Objects.requireNonNull(viewModel.totalIncome.get()) - money);
                        } else {
                            viewModel.totalExpenditure.set(
                                    Objects.requireNonNull(viewModel.totalExpenditure.get()) - money);
                        }
                        adapter.getListTransactionResponse().remove(pos);
                        if (viewModel.transactions.getValue().isEmpty()){
                            viewModel.totalElements.set(0);
                        }
                        adapter.notifyDataSetChanged();
                    }
                });
            }

            @Override
            public void cancelDelete() {

            }
        });
        deleteDialog.show(this.getSupportFragmentManager(), Constants.DELETE_DIALOG);

    }

    public void calculateTotal(List<TransactionResponse> TransactionResponses){
        viewModel.totalIncome.set(0.0);
        viewModel.totalExpenditure.set(0.0);
        for (TransactionResponse TransactionResponse : TransactionResponses){
            if (TransactionResponse.getKind() == 1){
                viewModel.totalIncome.set(Objects.requireNonNull(viewModel.totalIncome.get()) + Double.parseDouble(decrypt(TransactionResponse.getMoney())));
            }else {
                viewModel.totalExpenditure.set(Objects.requireNonNull(viewModel.totalExpenditure.get()) + Double.parseDouble(decrypt(TransactionResponse.getMoney())));
            }
        }
    }
}
