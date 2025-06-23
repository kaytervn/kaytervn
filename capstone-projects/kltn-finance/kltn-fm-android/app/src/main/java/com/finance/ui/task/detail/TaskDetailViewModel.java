package com.finance.ui.task.detail;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.response.task.TaskResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.utils.NetworkUtils;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class TaskDetailViewModel extends BaseViewModel {

    public MutableLiveData<TaskResponse>  taskLiveData = new MutableLiveData<>(new TaskResponse());
    public ObservableField<TaskResponse> task = new ObservableField<>(new TaskResponse());
    public ObservableField<Integer> totalDocuments = new ObservableField<>(0);

    public ObservableField<Boolean> isUpdated = new ObservableField<>(false);
    public ObservableField<Boolean> isHaveDocument = new ObservableField<>(false);
    public ObservableField<Boolean> isSubTask= new ObservableField<>(false);
    public ObservableField<Boolean> fromProject = new ObservableField<>(false);
    public TaskDetailViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getDetailTask(Long id){
        showLoading();
        compositeDisposable.add(repository.getApiService().getDetailTask(id)
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
                            if (response.isResult() && response.getData() != null) {
                                taskLiveData.setValue(response.getData());
                                if (Objects.requireNonNull(task.get()).getDocument() != null
                                        && !Objects.requireNonNull(task.get()).getDocument().isEmpty()) {
                                    isHaveDocument.set(true);
                                } else {
                                    isHaveDocument.set(false);
                                }
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

}
