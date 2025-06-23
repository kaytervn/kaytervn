package com.finance.ui.password.forget;

import android.content.Intent;

import androidx.databinding.ObservableField;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.request.account.AccountEmail;
import com.finance.ui.base.BaseViewModel;
import com.finance.ui.password.reset.ResetPasswordActivity;

import org.apache.commons.validator.routines.EmailValidator;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;
import retrofit2.HttpException;
import timber.log.Timber;

public class ForgetPasswordViewModel extends BaseViewModel {

    public ObservableField<String> email = new ObservableField<>();
    public ForgetPasswordViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void forgetPassword(){
        if(email.get()==null || Objects.requireNonNull(email.get()).isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_email));
            return;
        }
        else if(!EmailValidator.getInstance().isValid(email.get())){
            showErrorMessage(application.getString(R.string.invalid_format_email));
            return;
        }
        showLoading();
        compositeDisposable.add(repository.getApiService().forgetPassword(new AccountEmail(email.get()))
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    if(response.isResult()){
                        showSuccessMessage(application.getString(R.string.forget_password_success));
                        Intent intent = new Intent(application.getCurrentActivity(), ResetPasswordActivity.class);
                        intent.putExtra(Constants.KEY_USER_ID, response.getData().getUserId());
                        application.getCurrentActivity().startActivity(intent);
                        application.getCurrentActivity().finish();
                    }else{
                        if(response.getCode().equals(Constants.ERROR_EMAIL_NOT_FOUND)){
                            showErrorMessage(application.getString(R.string.not_found_account_by_email));
                        }else {
                            showErrorMessage(response.getMessage());
                        }
                    }
                    hideLoading();
                }, err -> {
                    if(err instanceof HttpException){
                        if(((HttpException) err).code() == 400){
                            showErrorMessage(application.getString(R.string.invalid_format_email));
                        }
                    }else {
                        showErrorMessage(application.getString(R.string.newtwork_error));
                    }
                    Timber.d(err);
                    hideLoading();
                }));
    }

}
