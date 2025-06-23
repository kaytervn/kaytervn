package com.finance.ui.key.filter;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.response.key.KeyGroupResponse;
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.data.model.api.response.tag.TagResponse;
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

public class KeyFilterViewModel extends BaseViewModel {
    public MutableLiveData<List<KeyGroupResponse>> keyGroupResponses = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<List<TagResponse>> tagResponses = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<List<OrganizationResponse>> organizationResponses = new MutableLiveData<>(new ArrayList<>());
    public ObservableField<Integer> category = new ObservableField<>(0);
    public ObservableField<Long> keyGroupId = new ObservableField<>(0L);
    public ObservableField<Long> organizationId = new ObservableField<>(0L);
    public ObservableField<Long> tagId = new ObservableField<>(0L);
    public ObservableField<Integer> kind = new ObservableField<>(0);
    public KeyFilterViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getAllKeyGroups() {
        compositeDisposable.add
                (repository.getApiService().getKeyGroupList(0)
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
                                keyGroupResponses.setValue(response.getData().getContent());
                            } else {
                                keyGroupResponses.setValue(new ArrayList<>());
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

    public void getAllTags() {
        compositeDisposable.add
                (repository.getApiService().getTags(3)
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
                                            tagResponses.setValue(response.getData().getContent());
                                        } else {
                                            tagResponses.setValue(new ArrayList<>());
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
}
