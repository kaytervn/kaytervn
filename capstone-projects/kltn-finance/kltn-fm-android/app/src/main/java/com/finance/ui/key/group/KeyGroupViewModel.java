package com.finance.ui.key.group;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.response.key.KeyGroupResponse;
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

public class KeyGroupViewModel extends BaseViewModel {

    //MutableLiveData for call back data
    public MutableLiveData<List<KeyGroupResponse>> keyGroups = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<KeyGroupResponse> keyGroupLiveData = new MutableLiveData<>(new KeyGroupResponse());

    public ObservableField<Integer> page = new ObservableField<>(0);
    public ObservableField<Integer> size = new ObservableField<>(20);
    public ObservableField<Integer> totalPage = new ObservableField<>();
    public ObservableField<Boolean> isCreate = new ObservableField<>(false);
    public ObservableField<Integer> totalElements = new ObservableField<>(0);
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);
    public KeyGroupViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getAllGroupKeys(int page, int size){
        showLoading();
        compositeDisposable.add(repository.getApiService().getGroupKeys(page, size, 1, "createdDate,desc")
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
                                keyGroups.setValue(response.getData().getContent());
                                totalElements.set(response.getData().getTotalElements().intValue());
                                totalPage.set(response.getData().getTotalPages());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
    public void getTransactionGroupDetail(Long id){
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
                            if (response.isResult()) {
                                keyGroupLiveData.setValue(response.getData());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
    public void deleteGroupTransaction(Long id, BaseCallBack callBack){
        showLoading();
        compositeDisposable.add(repository.getApiService().deleteGroupTransaction(id)
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
                                callBack.doSuccess();
                                showSuccessMessage(application.getString(R.string.delete_group_transaction_success));
                            }
                        }, throwable -> {
                            hideLoading();
                            callBack.doError(throwable);
                            Timber.tag("TransactionGroupDelete").e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
}
