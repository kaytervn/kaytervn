package com.finance.ui.transaction.detail;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.response.transaction.TransactionResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.utils.NetworkUtils;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;
import timber.log.Timber;

public class TransactionDetailViewModel extends BaseViewModel {

    public MutableLiveData<TransactionResponse>  tranLiveData = new MutableLiveData<>(new TransactionResponse());
    public ObservableField<TransactionResponse> tran = new ObservableField<>(new TransactionResponse());
    public ObservableField<Integer> totalDocuments = new ObservableField<>(0);
    public ObservableField<Boolean> isUpdated = new ObservableField<>(false);

    public ObservableField<Boolean> isHaveDocument = new ObservableField<>(false);

    public TransactionDetailViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);

    }

    public void getDetailTransaction(Long id){
        showLoading();
        compositeDisposable.add(repository.getApiService().getDetailTransaction(id)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwableFlatMap -> {
                            if (NetworkUtils.checkNetworkError(throwableFlatMap)) {
                                hideLoading();
                                return application.showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwableFlatMap);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            if (response.isResult()) {
                                tranLiveData.setValue(response.getData());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            Timber.tag("TransactionDetail").e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

//    public void downloadFile(String url, String fileInput) {
//        String[] parts = url.split("/");
//        String folder = parts[1];
//        String fileName = parts[2];
//
//        String mineType = FileUtils.getMimeType(fileName);
//        compositeDisposable.add(repository.getApiService().downloadFile(folder, fileName)
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe(
//                        response -> {
//                            //Api 29 and above
//                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                                FileUtils.saveFileToDownloads(application.getCurrentActivity(), response, fileInput, mineType);
//                            }
//                            //Api 28 and below
//                            else {
//                                FileUtils.saveFileToDownloads(response, fileInput);
//                            }
//                            showSuccessMessage(application.getString(R.string.download_success) + fileInput);
//                        },
//                        throwable ->
//                                showErrorMessage(throwable.getMessage())
//                ));
//    }
}
