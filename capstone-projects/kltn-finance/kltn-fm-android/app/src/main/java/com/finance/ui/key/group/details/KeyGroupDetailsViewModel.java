package com.finance.ui.key.group.details;

import android.app.Activity;
import android.content.Intent;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.request.key.KeyGroupCreateRequest;
import com.finance.data.model.api.request.key.KeyGroupUpdateRequest;
import com.finance.data.model.api.response.key.KeyGroupResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.utils.NetworkUtils;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class KeyGroupDetailsViewModel extends BaseViewModel {
    public MutableLiveData<KeyGroupResponse> keyGroupResponse = new MutableLiveData<>();
    public ObservableField<String> name = new ObservableField<>();
    public ObservableField<String> description = new ObservableField<>();
    public ObservableField<Long> id = new ObservableField<>();
    public ObservableField<Integer> status = new ObservableField<>(1);
    public ObservableField<Boolean> isCreate = new ObservableField<>(false);

    public KeyGroupDetailsViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getKeyGroupDetails(Long id){
        showLoading();
        compositeDisposable.add(repository.getApiService().getGroupKey(id)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                hideLoading();
                                return application.showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            hideLoading();
                            if (response.isResult()) {
                                keyGroupResponse.setValue(response.getData());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void createKeyGroup(){
        if(name.get()== null || Objects.requireNonNull(name.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_key_group_name));
            return;
        }
        if(description.get()== null || Objects.requireNonNull(description.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_key_group_description));
            return;
        }
        showLoading();
        compositeDisposable.add(repository.getApiService().createKeyGroup(
                new KeyGroupCreateRequest(
                        Objects.requireNonNull(name.get()).trim(), Objects.requireNonNull(description.get()).trim()))
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                hideLoading();
                                return application.showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            hideLoading();
                            if (response.isResult()) {
                                showSuccessMessage(application.getString(R.string.add_new_key_group_success));
                                Intent intent = new Intent();
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, intent);
                                application.getCurrentActivity().finish();
                            }else {
                                showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void updateKeyGroup(){
        if(name.get()== null || Objects.requireNonNull(name.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_key_group_name));
            return;
        }
        if(description.get()== null || Objects.requireNonNull(description.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_key_group_description));
            return;
        }
        showLoading();
        compositeDisposable.add(repository.getApiService().updateKeyGroup(new KeyGroupUpdateRequest(id.get(), Objects.requireNonNull(name.get()).trim(), Objects.requireNonNull(description.get()).trim()))
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                hideLoading();
                                return application.showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            hideLoading();
                            if (response.isResult()) {
                                showSuccessMessage(application.getString(R.string.update_key_group_success));
                                Objects.requireNonNull(keyGroupResponse.getValue()).setName(name.get());
                                Intent intent = new Intent();
                                intent.putExtra(Constants.KEY_GROUP, ApiModelUtils.GSON.toJson(keyGroupResponse.getValue(), KeyGroupResponse.class));
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, intent);
                                application.getCurrentActivity().finish();
                            }else {
                                showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void doDone(){
        if(Boolean.TRUE.equals(isCreate.get())){
            createKeyGroup();
        }else {
            updateKeyGroup();
        }
    }
}
