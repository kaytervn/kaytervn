package com.finance.ui.service.group.detail;

import android.os.Bundle;

import androidx.annotation.Nullable;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.databinding.ActivityServiceGroupDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;

import java.util.Objects;

public class ServiceGroupDetailActivity extends BaseActivity<ActivityServiceGroupDetailBinding, ServiceGroupDetailViewModel> {
    @Override
    public int getLayoutId() {
        return R.layout.activity_service_group_detail;
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

        viewModel.id.set(getIntent().getLongExtra(Constants.GROUP_SERVICE_ID,0));
        viewModel.position.set(getIntent().getIntExtra(Constants.POSITION,0));
        viewModel.isCreate.set(getIntent().getBooleanExtra(Constants.IS_CREATE,false));

        if(Objects.requireNonNull(viewModel.id.get()) != 0){
            viewModel.getGroupServiceDetails(viewModel.id.get());
        }

        getServiceGroupDetail();
    }

    private void getServiceGroupDetail() {
        viewModel.serviceGroup.observe(this, groupServiceResponse -> {
            viewBinding.editGroupServiceName.setText(decrypt(groupServiceResponse.getName()));
            viewBinding.editGroupServiceDescription.setText(decrypt(groupServiceResponse.getDescription()));
            viewModel.name.set(groupServiceResponse.getName());
            viewModel.description.set(groupServiceResponse.getDescription());
        });
    }

    public void createOrUpdateServiceGroup(){
        viewModel.name.set(viewBinding.editGroupServiceName.getText().toString());
        viewModel.description.set(viewBinding.editGroupServiceDescription.getText().toString());
        if(Boolean.TRUE.equals(viewModel.isCreate.get())){
            viewModel.createGroupService();
        }else {
            viewModel.updateGroupService();
        }
    }
}
