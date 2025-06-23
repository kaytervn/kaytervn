package com.finance.ui.nofication;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.ResponseStatus;
import com.finance.data.model.api.response.notification.NotificationId;
import com.finance.data.model.api.response.notification.NotificationResponse;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.base.BaseViewModel;
import com.finance.utils.NetworkUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class NotificationViewModel extends BaseViewModel {

    public ObservableField<Integer> pageNumber = new ObservableField<>(0);
    public ObservableField<Integer> pageSize = new ObservableField<>(20);
    public ObservableField<Integer> totalElement = new ObservableField<>();
    public ObservableField<Integer> position = new ObservableField<>();
    public ObservableField<Boolean> isShowFilter = new ObservableField<>(false);
    public MutableLiveData<List<NotificationResponse>> notificationList = new MutableLiveData<>();
    public NotificationViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }
    public void showFilter(){
        isShowFilter.set(Boolean.FALSE.equals(isShowFilter.get()));
    }
    public Observable<ResponseStatus> deleteNotification(Long id){
        return repository.getApiService().deleteNotification(id);
    }

    public void getMyNotification(){
        if(Objects.requireNonNull(pageNumber.get()) == 0){
            showLoading();
        }
        compositeDisposable.add(repository.getApiService().getMyNotification(pageNumber.get(),pageSize.get())
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
                                totalElement.set(response.getData().getTotalElements().intValue());
                                if(response.getData().getContent()!=null){
                                    notificationList.setValue(response.getData().getContent());
                                }
                            }else {
                                showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void readAllNotifications(){
        showLoading();
        compositeDisposable.add(repository.getApiService().readAllNotification()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                hideLoading();
                                return (application.showDialogNoInternetAccess());
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            hideLoading();
                            if (response.isResult()) {
                                showSuccessMessage(response.getMessage());
                                getMyNotification();
                            }else {
                                showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void deleteAllNotifications(){
        showLoading();
        compositeDisposable.add(repository.getApiService().deleteAllNotification()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                hideLoading();
                                return (application.showDialogNoInternetAccess());
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            hideLoading();
                            if (response.isResult()) {
                                pageNumber.set(0);
                                notificationList.setValue(new ArrayList<>());
                                totalElement.set(0);
                                showSuccessMessage(response.getMessage());
                            }else {
                                showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void readNotification(Long id, BaseCallBack callBack){
        compositeDisposable.add(repository.getApiService().readNotification(new NotificationId(id))
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                hideLoading();
                                return (application.showDialogNoInternetAccess());
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            hideLoading();
                            if (response.isResult()) {
                                callBack.doSuccess();
                            }
                        }, throwable -> {
                            callBack.doError(throwable);
                            hideLoading();
                        }
                ));
    }
    public void closeFilter(){
        if(Boolean.TRUE.equals(isShowFilter.get())){
            isShowFilter.set(false);
        }
    }
}
