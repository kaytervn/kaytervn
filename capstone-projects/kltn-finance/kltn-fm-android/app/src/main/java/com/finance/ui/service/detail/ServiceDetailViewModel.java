package com.finance.ui.service.detail;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.request.service.ServiceCreateUpdateRequest;
import com.finance.data.model.api.response.service.ServiceResponse;
import com.finance.data.model.api.response.service.group.ServiceGroupResponse;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.ui.service.ServiceActivity;
import com.finance.utils.NetworkUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;
import timber.log.Timber;

public class ServiceDetailViewModel extends BaseViewModel {

    //MutableLiveData for callback data
    public MutableLiveData<ServiceResponse> serviceLiveData = new MutableLiveData<>(new ServiceResponse());

    public MutableLiveData<List<ServiceGroupResponse>> serviceGroups = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<List<TagResponse>> tags = new MutableLiveData<>(new ArrayList<>());
    public ObservableField<ServiceCreateUpdateRequest> serviceRequest = new ObservableField<>(new ServiceCreateUpdateRequest());

    //Intent
    public ObservableField<Integer> position = new ObservableField<>();
    public ObservableField<Boolean> isCreated = new ObservableField<>(false);
    public ObservableField<Boolean> isFromNotify = new ObservableField<>(false);
    public ObservableField<Boolean> isNotFound = new ObservableField<>(false);

    //Have Data
    public ObservableField<Boolean> isHaveGroupService = new ObservableField<>(false);
    public ObservableField<Boolean> isHaveTag = new ObservableField<>(false);

    //Valid Data
    public ObservableField<Boolean> isRightGroupService = new ObservableField<>(false);
    public ObservableField<Boolean> isRightTag = new ObservableField<>(false);
    public ObservableField<Boolean> isChoosePeriod = new ObservableField<>(false);
    public ServiceDetailViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getServiceDetail(Long id){
        showLoading();
        compositeDisposable.add(repository.getApiService().getServiceDetail(id)
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
                            if (response.isResult()) {
                                Timber.tag("ServiceDetail").e(response.getData().getPeriodKind().toString());
                                serviceLiveData.setValue(response.getData());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            Timber.tag("ServiceDetail").e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void getListTags(){
        showLoading();
        compositeDisposable.add(repository.getApiService().getTags(2)
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
                            if (response.isResult() && response.getData().getContent() != null) {
                                isHaveTag.set(true);
                                tags.setValue(response.getData().getContent());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            Timber.tag("TransactionCreateTag").e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void createService(){
        if (invalidData()) return;
        showLoading();
        compositeDisposable.add(
                repository.getApiService().createService(
                                serviceRequest.get()
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
                                showSuccessMessage(application.getResources().getString(R.string.create_service_success));
                                Intent intent = new Intent(application, ServiceActivity.class);
                                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                application.getCurrentActivity().startActivity(intent);
                                application.getCurrentActivity().finish();
                            }else {
                                showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            hideLoading();
                            Timber.e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void updateService(){
        if (invalidData()) return;
        showLoading();
        compositeDisposable.add(repository.getApiService().updateService(serviceRequest.get())
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
                                showSuccessMessage(application.getResources().getString(R.string.update_service_success));
                                Intent resultIntent = new Intent();
                                Bundle bundle = new Bundle();
                                bundle.putSerializable(Constants.SERVICE_ID,
                                        Objects.requireNonNull(serviceRequest.get()).getId());
                                bundle.putInt(Constants.POSITION, Objects.requireNonNull(position.get()));
                                resultIntent.putExtras(bundle);
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, resultIntent);
                                application.getCurrentActivity().finish();
                            }else {
                                if (response.getMessage().equals(application.getString(R.string.condition_date)))
                                    showErrorMessage(application.getString(R.string.condition_date_vn));
                                else
                                    showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    private boolean invalidData() {
        if (serviceRequest.get() == null){
            showErrorMessage(application.getString(R.string.invalid_some_field));
            return true;
        }
        if (Objects.requireNonNull(serviceRequest.get()).getKind() == null){
            showErrorMessage(application.getString(R.string.invalid_service_kind));
            return true;
        }
        if (Objects.requireNonNull(serviceRequest.get()).getPeriodKind() == null){
            showErrorMessage(application.getString(R.string.invalid_period));
            return true;
        }
        if(Objects.requireNonNull(serviceRequest.get()).getName() == null
                || Objects.requireNonNull(serviceRequest.get()).getName().isEmpty()
                || Objects.requireNonNull(serviceRequest.get()).getName().trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_service_name));
            return true;
        }
        if (Objects.requireNonNull(serviceRequest.get()).getMoney() == null
                || Objects.requireNonNull(serviceRequest.get()).getMoney() == 0){
            showErrorMessage(application.getString(R.string.invalid_money));
            return true;
        }
        if (Objects.requireNonNull(serviceRequest.get()).getDescription() != null
                && Objects.requireNonNull(serviceRequest.get()).getDescription().trim().isEmpty()){
            Objects.requireNonNull(serviceRequest.get()).setDescription("");
        }
        if (Boolean.FALSE.equals(isRightTag.get())){
            showErrorMessage(application.getString(R.string.tag_do_not_exist));
            return true;
        }
        return false;
    }

    public void getAllServiceGroups(){
        showLoading();
        compositeDisposable.add(repository.getApiService().getAllGroupService(0)
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
                                serviceGroups.setValue(response.getData().getContent());
                                isHaveGroupService.set(true);
                            }
                            else
                                isHaveGroupService.set(false);
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
    @Override
    protected void onCleared() {
        super.onCleared();
        serviceGroups.setValue(null);
        serviceLiveData.setValue(null);
        tags.setValue(null);

    }

}
