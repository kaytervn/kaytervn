package com.finance.ui.transaction.group.detail;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.request.transaction.group.GroupTransactionCreateRequest;
import com.finance.data.model.api.request.transaction.group.GroupTransactionUpdateRequest;
import com.finance.data.model.api.response.transaction.group.TransactionGroupResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.ui.transaction.group.TransactionGroupActivity;
import com.finance.utils.NetworkUtils;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class TransactionGroupDetailViewModel extends BaseViewModel {
    public MutableLiveData<TransactionGroupResponse> groupTransactionResponse = new MutableLiveData<>();
    public ObservableField<String> name = new ObservableField<>();
    public ObservableField<String> description = new ObservableField<>();
    public ObservableField<Long> id = new ObservableField<>();
    public ObservableField<Integer> position = new ObservableField<>();
    public ObservableField<Boolean> isCreate = new ObservableField<>(false);
    public TransactionGroupDetailViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }
    public void getTransactionGroupDetail(Long id){
        showLoading();
        compositeDisposable.add(repository.getApiService().getGroupTransactionDetail(id)
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
                                groupTransactionResponse.setValue(response.getData());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void createOrUpdateTransactionGroup(){
        if(name.get()== null ||  Objects.requireNonNull(name.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_group_transaction_name));
            return;
        }
        if(description.get()== null || Objects.requireNonNull(description.get()).isEmpty()
                ||  Objects.requireNonNull(description.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_description_group_transaction));
            return;
        }
        name.set(Objects.requireNonNull(name.get()).trim());
        description.set(Objects.requireNonNull(description.get()).trim());
        showLoading();
        if (Boolean.TRUE.equals(isCreate.get())) {
            compositeDisposable.add(repository.getApiService().createGroupTransaction(
                            new GroupTransactionCreateRequest(
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
                                } else {
                                    return Observable.error(throwable1);
                                }
                            })
                    )
                    .subscribe(
                            response -> {
                                hideLoading();
                                if (response.isResult()) {
                                    showSuccessMessage(application.getString(R.string.create_group_transaction_success));
                                    Intent intent = new Intent(application, TransactionGroupActivity.class);
                                    application.getCurrentActivity().startActivity(intent);
                                    application.getCurrentActivity().finish();
                                } else {
                                    showErrorMessage(response.getMessage());
                                }
                            }, throwable -> {
                                hideLoading();
                                showErrorMessage(application.getResources().getString(R.string.no_internet));
                            }
                    ));
        }
        else {
            compositeDisposable.add(repository.getApiService().updateGroupTransaction(
                            new GroupTransactionUpdateRequest(
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
                                    showSuccessMessage(application.getString(R.string.update_group_transaction_success));
                                    Intent resultIntent = new Intent();
                                    Bundle bundle = new Bundle();
                                    bundle.putSerializable(Constants.GROUP_TRANSACTION_ID, id.get());
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


}
