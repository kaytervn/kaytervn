package com.finance.ui.task.create_or_update;

import android.app.Activity;
import android.content.Intent;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.request.task.TaskCreateRequest;
import com.finance.data.model.api.request.task.TaskUpdateRequest;
import com.finance.data.model.api.response.project.ProjectResponse;
import com.finance.data.model.api.response.task.TaskResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.ui.main.MainActivity;
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

public class TaskCreateUpdateViewModel extends BaseViewModel {

    //MutableLiveData for call api
    public MutableLiveData<List<ProjectResponse>> projects = new MutableLiveData<>(new ArrayList<>());

    public ObservableField<TaskResponse> taskResponse = new ObservableField<>(new TaskResponse());
    public MutableLiveData<String> filePathDocuments = new MutableLiveData<>("");
    public ObservableField<Boolean> isHaveProject = new ObservableField<>(false);

    public ObservableField<Boolean> isRightProject = new ObservableField<>(false);
    public ObservableField<Boolean> isCreated = new ObservableField<>(false);
    public ObservableField<Boolean> fromProject = new ObservableField<>(false);
    public ObservableField<Boolean> isSubTask = new ObservableField<>(false);
    public TaskCreateUpdateViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getAllProject(){
        showLoading();
        compositeDisposable.add(repository.getApiService().getAllProject(0, "createdDate,desc")
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
                                isHaveProject.set(true);
                                projects.setValue(response.getData().getContent());
                            }
                        }, throwable -> {
                            hideLoading();
                            Timber.e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void createOrUpdateTask(){
        showLoading();
        if (Objects.requireNonNull(taskResponse.get()).getName() == null
                || Objects.requireNonNull(taskResponse.get()).getName().trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_task_name));
            return;
        }
        if (Boolean.FALSE.equals(isRightProject.get())){
            showErrorMessage(application.getString(R.string.project_do_not_exist));
            return;
        }

        Objects.requireNonNull(taskResponse.get()).setName(
                Objects.requireNonNull(taskResponse.get()).getName().trim());
        showLoading();
        if (Boolean.TRUE.equals(isCreated.get())) {
            compositeDisposable.add(repository.getApiService().createTask(
                            new TaskCreateRequest(Objects.requireNonNull(taskResponse.get()))
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
                                showSuccessMessage(application.getString(R.string.create_success));
                                hideLoading();
                                Intent intent = new Intent(application, MainActivity.class);
                                application.getCurrentActivity().setResult(Constants.RESULT_CREATE, intent);
                                application.getCurrentActivity().finish();
                            }, throwable -> {
                                hideLoading();
                                Timber.e(throwable);
                                showErrorMessage(application.getResources().getString(R.string.no_internet));
                            }
                    ));
        } else {
            compositeDisposable.add(repository.getApiService().updateTask(
                            new TaskUpdateRequest(Objects.requireNonNull(taskResponse.get()))
                    )
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
                    .retryWhen(throwable ->
                            throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable12 -> {
                                if (NetworkUtils.checkNetworkError(throwable12)) {
                                    hideLoading();
                                    return application.showDialogNoInternetAccess();
                                }else{
                                    return Observable.error(throwable12);
                                }
                            })
                    )
                    .subscribe(
                            response -> {
                                hideLoading();
                                showSuccessMessage(application.getString(R.string.update_success));
                                Intent intent = new Intent(application, MainActivity.class);
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, intent);
                                application.getCurrentActivity().finish();
                            }, throwable -> {
                                hideLoading();
                                Timber.e(throwable);
                                showErrorMessage(application.getResources().getString(R.string.no_internet));
                            }
                    ));
        }
    }
    public void doUploadFile(MultipartBody.Part imagePart){
        showLoading();
        RequestBody type = RequestBody.create("DOCUMENT", MediaType.parse("multipart/form-data"));
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
                                filePathDocuments.setValue(response.getData().getFilePath());
                            }
                            hideLoading();
                        },
                        throwable -> {
                            hideLoading();
                            Timber.e(throwable);
                            showErrorMessage(throwable.getMessage());
                        }
                )
        );
    }

    @Override
    protected void onCleared() {
        projects.setValue(null);
        super.onCleared();
    }
}
