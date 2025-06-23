package com.finance.ui.password.reset;

import androidx.databinding.ObservableField;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.response.account.ResetPassword;
import com.finance.ui.base.BaseViewModel;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;
import retrofit2.HttpException;

public class ResetPasswordViewModel extends BaseViewModel {

    public ObservableField<String> password = new ObservableField<>();
    public ObservableField<String> email = new ObservableField<>();
    public ObservableField<String> passwordConfirm = new ObservableField<>();
    public ObservableField<String> userId = new ObservableField<>();
    public ObservableField<String> otp = new ObservableField<>();
    public ObservableField<Boolean> isShowPassword = new ObservableField<>(false);
    public ObservableField<Boolean> isShowPasswordCf = new ObservableField<>(false);
    public ResetPasswordViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void showPassword(){
        isShowPassword.set(Boolean.FALSE.equals(isShowPassword.get()));
    }

    public void showPasswordCf(){
        isShowPasswordCf.set(Boolean.FALSE.equals(isShowPasswordCf.get()));
    }

    public void resetPassword(){
        if(password.get()==null || Objects.requireNonNull(password.get()).isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_new_password));
            return;
        } else if (Objects.requireNonNull(password.get()).length()<6) {
            showErrorMessage(application.getString(R.string.password_length_invalid));
            return;
        }
        if(passwordConfirm.get()==null || Objects.requireNonNull(passwordConfirm.get()).isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_password_confirm));
            return;
        }
        if(!Objects.equals(passwordConfirm.get(), password.get())){
            showErrorMessage(application.getString(R.string.incorrect_password_confirm));
            return;
        }
        if(otp.get()==null || Objects.requireNonNull(otp.get()).isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_otp));
            return;
        }
        showLoading();
        compositeDisposable.add(repository.getApiService().resetPassword(new ResetPassword(password.get(),otp.get(),userId.get()))
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    if(response.isResult()){
                        showSuccessMessage(application.getString(R.string.reset_password_success));
                        application.getCurrentActivity().finish();
                    }else{
                        if(Objects.equals(response.getCode(), Constants.ERROR_ACCOUNT_RESET_PASS)){
                            showErrorMessage(application.getString(R.string.new_password_equals_old_password));
                        }else if (Objects.equals(response.getCode(), Constants.ERROR_FORGET_PASS)){
                            showErrorMessage(application.getString(R.string.incorrect_otp));
                        }else {
                            showErrorMessage(response.getMessage());
                        }
                    }
                    hideLoading();
                }, err -> {
                    if(err instanceof HttpException){
                        if(((HttpException) err).code() == 400){
                            showErrorMessage(application.getString(R.string.invalid_format_otp));
                        }
                    }else {
                        showErrorMessage(application.getString(R.string.newtwork_error));
                    }
                    hideLoading();
                }));
    }

}
