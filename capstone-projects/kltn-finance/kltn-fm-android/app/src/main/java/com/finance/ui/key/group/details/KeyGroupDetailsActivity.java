package com.finance.ui.key.group.details;

import android.os.Bundle;

import androidx.annotation.Nullable;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.databinding.ActivityKeyGroupDetailsBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;

import java.util.Objects;

public class KeyGroupDetailsActivity extends BaseActivity<ActivityKeyGroupDetailsBinding, KeyGroupDetailsViewModel> {
    @Override
    public int getLayoutId() {
        return R.layout.activity_key_group_details;
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

        viewModel.id.set(getIntent().getLongExtra(Constants.KEY_GROUP_ID,0));
        viewModel.isCreate.set(getIntent().getBooleanExtra(Constants.IS_CREATE,false));

        if(Objects.requireNonNull(viewModel.id.get()) != 0){
            viewModel.getKeyGroupDetails(viewModel.id.get());
        }

        viewModel.keyGroupResponse.observe(this, departmentResponse -> {
            viewModel.name.set(decrypt(departmentResponse.getName()));
            viewModel.description.set(decrypt(departmentResponse.getDescription()));
        });
    }
}
