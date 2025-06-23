package com.finance.ui.password.forget;

import com.finance.BR;
import com.finance.R;

import com.finance.databinding.ActivityPasswordForgetBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;

public class ForgetPasswordActivity extends BaseActivity<ActivityPasswordForgetBinding, ForgetPasswordViewModel> {
    @Override
    public int getLayoutId() {
        return R.layout.activity_password_forget;
    }

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    public void performDependencyInjection(ActivityComponent buildComponent) {
        buildComponent.inject(this);
    }
}
