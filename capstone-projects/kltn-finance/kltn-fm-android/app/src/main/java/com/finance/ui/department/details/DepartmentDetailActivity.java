package com.finance.ui.department.details;

import android.os.Bundle;

import androidx.annotation.Nullable;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.databinding.ActivityDepartmentDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;

import java.util.Objects;

public class DepartmentDetailActivity extends BaseActivity<ActivityDepartmentDetailBinding, DepartmentDetailsViewModel> {
    @Override
    public int getLayoutId() {
        return R.layout.activity_department_detail;
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

        viewModel.id.set(getIntent().getLongExtra(Constants.DEPARTMENT_ID,0));
        viewModel.isCreate.set(getIntent().getBooleanExtra(Constants.IS_CREATE,false));

        if(Objects.requireNonNull(viewModel.id.get()) != 0){
            viewModel.getDepartmentDetails(viewModel.id.get());
        }

        viewModel.departmentResponse.observe(this, departmentResponse -> {
            viewModel.name.set(departmentResponse.getName());
            viewModel.description.set(departmentResponse.getDescription());
        });
    }

}
