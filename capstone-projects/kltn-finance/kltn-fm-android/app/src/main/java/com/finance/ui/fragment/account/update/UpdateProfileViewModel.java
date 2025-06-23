package com.finance.ui.fragment.account.update;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import androidx.databinding.ObservableField;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.request.account.UpdateProfileRequest;
import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.utils.NetworkUtils;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;


public class UpdateProfileViewModel extends BaseViewModel {
    public ObservableField<Boolean> isShowPassword = new ObservableField<>(false);

    public ObservableField<UpdateProfileRequest> profile = new ObservableField<>(new UpdateProfileRequest());
    public ObservableField<AccountResponse> accountResponseFromIntent = new ObservableField<>();
    public ObservableField<Boolean> isHasBirthDay = new ObservableField<>(false);
    public UpdateProfileViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);

    }

    public void showPassword(){
        isShowPassword.set(Boolean.FALSE.equals(isShowPassword.get()));
    }

    public void doUpdateProfile(){
        if (Objects.requireNonNull(profile.get()).getFullName() == null
                && Objects.requireNonNull(profile.get()).getFullName().trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_fullname));
            return;
        }
        if (!Objects.requireNonNull(profile.get()).getFullName().matches("^[\\p{L} ]+$")){
            showErrorMessage(application.getString(R.string.invalid_fullname_error));
            return;
        }
        if (Objects.requireNonNull(profile.get()).getOldPassword() == null
                || Objects.requireNonNull(profile.get()).getOldPassword().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_password));
            return;
        }
        Objects.requireNonNull(profile.get()).setFullName(
                Objects.requireNonNull(profile.get()).getFullName().trim());
        if (Objects.requireNonNull(profile.get()).getAddress() != null
                && !Objects.requireNonNull(profile.get()).getAddress().isEmpty()){
            Objects.requireNonNull(profile.get()).setAddress(
                    Objects.requireNonNull(profile.get()).getAddress().trim());
        }
        showLoading();
        compositeDisposable.add(repository.getApiService().updateProfile(profile.get())
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                return application.showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            hideLoading();
                            if(response.isResult()){
                                showSuccessMessage(application.getString(R.string.update_profile_success));
                                Intent intentResult = new Intent();
                                Bundle bundle = new Bundle();
                                bundle.putSerializable(Constants.UPDATE_PROFILE, profile.get());
                                intentResult.putExtras(bundle);
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, intentResult);
                                application.getCurrentActivity().finish();
                            }else{
                                if (response.getMessage().contains(application.getString(R.string.old_password_is_incorrect)))
                                    showErrorMessage(application.getString(R.string.error_password));
                            }
                        },
                        throwable -> {
                            hideLoading();
                            showErrorMessage(throwable.getMessage());
                        }
                )
        );
    }

    public void doUploadAvatar(MultipartBody.Part imagePart){
        RequestBody type = RequestBody.create("AVATAR", MediaType.parse("multipart/form-data"));
        compositeDisposable.add(repository.getApiMediaService().uploadFile(type, imagePart)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                return application.showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            if(response.isResult()){
                                Objects.requireNonNull(profile.get()).setAvatarPath(response.getData().getFilePath());
                            }else{
                                showErrorMessage(response.getMessage());
                            }
                            hideLoading();
                        },
                        throwable -> {
                            hideLoading();
                            showErrorMessage(throwable.getMessage());
                        }
                )
        );
    }

}
