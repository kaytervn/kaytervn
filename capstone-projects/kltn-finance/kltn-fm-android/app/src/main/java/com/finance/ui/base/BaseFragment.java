package com.finance.ui.base;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.DataBindingUtil;
import androidx.databinding.Observable;
import androidx.databinding.ObservableBoolean;
import androidx.databinding.ViewDataBinding;
import androidx.fragment.app.Fragment;
import com.finance.BR;
import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.account.Permission;
import com.finance.di.component.DaggerFragmentComponent;
import com.finance.di.component.FragmentComponent;
import com.finance.di.module.FragmentModule;
import com.finance.ui.main.MainActivity;
import com.finance.utils.AESUtils;
import com.finance.utils.DialogUtils;
import java.util.List;
import javax.inject.Inject;
import javax.inject.Named;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import timber.log.Timber;

public abstract class BaseFragment<B extends ViewDataBinding, V extends BaseFragmentViewModel> extends Fragment {
    protected CompositeDisposable compositeDisposable;
    protected B binding;
    @Inject
    protected V viewModel;
    @Named("access_token")
    @Inject
    protected String token;
    private Dialog progressDialog;


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        performDependencyInjection(getBuildComponent());
        compositeDisposable = viewModel.compositeDisposable;
        binding = DataBindingUtil.inflate(inflater, getLayoutId(), container, false);
        binding.setVariable(getBindingVariable(), viewModel);
        binding.setVariable(BR.a, this);
        binding.executePendingBindings();
        performDataBinding();
        viewModel.setToken(token);
        viewModel.mIsLoading.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback(){
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                if (isAdded()){
                    if(((ObservableBoolean)sender).get()){
                        showProgressbar(getResources().getString(R.string.msg_loading));
                    }else{
                        hideProgress();
                    }
                }

            }
        });
        viewModel.mErrorMessage.observe(requireActivity(), toastMessage -> {
            if(toastMessage!=null){
                toastMessage.showMessage(requireContext().getApplicationContext());
            }
        });

        if(checkSecretKeyValid()){
            viewModel.validKey.setValue(true);
        }else {
            viewModel.validKey.setValue(false);
        }
        SecretKey.getInstance().setSecretKeyListener(secretKeyListener);
        return binding.getRoot();
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    public abstract int getBindingVariable();

    protected abstract int getLayoutId();

    protected abstract void performDataBinding();

    protected abstract void performDependencyInjection(FragmentComponent buildComponent);

    private FragmentComponent getBuildComponent() {
        return DaggerFragmentComponent.builder()
                .appComponent(((MVVMApplication) requireActivity().getApplication()).getAppComponent())
                .fragmentModule(new FragmentModule(this))
                .build();
    }



    public void hideProgress() {
        if (progressDialog != null) {
            progressDialog.dismiss();
            progressDialog = null;
        }
    }
    public void hideKeyboard() {
        View view = requireActivity().getCurrentFocus();
        if (view != null) {
            InputMethodManager imm = (InputMethodManager) this.requireActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            if (imm != null) {
                imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
            }
        }
    }

    public void showKeyboard() {
        View view = this.requireActivity().getCurrentFocus();
        if (view != null) {
            InputMethodManager imm = (InputMethodManager) this.requireActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            if (imm != null) {
                view.requestFocus();
                imm.showSoftInput(view, InputMethodManager.SHOW_IMPLICIT);
            }
        }
    }

    public void showProgressbar(String msg) {
        if (progressDialog != null) {
            progressDialog.dismiss();
            progressDialog = null;
        }
        progressDialog = DialogUtils.createDialogLoading2(requireContext(), msg);
        assert progressDialog != null;
        progressDialog.show();
    }

    public Boolean checkPermission(String code){
        return Permission.checkPermission(code, MVVMApplication.getPermissions());
    }
    public List<String> getPermissions(){
        return MVVMApplication.getPermissions();
    }

    public Boolean checkSecretKeyValid(){
        return SecretKey.getInstance().getKey() != null;
    }

    public String decrypt(String textEncrypt){
        if(textEncrypt == null){
            return "";
        }
        String secretKey = SecretKey.getInstance().getKey();
        if(secretKey!= null){
            return AESUtils.decrypt(secretKey,textEncrypt,false);
        }else {
            return textEncrypt;
        }
    }

    private final SecretKey.SecretKeyListener secretKeyListener = new SecretKey.SecretKeyListener() {
        @Override
        public void validKey() {
            Timber.d("valid key");
            viewModel.validKey.setValue(true);
        }
        @Override
        public void invalidKey() {
            Timber.d("invalid key");
            viewModel.validKey.postValue(false);
            ((MainActivity) requireActivity()).showInputKey();
        }
    };

    public void setSecretKeyListener(){
        SecretKey.getInstance().setSecretKeyListener(secretKeyListener);
    }

}