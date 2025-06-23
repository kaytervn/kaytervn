package com.finance.ui.base;

import android.app.Dialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.InputMethodManager;

import androidx.annotation.LayoutRes;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;
import androidx.databinding.Observable;
import androidx.databinding.ObservableBoolean;
import androidx.databinding.ViewDataBinding;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.finance.BR;
import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.data.model.api.response.account.Permission;
import com.finance.data.socket.KittyRealtimeEvent;
import com.finance.data.socket.dto.Message;
import com.finance.di.component.ActivityComponent;
import com.finance.di.component.DaggerActivityComponent;
import com.finance.di.module.ActivityModule;
import com.finance.ui.dialog.InputKeyDialog;
import com.finance.utils.AESUtils;
import com.finance.utils.AppUtils;
import com.finance.utils.DialogUtils;
import com.finance.utils.RSAUtils;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;
import timber.log.Timber;

public abstract class BaseActivity<B extends ViewDataBinding, V extends BaseViewModel>
        extends AppCompatActivity implements KittyRealtimeEvent {
    protected B viewBinding;
    @Inject
    protected V viewModel;
    @Inject
    protected Context application;

    @Named("access_token")
    @Inject
    protected String token;
    private Dialog progressDialog;
    private BroadcastReceiver globalApplicationReceiver;
    private final IntentFilter filterGlobalApplication = new IntentFilter();
    InputKeyDialog inputKeyDialog = new InputKeyDialog();

    public abstract @LayoutRes int getLayoutId();

    public abstract int getBindingVariable();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        performDependencyInjection(getBuildComponent());
        super.onCreate(savedInstanceState);
        performDataBinding();
        updateCurrentActivity();

        viewModel.mIsLoading.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback(){
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                if(((ObservableBoolean)sender).get()){
                    showProgressbar(getResources().getString(R.string.msg_loading));
                }else{
                    hideProgress();
                }
            }
        });
        viewModel.mErrorMessage.observe(this, toastMessage -> {
            if(toastMessage!=null){
                toastMessage.showMessage(getApplicationContext());
            }
        });


        filterGlobalApplication.addAction(Constants.ACTION_EXPIRED_TOKEN);
        globalApplicationReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                if (action==null){
                    return;
                }
                if (action.equals(Constants.ACTION_EXPIRED_TOKEN)){
                    doExpireSession();
                }
            }
        };

        if(checkSecretKeyValid()){
            viewModel.validKey.setValue(true);
        }else {
            viewModel.validKey.setValue(false);
        }
        SecretKey.getInstance().setSecretKeyListener(secretKeyListener);
    }
    public void hideKeyboard() {
        View view = this.getCurrentFocus();
        if (view != null) {
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            if (imm != null) {
                imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
            }
        }
    }
    public void showKeyboard() {
        View view = this.getCurrentFocus();
        if (view != null) {
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            if (imm != null) {
                view.requestFocus();
                imm.showSoftInput(view, InputMethodManager.SHOW_IMPLICIT);
            }
        }
    }

    public void showProgressbar(String msg){
        if (progressDialog != null) {
            progressDialog.dismiss();
            progressDialog = null;
        }
        progressDialog = DialogUtils.createDialogLoading2(this, msg);
        assert progressDialog != null;
        progressDialog.show();
    }

    public void hideProgress() {
        if (progressDialog != null) {
            progressDialog.dismiss();
            progressDialog = null;
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        updateCurrentActivity();
    }

    @Override
    protected void onPause() {
        super.onPause();
        LocalBroadcastManager.getInstance(this).unregisterReceiver(globalApplicationReceiver);
    }



    private void performDataBinding() {
        viewBinding = DataBindingUtil.setContentView(this, getLayoutId());
        viewBinding.setVariable(getBindingVariable(), viewModel);
        viewBinding.setVariable(BR.a, this);
        viewBinding.executePendingBindings();
    }


    public abstract void performDependencyInjection(ActivityComponent buildComponent);

    private void updateCurrentActivity(){
        MVVMApplication mvvmApplication = (MVVMApplication)application;
        mvvmApplication.setCurrentActivity(this);
    }
    private ActivityComponent getBuildComponent() {
        return DaggerActivityComponent.builder()
                .appComponent(((MVVMApplication)getApplication()).getAppComponent())
                .activityModule(new ActivityModule(this))
                .build();
    }
    public void doExpireSession() {
        //implement later

    }

    //check permission
    public Boolean checkPermission(String code){
        return Permission.checkPermission(code,MVVMApplication.getPermissions());
    }

    public List<String> getPermissions(){
        return MVVMApplication.getPermissions();
    }

    public AccountResponse getAccount(){
        return viewModel.repository.getAccount();
    }

    public void showInputKey(){
        inputKeyDialog = new InputKeyDialog();
        inputKeyDialog.setListener(this.inputKeyListener);
        inputKeyDialog.show(getSupportFragmentManager(), Constants.INPUT_KEY_DIALOG);
    }

    public Boolean checkSecretKeyValid(){
        return SecretKey.getInstance().getKey() != null;
    }

    public void saveSecretKey(String privateKey, String secretKey){
        try {
            Timber.d(privateKey);
            String secretKeyS = RSAUtils.decrypt(RSAUtils.getPrivateKey(privateKey), secretKey);
            SecretKey.getInstance().setKey(secretKeyS);
            inputKeyDialog.dismiss();
        }catch (Throwable e){
            viewModel.showErrorMessage(getString(R.string.private_key_is_not_exactly));
            Timber.d(e);
        }
    }
    public String decrypt(String textEncrypt){
        if(textEncrypt == null){
            return "";
        }
        String secretKey = SecretKey.getInstance().getKey();
        if(secretKey!= null){
            return AESUtils.decrypt(secretKey,textEncrypt,false);
        }else {
//            openInputKey();
            return textEncrypt;
        }
    }

    public String encrypt(String text) {
        if(text == null){
            return "";
        }
        String secretKey = SecretKey.getInstance().getKey();
        if(secretKey!= null){
            return AESUtils.encrypt(secretKey,text,false);
        }else {
            return text;
        }
    }

    public void getMKey(String privateKey){
        viewModel.showLoading();
        viewModel.compositeDisposable.add(viewModel.getMyKey()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    if(response.isResult()) {
                        try {
                            saveSecretKey(AppUtils.extractKey(privateKey),response.getData().getSecretKey());
                        }catch (Throwable throwable){
                            viewModel.showErrorMessage(getString(R.string.private_key_is_not_exactly));
                        }
                    }
                    viewModel.hideLoading();
                },error->{
                    if (error instanceof retrofit2.HttpException) {
                        retrofit2.HttpException httpError = (retrofit2.HttpException) error;
                        if (httpError.code() == 401) {
                            viewModel.showErrorMessage(getString(R.string.system_not_ready));
                        }
                    } else {
                        viewModel.showErrorMessage(getString(R.string.newtwork_error));
                    }
                    Timber.d(error);
                    viewModel.hideLoading();
                })
        );
    }

    private final SecretKey.SecretKeyListener secretKeyListener = new SecretKey.SecretKeyListener() {
        @Override
        public void validKey() {
            Timber.d("check key");
            viewModel.validKey.setValue(true);
        }
        @Override
        public void invalidKey() {
            viewModel.validKey.postValue(false);
        }
    };

    private final InputKeyDialog.InputKeyListener inputKeyListener = new InputKeyDialog.InputKeyListener() {
        @Override
        public void confirm(String privateKey, String secretKey) {
            getMKey(privateKey);
        }
        @Override
        public void cancel() {

        }
    };

    @Override
    public void onConnectionClosed() {

    }

    @Override
    public void onConnectionClosing() {

    }

    @Override
    public void onMessageReceived(Message message) {
        viewModel.messageReceived(message);
    }

    @Override
    public void onConnectionFailed() {

    }

    @Override
    public void onConnectionOpened() {

    }


}
