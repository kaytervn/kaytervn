package com.finance.ui.project.detail;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.request.project.ProjectCreateRequest;
import com.finance.data.model.api.request.project.ProjectUpdateRequest;
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.data.model.api.response.project.ProjectResponse;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.utils.NetworkUtils;

import java.util.ArrayList;
import java.util.List;
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

public class ProjectDetailViewModel extends BaseViewModel {

    //MutableLiveData for call data back

    public MutableLiveData<List<OrganizationResponse>> organizations = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<ProjectResponse> projectLiveData = new MutableLiveData<>(new ProjectResponse());
    public ObservableField<ProjectResponse> project = new ObservableField<>(new ProjectResponse());
    public MutableLiveData<List<TagResponse>> tags = new MutableLiveData<>(new ArrayList<>());
    public ObservableField<Integer> position = new ObservableField<>();
    public ObservableField<Boolean> isCreated = new ObservableField<>(false);
    public ObservableField<Boolean> isHaveOrganization = new ObservableField<>(false);
    public ObservableField<Boolean> isRightOrganization = new ObservableField<>(false);
    public ObservableField<Boolean> isHaveTag = new ObservableField<>(false);
    public ObservableField<Boolean> isRightTag = new ObservableField<>(false);
    public ProjectDetailViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getProjectDetails(Long id){
        showLoading();
        compositeDisposable.add(repository.getApiService().getProjectDetail(id)
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
                                projectLiveData.setValue(response.getData());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
    public void getAllOrganization(){
        compositeDisposable.add(repository.getApiService().getAllOrganization( 0, "createdDate,desc")
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
                                organizations.setValue(response.getData().getContent());
                                isHaveOrganization.set(true);
                            }else {
                                isHaveOrganization.set(false);
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void getListTags(){
        showLoading();
        compositeDisposable.add(repository.getApiService().getTags(4)
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
                            if (response.isResult() && response.getData().getContent() != null) {
                                isHaveTag.set(true);
                                tags.setValue(response.getData().getContent());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            Timber.tag("TransactionCreateTag").e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void createProject(){
        if (invalidData()) return;
        showLoading();
        compositeDisposable.add(
                repository.getApiService().createProject(
                        new ProjectCreateRequest(Objects.requireNonNull(project.get()))
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
                            if (response.isResult()) {
                                showSuccessMessage(application.getString(R.string.create_project_success));
                                application.getCurrentActivity().setResult(Activity.RESULT_OK);
                                application.getCurrentActivity().finish();
                            }else {
                                showErrorMessage(response.getMessage());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    private boolean invalidData() {
        if(Objects.requireNonNull(project.get()).getName() == null ||  Objects.requireNonNull(project.get()).getName().trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_project_name));
            return true;
        }
        if (Boolean.FALSE.equals(isRightOrganization.get())){
            showErrorMessage(application.getString(R.string.organization_do_not_exist));
            return true;
        }

        if (Boolean.FALSE.equals(isRightTag.get())){
            showErrorMessage(application.getString(R.string.tag_do_not_exist));
            return true;
        }

        Objects.requireNonNull(project.get()).setName(Objects.requireNonNull( Objects.requireNonNull(project.get()).getName()).trim());
        return false;
    }

    public void updateProject(){
        if (invalidData()) return;
        showLoading();
        compositeDisposable.add(repository.getApiService().updateProject(
                    new ProjectUpdateRequest(Objects.requireNonNull(project.get())))
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
                                showSuccessMessage(application.getString(R.string.update_project_success));
                                Intent resultIntent = new Intent();
                                Bundle bundle = new Bundle();
                                bundle.putSerializable(Constants.PROJECT_ID, Objects.requireNonNull(project.get()).getId());
                                bundle.putInt(Constants.POSITION, Objects.requireNonNull(position.get()));
                                resultIntent.putExtras(bundle);
                                application.getCurrentActivity().setResult(Constants.RESULT_UPDATE, resultIntent);
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
                                Objects.requireNonNull(project.get()).setLogo(response.getData().getFilePath());
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
