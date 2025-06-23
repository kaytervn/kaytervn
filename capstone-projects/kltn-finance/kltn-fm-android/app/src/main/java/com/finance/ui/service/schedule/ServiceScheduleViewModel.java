package com.finance.ui.service.schedule;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.request.service.schedule.ServiceScheduleUpdateRequest;
import com.finance.data.model.api.response.service.schedule.ServiceScheduleResponse;
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

public class ServiceScheduleViewModel extends BaseViewModel {

    //MutableLiveData for call back data
    public MutableLiveData<List<ServiceScheduleResponse>> serviceSchedules = new MutableLiveData<>(new ArrayList<>());
    public ObservableField<Long> serviceId = new ObservableField<>();
    public ObservableField<List<Integer>> numberOfDueDaysList = new ObservableField<>(new ArrayList<>());
    public ObservableField<Boolean> isHaveServiceSchedule = new ObservableField<>(false);
    public ObservableField<Boolean> isUpdate = new ObservableField<>(false);
    public ServiceScheduleViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }


    public void getAllServiceSchedules(Long serviceId) {
        compositeDisposable.add(repository.getApiService().getServiceSchedules(serviceId)
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
                            if (response.isResult()){
                                isHaveServiceSchedule.set(true);
                                serviceSchedules.setValue(response.getData().getContent());
                            }
                            else
                                isHaveServiceSchedule.set(false);
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
    public void updateServiceSchedule() {
        compositeDisposable.add(repository.getApiService().updateServiceSchedule(
                    new ServiceScheduleUpdateRequest(serviceId.get(), numberOfDueDaysList.get())
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
                            if (response.isResult()){
                                showSuccessMessage(application.getString(R.string.success_update_service_schedule));
                                application.getCurrentActivity().finish();
                            }
                        }, throwable -> {
                            hideLoading();
                            Timber.e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

}
