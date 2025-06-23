package com.finance.ui.fragment.task;



import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;

import com.finance.data.model.api.request.task.TaskChangeStateRequest;
import com.finance.data.model.api.response.task.TaskResponse;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.base.BaseFragmentViewModel;
import com.finance.utils.NetworkUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;


public class TaskFragmentViewModel extends BaseFragmentViewModel {

    //MutableLiveData for call api
    public MutableLiveData<List<TaskResponse>> tasks = new MutableLiveData<>(new ArrayList<>());

    public ObservableField<Integer> totalElements = new ObservableField<>(0);
    public ObservableField<String> isSearchEmpty = new ObservableField<>("");
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);
    public ObservableField<Boolean> isShowFilter = new ObservableField<>(false);
    public ObservableField<Long> projectId = new ObservableField<>();
    public ObservableField<Long> organizationId = new ObservableField<>();
    public ObservableField<Boolean> isSearch = new ObservableField<>(false);
    public ObservableField<String> textName = new ObservableField<>();

    public void isShowSearch() {
        isSearch.set(Boolean.FALSE.equals(isSearch.get()));
    }

    public TaskFragmentViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getTasks() {
        showLoading();
        //Handle project and organization id to call api
        if (projectId.get() != null && Objects.requireNonNull(projectId.get()) == 0L)
            projectId.set(null);
        if (organizationId.get() != null && Objects.requireNonNull(organizationId.get()) == 0L)
            organizationId.set(null);
        compositeDisposable.add(repository.getApiService().getTasks(projectId.get(), organizationId.get(),0)
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
                                if (response.getData().getContent() == null || response.getData().getContent().isEmpty()) {
                                    totalElements.set(0);
                                    tasks.setValue(new ArrayList<>());
                                } else {
                                    tasks.setValue(response.getData().getContent());
                                    totalElements.set(response.getData().getContent().size());
                                }
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void deleteTask(Long id, BaseCallBack callBack) {
        compositeDisposable.add(repository.getApiService().deleteTask(id)
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
                                showSuccessMessage(application.getString(R.string.delete_task_successfully));
                                callBack.doSuccess();
                            }
                        }, throwable -> {
                            hideLoading();
                            callBack.doError(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void changeStateTask(Long id, BaseCallBack callBack) {
        compositeDisposable.add(repository.getApiService().changeStateTask(
                new TaskChangeStateRequest(id))
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
                                showSuccessMessage(application.getString(R.string.change_state_task_successfully));
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
