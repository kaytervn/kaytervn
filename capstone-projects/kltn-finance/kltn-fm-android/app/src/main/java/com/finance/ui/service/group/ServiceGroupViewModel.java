package com.finance.ui.service.group;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.response.service.group.ServiceGroupResponse;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.base.BaseViewModel;
import com.finance.utils.NetworkUtils;

import java.util.ArrayList;
import java.util.List;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class ServiceGroupViewModel extends BaseViewModel {

    //MutableLiveData for call back data
    public MutableLiveData<List<ServiceGroupResponse>> serviceGroups = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<ServiceGroupResponse> serviceGroupLiveData = new MutableLiveData<>();
    public ObservableField<Integer> page = new ObservableField<>(0);
    public ObservableField<Integer> size = new ObservableField<>(20);
    public ObservableField<Integer> totalPage = new ObservableField<>();
    public ObservableField<Boolean> isCreate = new ObservableField<>(false);
    public ObservableField<Integer> totalElements = new ObservableField<>(0);
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);
    public ServiceGroupViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }


    public void getAllGroupService(int page, int size){
        if (page == 0){
            showLoading();
        }
        compositeDisposable.add(repository.getApiService().getAllGroupService(page, size, "createdDate,desc")
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
                                totalElements.set(response.getData().getTotalElements().intValue());
                                totalPage.set(response.getData().getTotalPages());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void getGroupServiceDetail(Long id){
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
                                serviceGroupLiveData.setValue(response.getData());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void deleteGroupService(Long id, BaseCallBack callBack){
        showLoading();
        compositeDisposable.add(repository.getApiService().deleteGroupService(id)
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
                                showSuccessMessage(application.getResources().getString(R.string.delete_group_service_success));
                                callBack.doSuccess();
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            callBack.doError(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
}
