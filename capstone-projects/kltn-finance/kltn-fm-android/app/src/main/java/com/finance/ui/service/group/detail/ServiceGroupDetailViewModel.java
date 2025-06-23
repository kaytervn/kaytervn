package com.finance.ui.service.group.detail;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.request.service.group.GroupServiceCreateRequest;
import com.finance.data.model.api.request.service.group.GroupServiceUpdateRequest;
import com.finance.data.model.api.response.service.group.ServiceGroupResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.ui.service.group.ServiceGroupActivity;
import com.finance.utils.NetworkUtils;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class ServiceGroupDetailViewModel extends BaseViewModel {
    public MutableLiveData<ServiceGroupResponse> serviceGroup = new MutableLiveData<>();
    public ObservableField<String> name = new ObservableField<>();
    public ObservableField<String> description = new ObservableField<>();
    public ObservableField<Long> id = new ObservableField<>();
    public ObservableField<Integer> position = new ObservableField<>();
    public ObservableField<Boolean> isCreate = new ObservableField<>(false);
    public ServiceGroupDetailViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }
    public void getGroupServiceDetails(Long id){
        showLoading();
        compositeDisposable.add(repository.getApiService().getGroupServiceDetail(id)
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
                                serviceGroup.setValue(response.getData());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void createGroupService(){
        if (invalidData()) return;
        showLoading();
        compositeDisposable.add(repository.getApiService().createGroupService(
                    new GroupServiceCreateRequest(
                            name.get(),
                            description.get()
                    )
                )
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
                                showSuccessMessage(application.getResources().getString(R.string.create_group_service_success));
                                Intent intent = new Intent(application.getCurrentActivity(), ServiceGroupActivity.class);
                                application.getCurrentActivity().startActivity(intent);
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

    private boolean invalidData() {
        if(name.get()== null ||  Objects.requireNonNull(name.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_group_service_name));
            return true;
        }
        if(description.get()== null ||  Objects.requireNonNull(description.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_desciption_group_service));
            return true;
        }
        name.set(Objects.requireNonNull(name.get()).trim());
        description.set(Objects.requireNonNull(description.get()).trim());
        return false;
    }

    public void updateGroupService(){
        if (invalidData()) return;
        showLoading();
        compositeDisposable.add(repository.getApiService().updateGroupService(
                    new GroupServiceUpdateRequest(
                            id.get(),
                            name.get(),
                            description.get()
                    )
                )
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
                                showSuccessMessage(application.getResources().getString(R.string.update_group_service_success));
                                Intent resultIntent = new Intent();
                                Bundle bundle = new Bundle();
                                bundle.putLong(Constants.GROUP_SERVICE_ID, Objects.requireNonNull(id.get()));
                                bundle.putInt(Constants.POSITION, Objects.requireNonNull(position.get()));
                                resultIntent.putExtras(bundle);
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, resultIntent);
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


}
