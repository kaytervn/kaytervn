package com.finance.ui.category.details;

import android.app.Activity;
import android.content.Intent;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.request.category.CategoryCreateRequest;
import com.finance.data.model.api.request.category.CategoryUpdateRequest;
import com.finance.data.model.api.response.category.CateResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.utils.NetworkUtils;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.schedulers.Schedulers;
import timber.log.Timber;

public class CategoryDetailsViewModel extends BaseViewModel {

    public MutableLiveData<CateResponse> cateResponse = new MutableLiveData<>();
    public ObservableField<String> name = new ObservableField<>();
    public ObservableField<String> description = new ObservableField<>();

    public ObservableField<Long> id = new ObservableField<>();
    public ObservableField<Integer> kind = new ObservableField<>();
    public ObservableField<Boolean> isCreate = new ObservableField<>(false);
    public CategoryDetailsViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }
    public void getCategoryDetails(Long id){
        showLoading();
        compositeDisposable.add(repository.getApiService().getCategoryDetails(id)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap(throwableFlatMap -> {
                            if (NetworkUtils.checkNetworkError(throwableFlatMap)) {
                                hideLoading();
                                return application.showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwableFlatMap);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            hideLoading();
                            if (response.isResult()) {
                                cateResponse.setValue(response.getData());
                            }
                        }, throwable -> {
                            Timber.d(throwable);
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void createCategory(){
        if(name.get()== null || Objects.requireNonNull(name.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_category_name));
            return;
        }
        if(description.get()== null || Objects.requireNonNull(description.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_key_group_description));
            return;
        }
        showLoading();
        compositeDisposable.add(repository.getApiService().createCategory(
                new CategoryCreateRequest(
                        Objects.requireNonNull(description.get()).trim(),
                        Objects.requireNonNull(name.get()).trim(),
                        kind.get()))
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap( throwable1 -> {
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
                                showSuccessMessage(application.getString(R.string.add_new_category_success));
                                Intent intent = new Intent();
                                intent.putExtra(Constants .KIND,kind.get());
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, intent);
                                application.getCurrentActivity().finish();
                            }else {
                                if(response.getCode().equals(Constants.ERROR_CATEGORY_NAME_EXISTED)){
                                    showErrorMessage(application.getString(R.string.category_name_existed));
                                }else {
                                    showErrorMessage(response.getMessage());
                                }
                            }
                        }, throwable -> {
                            Timber.d(throwable);
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }


    public void updateCategory(){
        if(name.get()== null || Objects.requireNonNull(name.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_category_name));
            return;
        }
        if(description.get()== null || Objects.requireNonNull(description.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_key_group_description));
            return;
        }
        showLoading();
        compositeDisposable.add(repository.getApiService().updateCategory(
                new CategoryUpdateRequest(
                        Objects.requireNonNull(name.get()).trim(),
                        Objects.requireNonNull(description.get()).trim(),
                        id.get()))
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap( throwable1 -> {
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
                                Objects.requireNonNull(cateResponse.getValue()).setName(name.get());
                                cateResponse.getValue().setDescription(description.get());
                                Intent intent = new Intent();
                                intent.putExtra(Constants.CATEGORY, ApiModelUtils.GSON.toJson(cateResponse.getValue(),CateResponse.class));
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, intent);
                                application.getCurrentActivity().finish();
                                showSuccessMessage(application.getString(R.string.update_category_success));
                            }else {
                                if(response.getCode().equals(Constants.ERROR_CATEGORY_NAME_EXISTED)){
                                    showErrorMessage(application.getString(R.string.category_name_existed));
                                }else {
                                    showErrorMessage(response.getMessage());
                                }
                            }
                        }, throwable -> {
                            Timber.d(throwable);
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void doDone(){
        if(Boolean.TRUE.equals(isCreate.get())){
            createCategory();
        }else {
            updateCategory();
        }
    }



}
