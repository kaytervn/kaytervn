package com.finance.ui.tag;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.ui.base.BaseCallBack;
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

public class TagViewModel extends BaseViewModel {

    //MutableLiveData for call back data
    public MutableLiveData<List<TagResponse>> tags = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<TagResponse> tagLiveData = new MutableLiveData<>();
    public ObservableField<Integer> tagKind = new ObservableField<>(1);
    public ObservableField<Integer> totalElements = new ObservableField<>(0);
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);
    public ObservableField<String> isSearchEmpty = new ObservableField<>("");
    public ObservableField<Boolean> isSearch = new ObservableField<>(false);


    public void isShowSearch() {
        isSearch.set(Boolean.FALSE.equals(isSearch.get()));
    }
    public TagViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getTags(Integer kind){
        showLoading();
        compositeDisposable.add(repository.getApiService().getTags(kind)
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
                                tags.setValue(response.getData().getContent());
                                totalElements.set(response.getData().getTotalElements().intValue());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            Timber.e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void deleteTag(Long id, BaseCallBack callBack){
        showLoading();
        compositeDisposable.add(repository.getApiService().deleteTag(id)
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
                                showSuccessMessage(application.getResources().getString(R.string.delete_tag_success));
                                callBack.doSuccess();
                            }
                        }, throwable -> {
                            hideLoading();
                            callBack.doError(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
    public void getTagDetail(Long id){
        showLoading();
        compositeDisposable.add(repository.getApiService().getDetailTag(id)
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
                                tagLiveData.setValue(response.getData());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            Timber.tag("ServiceGetDetail").e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    @Override
    protected void onCleared() {
        tags.setValue(null);
        tagLiveData.setValue(null);
        super.onCleared();
    }
}
