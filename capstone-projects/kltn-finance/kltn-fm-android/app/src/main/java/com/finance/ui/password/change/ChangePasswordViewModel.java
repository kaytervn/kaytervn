package com.finance.ui.password.change;

import androidx.databinding.ObservableField;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.request.account.ChangePasswordRequest;
import com.finance.ui.base.BaseViewModel;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class ChangePasswordViewModel extends BaseViewModel {
    public ObservableField<String> newPassword = new ObservableField<>();
    public ObservableField<String> confirmNewPassword = new ObservableField<>();
    public ObservableField<String> oldPassword = new ObservableField<>();
    public ObservableField<String> userId = new ObservableField<>();
    public ObservableField<Boolean> isShowPassword = new ObservableField<>(false);
    public ObservableField<Boolean> isShowPasswordCf = new ObservableField<>(false);
    public ObservableField<Boolean> isShowOldPassword = new ObservableField<>(false);
    public ChangePasswordViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void showPassword(){
        isShowPassword.set(Boolean.FALSE.equals(isShowPassword.get()));
    }
    public void showPasswordCf(){
        isShowPasswordCf.set(Boolean.FALSE.equals(isShowPasswordCf.get()));
    }
    public void showOldPassword(){
        isShowOldPassword.set(Boolean.FALSE.equals(isShowOldPassword.get()));
    }

    public void changePassword(){
        if(newPassword.get()==null || Objects.requireNonNull(newPassword.get()).isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_new_password));
            return;
        }
        if(confirmNewPassword.get()==null || Objects.requireNonNull(confirmNewPassword.get()).isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_password_confirm));
            return;
        }
        if(Objects.requireNonNull(newPassword.get()).length() < 6){
            showErrorMessage(application.getString(R.string.invalid_length_new_password));
            return;
        }
        if (!Objects.equals(newPassword.get(), confirmNewPassword.get())) {
            showErrorMessage(application.getString(R.string.mismatched_password));
            return;
        }
        if(Objects.requireNonNull(oldPassword.get()).length() < 6){
            showErrorMessage(application.getString(R.string.invalid_length_old_password));
            return;
        }
        showLoading();
        compositeDisposable.add(repository.getApiService().changePassword(
                    new ChangePasswordRequest(newPassword.get(), oldPassword.get())
                )
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    if(response.isResult()){
                        showSuccessMessage(response.getMessage());
                        application.getCurrentActivity().finish();
                    }else{
                        showErrorMessage(response.getMessage());
                    }
                    hideLoading();
                }, err -> {
                    hideLoading();
                    showErrorMessage(application.getString(R.string.newtwork_error));
                }));
    }
}
