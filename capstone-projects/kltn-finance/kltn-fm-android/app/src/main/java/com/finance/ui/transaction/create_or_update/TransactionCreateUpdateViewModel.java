package com.finance.ui.transaction.create_or_update;

import static android.app.Activity.RESULT_OK;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.request.transaction.TransactionCreateUpdateRequest;
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

public class TransactionCreateUpdateViewModel extends BaseViewModel {
    //Request
    public ObservableField<TransactionCreateUpdateRequest> transactionRequest = new ObservableField<>(new TransactionCreateUpdateRequest());
    public ObservableField<Boolean> isCreated = new ObservableField<>(false);

    //MutableLiveData for update UI
    public MutableLiveData<List<TransactionGroupResponse>> groupTransactions = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<List<CategoryResponse>> categories = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<List<AccountResponse>> accounts = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<List<TagResponse>> tags = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<String> filePathDocuments = new MutableLiveData<>("");

    //Check data is valid
    //--Have data
    public ObservableField<Boolean> isHaveGroupTransaction = new ObservableField<>(false);
    public ObservableField<Boolean> isHaveCategory = new ObservableField<>(false);
    public ObservableField<Boolean> isHaveAccount = new ObservableField<>(false);
    public ObservableField<Boolean> isHaveTag = new ObservableField<>(false);

    //--Valid data
    public ObservableField<Boolean> isRightGroupTransaction = new ObservableField<>(false);
    public ObservableField<Boolean> isRightCategory = new ObservableField<>(false);
    public ObservableField<Boolean> isRightAccountAddedBy = new ObservableField<>(false);
    public ObservableField<Boolean> isRightAccountApprovedBy = new ObservableField<>(false);
    public ObservableField<Boolean> isRightTag = new ObservableField<>(false);

    //Create Debit
    public ObservableField<Boolean> expenditureKind = new ObservableField<>(false);
    public ObservableField<Boolean> createDebit = new ObservableField<>(false);
    public void setIsCreateDebit(){
        createDebit.set(Boolean.FALSE.equals(createDebit.get()));
    }

    public TransactionCreateUpdateViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void getAllGroupTransaction(){
        showLoading();
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
        //Status 1 mean it's not hiding
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
                                if (kind == 2)
                                    expenditureKind.set(true);
                                else
                                    expenditureKind.set(false);
                                isHaveCategory.set(true);
                                categories.setValue(response.getData().getContent());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
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
                            Timber.tag("TransactionCreateTag").e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void getListAccounts(){
        showLoading();
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
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
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
                            if(response.isResult() && response.getData() != null){
                                filePathDocuments.setValue(response.getData().getFilePath());
                            }else{
                                showErrorMessage(response.getMessage());
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


    public void createTransaction(){
        if (invalidData()) return;
        showLoading();
        Objects.requireNonNull(transactionRequest.get()).setName(
                Objects.requireNonNull(transactionRequest.get()).getName().trim());
        compositeDisposable.add(repository.getApiService().createTransaction(transactionRequest.get())
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
                                hideLoading();
                                showSuccessMessage(application.getString(R.string.create_success));
                                application.getCurrentActivity().setResult(Constants.RESULT_CREATE);
                                application.getCurrentActivity().finish();
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();

                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void updateTransaction(){
        if (invalidData()) return;
        Objects.requireNonNull(transactionRequest.get()).setName(
                Objects.requireNonNull(transactionRequest.get()).getName().trim());
        showLoading();
        compositeDisposable.add(repository.getApiService().updateTransaction(transactionRequest.get())
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
        if (Objects.requireNonNull(transactionRequest.get()).getKind() == null){
            showErrorMessage(application.getString(R.string.invalid_transaction_kind));
            return true;
        }
        if (Objects.requireNonNull(transactionRequest.get()).getTransactionDate() == null
                || Objects.requireNonNull(transactionRequest.get()).getTransactionDate().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_transaction_date));
            return true;
        }
        if (Objects.requireNonNull(transactionRequest.get()).getName() == null
                || Objects.requireNonNull(transactionRequest.get()).getName().trim().isEmpty()){
            showErrorMessage(application.getString(R.string.invalid_transaction_name));
            return true;
        }

        if (Objects.requireNonNull(transactionRequest.get()).getMoney() == null
                || Objects.requireNonNull(transactionRequest.get()).getMoney() <= 0){
            showErrorMessage(application.getString(R.string.invalid_money));
            return true;
        }
        if (Boolean.FALSE.equals(isRightCategory.get())){
            showErrorMessage(application.getString(R.string.category_do_not_exist));
            return true;
        }

        if (Boolean.FALSE.equals(isRightTag.get())){
            showErrorMessage(application.getString(R.string.tag_do_not_exist));
            return true;
        }

        if (Boolean.FALSE.equals(isRightAccountApprovedBy.get())){
            showErrorMessage(application.getString(R.string.account_approve_by_do_not_exist));
            return true;
        }
        return false;
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
