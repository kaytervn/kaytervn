package com.finance.ui.base;

import androidx.databinding.ObservableBoolean;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.finance.MVVMApplication;
import com.finance.data.Repository;
import com.finance.data.model.api.ResponseWrapper;
import com.finance.data.model.api.response.key.MyKeyResponse;
import com.finance.data.model.other.ToastMessage;
import com.finance.data.socket.dto.Message;

import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import lombok.Getter;
import lombok.Setter;

public class BaseViewModel extends ViewModel {
    public CompositeDisposable compositeDisposable;
    protected final ObservableBoolean mIsLoading = new ObservableBoolean();
    protected final MutableLiveData<ToastMessage> mErrorMessage = new MutableLiveData<>();
    public MutableLiveData<Boolean> validKey = new MutableLiveData<>(false);
    @Getter
    @Setter
    protected String token;

    protected final Repository repository;
    protected final MVVMApplication application;

    public BaseViewModel(Repository repository, MVVMApplication application){
        this.repository = repository;
        this.application = application;
        this.compositeDisposable = new CompositeDisposable();
    }
    @Override
    protected void onCleared() {
        compositeDisposable.dispose();
        super.onCleared();
    }

    public void showLoading(){
        mIsLoading.set(true);
    }

    public void hideLoading(){
        mIsLoading.set(false);
    }

    public void showSuccessMessage(String message){
        mErrorMessage.setValue(new ToastMessage(ToastMessage.TYPE_SUCCESS,message));
    }

    public void showErrorMessage(String message){
        mErrorMessage.setValue(new ToastMessage(ToastMessage.TYPE_ERROR,message));
    }

    public Observable<ResponseWrapper<MyKeyResponse>> getMyKey(){
        return repository.getApiService().getMyKey();
    }

    public void messageReceived(Message message){
    }
    public void sendMessage(Message message){
        application.sendMessage(message);
    }
}
