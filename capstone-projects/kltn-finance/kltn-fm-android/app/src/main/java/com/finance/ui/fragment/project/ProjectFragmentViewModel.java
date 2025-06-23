package com.finance.ui.fragment.project;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.response.project.ProjectResponse;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.base.BaseFragmentViewModel;
import com.finance.utils.NetworkUtils;

import java.util.List;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class ProjectFragmentViewModel extends BaseFragmentViewModel {
    //MutableLiveData for call data back
    public MutableLiveData<List<ProjectResponse>> projects = new MutableLiveData<>();
    public MutableLiveData<ProjectResponse> projectLiveData = new MutableLiveData<>();

    public ObservableField<Integer> totalPage = new ObservableField<>();
    public ObservableField<Boolean> isCreate = new ObservableField<>(false);
    public ObservableField<Integer> totalElements = new ObservableField<>(0);
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);

    public ObservableField<String> isSearchEmpty = new ObservableField<>("");
    public ObservableField<Boolean> isShowFilter = new ObservableField<>(false);
    public ObservableField<Long> organizationId = new ObservableField<>();
    public ObservableField<Boolean> isSearch = new ObservableField<>(false);
    public ObservableField<String> textName = new ObservableField<>();

    public void isShowSearch() {
        isSearch.set(Boolean.FALSE.equals(isSearch.get()));
    }

    public ProjectFragmentViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getAllProject(){
        showLoading();
        compositeDisposable.add(repository.getApiService().getAllProject()
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
                                projects.setValue(response.getData().getContent());
                                totalElements.set(response.getData().getTotalElements().intValue());
                                totalPage.set(response.getData().getTotalPages());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
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
                            if (response.isResult()) {
                                projectLiveData.setValue(response.getData());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
    public void deleteProject(Long id, BaseCallBack callBack){
        showLoading();
        compositeDisposable.add(repository.getApiService().deleteProject(id)
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
                                showSuccessMessage(application.getString(R.string.delete_project_success));
                                callBack.doSuccess();
                            }
                        }, throwable -> {
                            hideLoading();
                            callBack.doError(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
}
