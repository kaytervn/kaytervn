package com.finance.ui.transaction.group.detail;

import android.os.Bundle;

import androidx.annotation.Nullable;

import com.finance.BR;
import com.finance.R;


import com.finance.constant.Constants;
import com.finance.databinding.ActivityTransactionGroupDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;

import java.util.Objects;

public class TransactionGroupDetailActivity extends BaseActivity<ActivityTransactionGroupDetailBinding, TransactionGroupDetailViewModel> {
    @Override
    public int getLayoutId() {
        return R.layout.activity_transaction_group_detail;
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

        viewModel.id.set(getIntent().getLongExtra(Constants.GROUP_TRANSACTION_ID,0));
        viewModel.position.set(getIntent().getIntExtra(Constants.POSITION,0));
        viewModel.isCreate.set(getIntent().getBooleanExtra(Constants.IS_CREATE,false));

        if(Objects.requireNonNull(viewModel.id.get()) != 0){
            viewModel.getTransactionGroupDetail(viewModel.id.get());
        }
        //Get detail transaction from API
        getTransactionGroupDetail();
    }

    private void getTransactionGroupDetail() {
        viewModel.groupTransactionResponse.observe(this, groupTransactionResponse -> {
            if (groupTransactionResponse != null){
                viewBinding.editGroupTransactionName.setText(decrypt(groupTransactionResponse.getName()));
                viewBinding.editGroupTransactionDescription.setText(decrypt(groupTransactionResponse.getDescription()));
                viewModel.name.set(groupTransactionResponse.getName());
                viewModel.description.set(groupTransactionResponse.getDescription());
            }
        });
    }

    public void createOrUpdateTransactionGroup(){
        viewModel.name.set(viewBinding.editGroupTransactionName.getText().toString());
        viewModel.description.set(viewBinding.editGroupTransactionDescription.getText().toString());
        viewModel.createOrUpdateTransactionGroup();
        hideKeyboard();
    }


}
