package com.finance.ui.organization.detail;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.request.organization.OrganizationCreateRequest;
import com.finance.data.model.api.request.organization.OrganizationUpdateRequest;
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.ui.organization.OrganizationActivity;
import com.finance.utils.NetworkUtils;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import timber.log.Timber;

public class OrganizationDetailViewModel extends BaseViewModel {
    public MutableLiveData<OrganizationResponse> organization = new MutableLiveData<>();
    public ObservableField<String> name = new ObservableField<>();
    public ObservableField<String> logo = new ObservableField<>();
    public ObservableField<Long> id = new ObservableField<>();
    public ObservableField<Integer> position = new ObservableField<>();
    public ObservableField<Boolean> isCreate = new ObservableField<>(false);

    public OrganizationDetailViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }
    public void getOrganizationDetails(Long id){
        showLoading();
        compositeDisposable.add(repository.getApiService().getOrganizationDetail(id)
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
                                organization.setValue(response.getData());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void createOrganization(){
        if(name.get()== null ||  Objects.requireNonNull(name.get()).trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_organization_name));
            return;
        }
        name.set(Objects.requireNonNull(name.get()).trim());
        showLoading();
        compositeDisposable.add(
                repository.getApiService().createOrganization(
                        new OrganizationCreateRequest(
                                name.get(),
                                logo.get()
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
                                showSuccessMessage(application.getString(R.string.create_organization_success));
                                Intent intent = new Intent(application.getCurrentActivity(), OrganizationActivity.class);
                                application.getCurrentActivity().startActivity(intent);
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

    public void updateOrganization(){
        if(name.get()== null
                || Objects.requireNonNull(name.get()).isEmpty()
                || Objects.requireNonNull(name.get()).trim().isEmpty()){
            showErrorMessage(application.getResources().getString(R.string.invalid_organization_name));
            return;
        }
        name.set(Objects.requireNonNull(name.get()).trim());
        showLoading();
        Timber.tag("OrganizationDetailLogo").e(logo.get());
        compositeDisposable.add(repository.getApiService().updateOrganization(
                        new OrganizationUpdateRequest(
                                id.get(),
                                name.get(),
                                logo.get()
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
                                showSuccessMessage(application.getString(R.string.update_organization_success));
                                Intent resultIntent = new Intent();
                                Bundle bundle = new Bundle();
                                bundle.putSerializable(Constants.ORGANIZATION_ID, id.get());
                                bundle.putInt(Constants.POSITION, Objects.requireNonNull(position.get()));
                                resultIntent.putExtras(bundle);
                                application.getCurrentActivity().setResult(
                                        Activity.RESULT_OK, resultIntent);
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

    public void uploadLogo(MultipartBody.Part imagePart){
        RequestBody type = RequestBody.create( "LOGO", MediaType.parse("multipart/form-data"));
        compositeDisposable.add(repository.getApiMediaService().uploadFile(type, imagePart)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                return application.showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            if(response.isResult()){
                                logo.set(response.getData().getFilePath());
                            }else{
                                showErrorMessage(response.getMessage());
                            }
                            hideLoading();
                        },
                        throwable -> {
                            hideLoading();
                            showErrorMessage(throwable.getMessage());
                        }
                )
        );
    }
}
