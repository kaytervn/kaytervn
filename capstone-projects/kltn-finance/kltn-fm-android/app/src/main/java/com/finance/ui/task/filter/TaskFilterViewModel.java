package com.finance.ui.task.filter;


import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.data.model.api.response.project.ProjectResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.utils.NetworkUtils;

import java.util.ArrayList;
import java.util.List;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;
import timber.log.Timber;

public class TaskFilterViewModel extends BaseViewModel {
    private MutableLiveData<List<OrganizationResponse>> organizationResponses;
    private MutableLiveData<List<ProjectResponse>> projectResponses;
    public ObservableField<Integer> category = new ObservableField<>(0);
    public ObservableField<Long> organizationId = new ObservableField<>(0L);
    public ObservableField<Long> projectId = new ObservableField<>(0L);

    public TaskFilterViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public MutableLiveData<List<OrganizationResponse>> getOrganizationResponses() {
        if (organizationResponses == null) {
            organizationResponses = new MutableLiveData<>(new ArrayList<>());
        }
        return organizationResponses;
    }

    public MutableLiveData<List<ProjectResponse>> getProjectResponses() {
        if (projectResponses == null) {
            projectResponses = new MutableLiveData<>(new ArrayList<>());
        }
        return projectResponses;
    }

    public void getAllProjects() {
        compositeDisposable.add
                (repository.getApiService().getAllProject(0)
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
                            if (response.getData().getContent() != null){
                                projectResponses.setValue(response.getData().getContent());
                            } else {
                                projectResponses.setValue(new ArrayList<>());
                            }
                        }
                    }, throwable -> {
                        hideLoading();
                        Timber.e(throwable);
                        showErrorMessage(application.getResources().getString(R.string.no_internet));
                    }
                    )
                );
    }

    public void getAllOrganizations() {
        compositeDisposable.add
                (repository.getApiService().getAllOrganization(0, "createdDate,desc")
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
                                        if (response.getData().getContent() != null){
                                            organizationResponses.setValue(response.getData().getContent());
                                        } else {
                                            organizationResponses.setValue(new ArrayList<>());
                                        }
                                    }
                                }, throwable -> {
                                    hideLoading();
                                    Timber.e(throwable);
                                    showErrorMessage(application.getResources().getString(R.string.no_internet));
                                }
                        )
                );
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        projectResponses.setValue(null);
        organizationResponses.setValue(null);
    }
}
