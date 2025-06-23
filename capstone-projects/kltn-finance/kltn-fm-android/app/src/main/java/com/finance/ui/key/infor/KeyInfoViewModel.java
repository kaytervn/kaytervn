package com.finance.ui.key.infor;

import androidx.databinding.ObservableField;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.response.key.GoogleKey;
import com.finance.data.model.api.response.key.KeyResponse;
import com.finance.data.model.api.response.key.ServerKey;
import com.finance.ui.base.BaseViewModel;
import com.finance.utils.NetworkUtils;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class KeyInfoViewModel extends BaseViewModel {

    public ObservableField<KeyResponse> keyResponse = new ObservableField<>(new KeyResponse());
    public ObservableField<Boolean> isShowPassword = new ObservableField<>(false);
    public ObservableField<GoogleKey> ggKey = new ObservableField<>(new GoogleKey());
    public ObservableField<ServerKey> serverKey = new ObservableField<>(new ServerKey());
    public ObservableField<Integer> kind = new ObservableField<>(1);
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);
    public ObservableField<Integer> totalDocuments = new ObservableField<>(0);
    public ObservableField<Boolean> isUpdate = new ObservableField<>(false);
    public ObservableField<Boolean> isHaveDocument = new ObservableField<>(false);
    public KeyInfoViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }
    public void showPassword(){
        isShowPassword.set(Boolean.FALSE.equals(isShowPassword.get()));
    }

    public void getKeyDetails(Long id){
        if(Boolean.FALSE.equals(isUpdate.get())){
            showLoading();
        }
        compositeDisposable.add(repository.getApiService().getKeyDetails(id)
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
                                keyResponse.set(response.getData());
                                isUpdate.set(true);
                                kind.set(response.getData().getKind());
                                if (Objects.requireNonNull(keyResponse.get()).getDocument() != null
                                        && !Objects.requireNonNull(keyResponse.get()).getDocument().isEmpty()) {
                                    isHaveDocument.set(true);
                                } else {
                                    isHaveDocument.set(false);
                                }
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }


}
