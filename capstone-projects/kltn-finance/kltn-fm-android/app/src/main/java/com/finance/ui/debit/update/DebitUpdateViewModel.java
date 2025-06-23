package com.finance.ui.debit.update;

import static android.app.Activity.RESULT_OK;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.request.debit.DebitUpdateRequest;
import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.data.model.api.response.category.CategoryResponse;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.data.model.api.response.transaction.group.TransactionGroupResponse;
import com.finance.ui.base.BaseViewModel;
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

public class DebitUpdateViewModel extends BaseViewModel {
    public ObservableField<DebitUpdateRequest> debitRequest = new ObservableField<>(new DebitUpdateRequest());
    public ObservableField<String> createdDate = new ObservableField<>();
    //MutableLiveData for update UI
    public MutableLiveData<List<TransactionGroupResponse>> groupTransactions = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<List<CategoryResponse>> categories = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<List<AccountResponse>> accounts = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<List<TagResponse>> tags = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<String> filePathDocuments = new MutableLiveData<>("");
    public ObservableField<Boolean> isHaveGroupTransaction = new ObservableField<>(false);
    public ObservableField<Boolean> isHaveCategory = new ObservableField<>(false);
    public ObservableField<Boolean> isRightGroupTransaction = new ObservableField<>(false);
    public ObservableField<Boolean> isRightCategory = new ObservableField<>(false);
    public ObservableField<Boolean> isRightTag = new ObservableField<>(false);
    public ObservableField<Boolean> isHaveAccount = new ObservableField<>(false);
    public ObservableField<Boolean> isHaveTag = new ObservableField<>(false);
    public ObservableField<Boolean> isRightAccountAddedBy = new ObservableField<>(false);

    public ObservableField<String> fullName = new ObservableField<>(repository.getAccount().getFullName());
    public DebitUpdateViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getListTags(){
        showLoading();
        compositeDisposable.add(repository.getApiService().getTags(1)
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
                            if (response.isResult() && response.getData().getContent() != null) {
                                isHaveTag.set(true);
                                tags.setValue(response.getData().getContent());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }


    public void getAllGroupTransaction(){
        compositeDisposable.add(repository.getApiService().getAllGroupTransaction()
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
                            if (response.isResult() && response.getData().getContent() != null) {
                                isHaveGroupTransaction.set(true);
                                groupTransactions.setValue(response.getData().getContent());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void getAllCategoryByKind(Integer kind){
        showLoading();
        //Status mean it's not hiding
        compositeDisposable.add(repository.getApiService().getAllCategoryByKind(kind, 1, 0)
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
                            if (response.isResult() && response.getData().getContent() != null) {
                                isHaveCategory.set(true);
                                categories.setValue(response.getData().getContent());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            Timber.e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void getListAccounts(){
        compositeDisposable.add(repository.getApiService().getListAccounts()
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
                            if (response.isResult() && response.getData().getContent() != null) {
                                isHaveAccount.set(true);
                                accounts.setValue(response.getData().getContent());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            Timber.e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }


    public void updateDebit(){
        if (invalidData()){
            return;
        }
        Objects.requireNonNull(debitRequest.get()).setName(
                Objects.requireNonNull(debitRequest.get()).getName().trim());
        showLoading();
        Timber.tag("DebitUpdateViewModel").e(Objects.requireNonNull(debitRequest.get()).toString());
        compositeDisposable.add(repository.getApiService().updateDebit(debitRequest.get())
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
                            showSuccessMessage(application.getString(R.string.update_success));
                            application.getCurrentActivity().setResult(RESULT_OK);
                            application.getCurrentActivity().finish();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }
    private Boolean invalidData() {
        if (Objects.requireNonNull(debitRequest.get()).getKind() == null){
            showErrorMessage(application.getString(R.string.invalid_transaction_kind));
            return true;
        }
        if (Objects.requireNonNull(debitRequest.get()).getTransactionDate() == null
                || Objects.requireNonNull(debitRequest.get()).getTransactionDate().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_transaction_date));
            return true;
        }
        if (Objects.requireNonNull(debitRequest.get()).getName() == null
                || Objects.requireNonNull(debitRequest.get()).getName().trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_transaction_name));
            return true;
        }

        if (Objects.requireNonNull(debitRequest.get()).getMoney() == null
                || Objects.requireNonNull(debitRequest.get()).getMoney() <= 0){
            showErrorMessage(application.getString(R.string.invalid_money));
            return true;
        }
        if (Boolean.FALSE.equals(isRightCategory.get())){
            showErrorMessage(application.getString(R.string.category_do_not_exist));
            return true;
        }

        if (Boolean.FALSE.equals(isRightGroupTransaction.get())){
            showErrorMessage(application.getString(R.string.group_transaction_do_not_exist));
            return true;
        }

        if (Boolean.FALSE.equals(isRightTag.get())){
            showErrorMessage(application.getString(R.string.tag_do_not_exist));
            return true;
        }

        return false;
    }

    public void doUploadFile(MultipartBody.Part imagePart){
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
                            if(response.isResult() && response.getData() != null){
                                filePathDocuments.setValue(response.getData().getFilePath());
                            }else{
                                showErrorMessage(response.getMessage());
                            }
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
        super.onCleared();
        groupTransactions.setValue(null);
        categories.setValue(null);
        accounts.setValue(null);
        filePathDocuments.setValue(null);
    }
}
