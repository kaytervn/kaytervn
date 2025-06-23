package com.finance.ui.fragment.statistics.detail;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.request.transaction.TransactionRemoveRequest;
import com.finance.data.model.api.response.transaction.TransactionResponse;
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

public class StatisticsDetailViewModel extends BaseViewModel {
    //MutableLiveData
    public MutableLiveData<List<TransactionResponse>> transactions = new MutableLiveData<>(new ArrayList<>());
    public ObservableField<String> monthYear = new ObservableField<>();
    public ObservableField<Double> totalIncome = new ObservableField<>(0.0);
    public ObservableField<Double> totalExpenditure = new ObservableField<>(0.0);
    public ObservableField<Integer> kind = new ObservableField<>(0);
    public ObservableField<Integer> totalElements = new ObservableField<>(0);

    public StatisticsDetailViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getMyTransactions(Long paymentPeriodId, Integer kind) {
        showLoading();
        compositeDisposable.add(repository.getApiService().getListTransactionsByPaymentPeriodId(paymentPeriodId, kind, 1, 0, 0)
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
                            if (response.isResult() && response.getData().getContent() != null){
                                transactions.setValue(response.getData().getContent());
                            } else {
                                transactions.setValue(new ArrayList<>());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));

    }
    public void deleteTransaction(Long id, BaseCallBack callBack) {
        showLoading();
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
                            if (response.isResult()) {
                                showSuccessMessage(application.getString(R.string.delete_transaction_success));
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
    public void removeFromPeriod(TransactionRemoveRequest request, BaseCallBack callBack) {
        showLoading();
        compositeDisposable.add(repository.getApiService().removeTransaction(request)
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
                                showSuccessMessage(application.getString(R.string.remove_transaction_success));
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
