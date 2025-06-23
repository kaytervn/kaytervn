package com.finance.ui.service;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.request.service.pay.ServicePayRequest;
import com.finance.data.model.api.response.service.ServiceResponse;
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
import timber.log.Timber;

public class ServiceViewModel extends BaseViewModel {

    //MutableLiveData for call back data
    public MutableLiveData<List<ServiceResponse>> services = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<ServiceResponse> serviceLiveData = new MutableLiveData<>();
    public ObservableField<Boolean> isCreate = new ObservableField<>(false);
    public ObservableField<Integer> totalElements = new ObservableField<>(0);
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);
    public ObservableField<Integer> sort = new ObservableField<>(3);
    public ObservableField<String> isSearchEmpty = new ObservableField<>("");
    public ObservableField<Boolean> isSearch = new ObservableField<>(false);

    public void isShowSearch() {
        isSearch.set(Boolean.FALSE.equals(isSearch.get()));
    }
    public ServiceViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getAllServices(Integer sortDate){
        showLoading();
        compositeDisposable.add(repository.getApiService().getAllServicesIsPaged(sortDate)
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
                                services.setValue(response.getData().getContent());
                                totalElements.set(response.getData().getTotalElements().intValue());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            Timber.e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void deleteService(Long id, BaseCallBack callBack){
        showLoading();
        compositeDisposable.add(repository.getApiService().deleteService(id)
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
                                showSuccessMessage(application.getResources().getString(R.string.delete_service_success));
                                callBack.doSuccess();
                            }
                        }, throwable -> {
                            hideLoading();
                            callBack.doError(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void payService(Long id, String expirationDate, BaseCallBack callBack) {
        showLoading();
        compositeDisposable.add(repository.getApiService().payService(
                    new ServicePayRequest(id, expirationDate)
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
                            if (response.isResult()) {
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
                                serviceLiveData.setValue(response.getData());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            Timber.tag("ServiceGetDetail").e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    @Override
    protected void onCleared() {
        services.setValue(null);
        serviceLiveData.setValue(null);
        super.onCleared();
    }
}
