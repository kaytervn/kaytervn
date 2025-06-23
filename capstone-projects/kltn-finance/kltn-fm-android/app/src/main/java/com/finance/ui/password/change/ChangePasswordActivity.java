package com.finance.ui.password.change;


import android.os.Bundle;
import android.text.method.PasswordTransformationMethod;

import androidx.annotation.Nullable;
import androidx.databinding.Observable;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;

import com.finance.databinding.ActivityPasswordChangeBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;

public class ChangePasswordActivity extends BaseActivity<ActivityPasswordChangeBinding, ChangePasswordViewModel> {


    @Override
    public int getLayoutId() {
        return R.layout.activity_password_change;
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

        viewModel.userId.set(getIntent().getStringExtra(Constants.KEY_USER_ID));

        viewModel.isShowPassword.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                int pos = viewBinding.editNewPassword.getSelectionStart();
                if(Boolean.FALSE.equals(viewModel.isShowPassword.get())){
                    viewBinding.editNewPassword.setTransformationMethod(PasswordTransformationMethod.getInstance());
                }else {
                    viewBinding.editNewPassword.setTransformationMethod(null);
                }
                viewBinding.editNewPassword.setSelection(pos);

            }
        });

        viewModel.isShowPasswordCf.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                int pos = viewBinding.editPassword.getSelectionStart();
                if(Boolean.FALSE.equals(viewModel.isShowPasswordCf.get())){
                    viewBinding.editPassword.setTransformationMethod(PasswordTransformationMethod.getInstance());
                }else {
                    viewBinding.editPassword.setTransformationMethod(null);
                }
                viewBinding.editPassword.setSelection(pos);

            }
        });

        viewModel.isShowOldPassword.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                int pos = viewBinding.editOldPassword.getSelectionStart();
                if(Boolean.FALSE.equals(viewModel.isShowOldPassword.get())){
                    viewBinding.editOldPassword.setTransformationMethod(PasswordTransformationMethod.getInstance());
                }else {
                    viewBinding.editOldPassword.setTransformationMethod(null);
                }
                viewBinding.editOldPassword.setSelection(pos);

            }
        });
    }
}
