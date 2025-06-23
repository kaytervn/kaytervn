package com.finance.ui.fragment.home;


import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.request.transaction.TransactionApproveRequest;
import com.finance.data.model.api.request.transaction.TransactionRejectRequest;
import com.finance.data.model.api.response.transaction.TransactionResponse;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.base.BaseFragmentViewModel;
import com.finance.utils.NetworkUtils;

import java.util.ArrayList;
import java.util.List;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;
import timber.log.Timber;

public class HomeFragmentViewModel extends BaseFragmentViewModel {

    public MutableLiveData<List<TransactionResponse>> transactions = new MutableLiveData<>(new ArrayList<>());
    public ObservableField<Double> totalIncome = new ObservableField<>(0.0);

    public ObservableField<Double> totalExpenditure = new ObservableField<>(0.0);

    public ObservableField<Integer> totalElements = new ObservableField<>(0);
    public ObservableField<String> isSearchEmpty = new ObservableField<>("");

    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);
    public ObservableField<Integer> kind = new ObservableField<>(0);
    public ObservableField<Boolean> isSearch = new ObservableField<>(false);

    public void isShowSearch() {
        isSearch.set(Boolean.FALSE.equals(isSearch.get()));
    }

    public HomeFragmentViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);

    }


    public void getMyTransactions(Integer kindTransaction) {
        long startTime = System.currentTimeMillis();
        //2 of softDate mean new is the first item. newest to oldest
        //list of states: 1: created, 2: approved, 3: rejected, 4: paid
        showLoading();
        compositeDisposable.add(repository.getApiService().getListTransactions(kindTransaction)
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
                            if (response.getData().getContent() == null || response.getData().getContent().isEmpty()) {
                                totalElements.set(0);
                                transactions.setValue(new ArrayList<>());
                            } else {
                                totalElements.set(response.getData().getContent().size());
                                //callback data
                                transactions.setValue(response.getData().getContent());
                            }
                            // End time
                            long endTime = System.currentTimeMillis(); // Or System.nanoTime() for more precision
                            // Calculate the elapsed time
                            long elapsedTime = endTime - startTime;
                            Timber.tag("TimeListTransactionAPI").e("%sms", elapsedTime);
                        }
                        hideLoading();
                    }, throwable -> {
                        hideLoading();
                        showErrorMessage(application.getResources().getString(R.string.no_internet));
                    }
                ));
    }

    public void deleteTransaction(Long id, BaseCallBack callBack) {
        compositeDisposable.add(repository.getApiService().deleteTransaction(id)
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
                            showSuccessMessage(application.getString(R.string.delete_transaction_successfully));
                            callBack.doSuccess();
                        }
                    }, throwable -> {
                        hideLoading();
                        showErrorMessage(application.getResources().getString(R.string.no_internet));
                    }
                ));
    }

    public void rejectTransaction(TransactionRejectRequest request, BaseCallBack callBack) {
        compositeDisposable.add(repository.getApiService().rejectTransaction(request)
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
                                showSuccessMessage(application.getString(R.string.reject_transaction_successfully));
                                callBack.doSuccess();
                            }
                        }, throwable -> {
                            hideLoading();
                            callBack.doError(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void approveTransactionAt(Long id, BaseCallBack callBack) {
        compositeDisposable.add(repository.getApiService().approveTransaction(
                        new TransactionApproveRequest(id))
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
                                showSuccessMessage(application.getString(R.string.approve_transaction_successfully));
                                callBack.doSuccess();
                            }
                        }, throwable -> {
                            hideLoading();
                            callBack.doError(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    @Override
    protected void onCleared() {
        super.onCleared();

    }
}
