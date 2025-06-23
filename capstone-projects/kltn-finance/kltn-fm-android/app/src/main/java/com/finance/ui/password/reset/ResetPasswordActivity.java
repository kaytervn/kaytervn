package com.finance.ui.password.reset;


import android.os.Bundle;
import android.text.method.PasswordTransformationMethod;

import androidx.annotation.Nullable;
import androidx.databinding.Observable;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;

import com.finance.databinding.ActivityPasswordResetBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;

public class ResetPasswordActivity extends BaseActivity<ActivityPasswordResetBinding, ResetPasswordViewModel> {


    @Override
    public int getLayoutId() {
        return R.layout.activity_password_reset;
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
                int pos = viewBinding.editPasswordConfirm.getSelectionStart();
                if(Boolean.FALSE.equals(viewModel.isShowPasswordCf.get())){
                    viewBinding.editPasswordConfirm.setTransformationMethod(PasswordTransformationMethod.getInstance());
                }else {
                    viewBinding.editPasswordConfirm.setTransformationMethod(null);
                }
                viewBinding.editPasswordConfirm.setSelection(pos);

            }
        });
    }
}
