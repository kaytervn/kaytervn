package com.finance.ui.department.details;

import android.app.Activity;
import android.content.Intent;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.request.department.DepartmentCreateRequest;
import com.finance.data.model.api.request.department.DepartmentUpdateRequest;
import com.finance.data.model.api.response.department.DepartmentResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.utils.NetworkUtils;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class  DepartmentDetailsViewModel extends BaseViewModel {

    public MutableLiveData<DepartmentResponse> departmentResponse = new MutableLiveData<>();
    public ObservableField<String> name = new ObservableField<>();
    public ObservableField<Long> id = new ObservableField<>();
    public ObservableField<Integer> status = new ObservableField<>(1);
    public ObservableField<Boolean> isCreate = new ObservableField<>(false);
    public ObservableField<String> description = new ObservableField<>();
    public DepartmentDetailsViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }


    public void getDepartmentDetails(Long id){
        showLoading();
        compositeDisposable.add(repository.getApiService().getDepartmentDetails(id)
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
                                departmentResponse.setValue(response.getData());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void createDepartment(){
        if(name.get()== null || Objects.requireNonNull(name.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_department_name));
            return;
        }
        if(description.get()== null || Objects.requireNonNull(description.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_key_group_description));
            return;
        }
        showLoading();
        compositeDisposable.add(repository.getApiService().createDepartment(new DepartmentCreateRequest(Objects.requireNonNull(name.get()).trim(),status.get(), Objects.requireNonNull(description.get()).trim()))
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
                                showSuccessMessage(application.getString(R.string.add_new_department_success));
                                Intent intent = new Intent();
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, intent);
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

    public void updateDepartment(){
        if(name.get()== null || Objects.requireNonNull(name.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_department_name));
            return;
        }
        if(description.get()== null || Objects.requireNonNull(description.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_key_group_description));
            return;
        }
        showLoading();
        compositeDisposable.add(repository.getApiService().updateDepartment(new DepartmentUpdateRequest(Objects.requireNonNull(name.get()).trim(), status.get(), id.get(), Objects.requireNonNull(description.get()).trim()))
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
                                Objects.requireNonNull(departmentResponse.getValue()).setName(Objects.requireNonNull(name.get()).trim());
                                Intent intent = new Intent();
                                intent.putExtra(Constants.DEPARTMENT, ApiModelUtils.GSON.toJson(departmentResponse.getValue(), DepartmentResponse.class));
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, intent);
                                application.getCurrentActivity().finish();
                                showSuccessMessage(application.getString(R.string.update_department_success));
                            }else {
                                showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void doDone(){
        if(Boolean.TRUE.equals(isCreate.get())){
            createDepartment();
        }else {
            updateDepartment();
        }
    }
}
