package com.finance.ui.debit;


import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.request.debit.DebitApproveRequest;
import com.finance.data.model.api.response.debit.DebitResponse;
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

public class DebitViewModel extends BaseViewModel {
    //MutableLiveData for call api and update UI
    public MutableLiveData<List<DebitResponse>> debits = new MutableLiveData<>(new ArrayList<>());
    public ObservableField<String> monthYear = new ObservableField<>();
    public ObservableField<Double> totalDebit = new ObservableField<>(0.0);
    public ObservableField<Integer> totalElements = new ObservableField<>(0);

    public ObservableField<Integer> kind = new ObservableField<>(0);
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);
    public ObservableField<String> isSearchEmpty = new ObservableField<>("");

    public ObservableField<Boolean> isSearch = new ObservableField<>(false);

    public void isShowSearch() {
        isSearch.set(Boolean.FALSE.equals(isSearch.get()));
    }

    public DebitViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getMyDebits() {
        showLoading();
        compositeDisposable.add(repository.getApiService().getListDebits(0)
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
                                debits.setValue(response.getData().getContent());
                            }
                        }, throwable -> {
                            hideLoading();
                            Timber.tag("DebitViewModel").e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));

    }
    public void deleteDebitAt(Long id, BaseCallBack callBack) {
        compositeDisposable.add(repository.getApiService().deleteDebit(id)
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
                                showSuccessMessage(application.getString(R.string.delete_debit_success));
                                callBack.doSuccess();
                            }
                        }, throwable -> {
                            hideLoading();
                            callBack.doError(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
    public void approveDebitAt(Long id, BaseCallBack callBack) {
        compositeDisposable.add(repository.getApiService().approveDebit(
                        new DebitApproveRequest(id))
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
                                showSuccessMessage(application.getString(R.string.approve_debit_successfully));
                                callBack.doSuccess();
                            }
                        }, throwable -> {
                            hideLoading();
                            callBack.doError(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
}
