package com.finance.ui.tag.detail;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.request.tag.TagCreateRequest;
import com.finance.data.model.api.request.tag.TagUpdateRequest;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.ui.tag.TagActivity;
import com.finance.utils.NetworkUtils;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class TagDetailViewModel extends BaseViewModel {
    public MutableLiveData<TagResponse> tagResponse = new MutableLiveData<>(new TagResponse());
    public ObservableField<TagResponse> tag = new ObservableField<>(new TagResponse());

    public ObservableField<Integer> position = new ObservableField<>();
    public ObservableField<Boolean> isCreate = new ObservableField<>(false);


    public TagDetailViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }
    public void getTagDetails(Long id){
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
                            hideLoading();
                            if (response.isResult()) {
                                tagResponse.setValue(response.getData());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void createTag(){
        if (invalidData()) return;
        showLoading();
        compositeDisposable.add(
                repository.getApiService().createTag(
                        new TagCreateRequest(
                                Objects.requireNonNull(tag.get()).getName(),
                                Objects.requireNonNull(tag.get()).getKind(),
                                Objects.requireNonNull(tag.get()).getColorCode()
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
                                showSuccessMessage(application.getString(R.string.create_tag_success));
                                Intent resultIntent = new Intent();
                                Bundle bundle = new Bundle();
                                bundle.putInt(Constants.TAG_KIND, Objects.requireNonNull(tag.get()).getKind());
                                resultIntent.putExtras(bundle);
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, resultIntent);
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

    public void updateTag(){
        if (invalidData()) return;
        showLoading();
        compositeDisposable.add(repository.getApiService().updateTag(
                        new TagUpdateRequest(
                                Objects.requireNonNull(tag.get()).getId(),
                                Objects.requireNonNull(tag.get()).getName(),
                                Objects.requireNonNull(tag.get()).getKind(),
                                Objects.requireNonNull(tag.get()).getColorCode()
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
                                showSuccessMessage(application.getString(R.string.update_tag_success));
                                Intent resultIntent = new Intent();
                                Bundle bundle = new Bundle();
                                bundle.putSerializable(Constants.TAG_ID, Objects.requireNonNull(tag.get()).getId());
                                bundle.putInt(Constants.POSITION, Objects.requireNonNull(position.get()));
                                resultIntent.putExtras(bundle);
                                application.getCurrentActivity().setResult(
                                        Constants.RESULT_UPDATE, resultIntent);
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

    private boolean invalidData() {
        if (Objects.requireNonNull(tag.get()).getKind() == null) {
            showErrorMessage(application.getString(R.string.invalid_tag_kind));
            return true;
        }

        if(Objects.requireNonNull(tag.get()).getName() == null
                ||  Objects.requireNonNull(tag.get()).getName().trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_tag_name));
            return true;
        }
        Objects.requireNonNull(tag.get()).setName(Objects.requireNonNull(tag.get()).getName().trim());

        if(Objects.requireNonNull(tag.get()).getColorCode() == null
                ||  Objects.requireNonNull(tag.get()).getColorCode().trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_tag_color_code));
            return true;
        }

        return false;
    }

}
