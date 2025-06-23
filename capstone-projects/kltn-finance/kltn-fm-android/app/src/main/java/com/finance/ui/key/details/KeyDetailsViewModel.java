package com.finance.ui.key.details;

import android.app.Activity;
import android.content.Intent;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.request.key.KeyCreateRequest;
import com.finance.data.model.api.request.key.KeyUpdateRequest;
import com.finance.data.model.api.response.key.GoogleKey;
import com.finance.data.model.api.response.key.KeyGroupResponse;
import com.finance.data.model.api.response.key.KeyResponse;
import com.finance.data.model.api.response.key.ServerKey;
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.ui.base.BaseViewModel;
import com.finance.utils.NetworkUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import timber.log.Timber;

public class KeyDetailsViewModel extends BaseViewModel {

    public ObservableField<String> description = new ObservableField<>();
    public ObservableField<Long> id = new ObservableField<>();
    public ObservableField<Integer> kind = new ObservableField<>(1);
    public ObservableField<Boolean> isCreated = new ObservableField<>(false);
    public MutableLiveData<List<KeyGroupResponse>> keyGroups = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<List<OrganizationResponse>> organizationResponses = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<List<TagResponse>> tags = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<String> filePath = new MutableLiveData<>();

    public ObservableField<KeyResponse> keyResponse = new ObservableField<>(new KeyResponse());
    public ObservableField<Boolean> isShowPassword = new ObservableField<>(false);
    public ObservableField<GoogleKey> ggKey = new ObservableField<>(new GoogleKey());
    public ObservableField<ServerKey> serverKey = new ObservableField<>(new ServerKey());
    public ObservableField<String> name = new ObservableField<>();
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);
    public ObservableField<Boolean> isHaveTag = new ObservableField<>(false);

    public ObservableField<Boolean> isRightKeyGroup = new ObservableField<>(false);
    public ObservableField<Boolean> isRightOrganization = new ObservableField<>(false);
    public ObservableField<Boolean> isRightTag = new ObservableField<>(false);

    public KeyDetailsViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
//        getKeyGroup();
    }

    public void showPassword(){
        isShowPassword.set(Boolean.FALSE.equals(isShowPassword.get()));
    }

    public void getKeyDetails(Long id){
        showLoading();
        compositeDisposable.add(repository.getApiService().getKeyDetails(id)
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
                                keyResponse.set(response.getData());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(throwable.getMessage());
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void getListTags(){
        showLoading();
        compositeDisposable.add(repository.getApiService().getTags(3)
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

    public void createKey(){
        KeyCreateRequest request = new KeyCreateRequest();
        if(description.get()!=null)
            request.setDescription(Objects.requireNonNull(description.get()).trim());

        if(Objects.requireNonNull(kind.get()) == 1)
            request.setAdditionalInformation(ApiModelUtils.GSON.toJson(serverKey.get(), ServerKey.class));
        else if(Objects.requireNonNull(kind.get()) ==2)
            request.setAdditionalInformation(ApiModelUtils.GSON.toJson(ggKey.get(), GoogleKey.class));

        request.setKind(Objects.requireNonNull(keyResponse.get()).getKind());
        if(Objects.requireNonNull(keyResponse.get()).getKeyInformationGroup() != null)
            request.setKeyInformationGroupId(Objects.requireNonNull(keyResponse.get()).getKeyInformationGroup().getId());

        if (Objects.requireNonNull(keyResponse.get()).getOrganization() != null)
            request.setOrganizationId(Objects.requireNonNull(keyResponse.get()).getOrganization().getId());

        if(name.get()!=null)
            request.setName(Objects.requireNonNull(name.get()).trim());

        if(name.get() == null || Objects.requireNonNull(name.get()).trim().isEmpty()){
            showErrorMessage(application.getResources().getString(R.string.key_name_not_empty));
            return;
        }

        if (Objects.requireNonNull(keyResponse.get()).getTag().getId() != null){
            request.setTagId(Objects.requireNonNull(keyResponse.get()).getTag().getId());
        }

        if (Boolean.FALSE.equals(isRightTag.get())){
            showErrorMessage(application.getString(R.string.tag_do_not_exist));
            return;
        }

        //Document
        if(Objects.requireNonNull(keyResponse.get()).getDocument()!=null){
            request.setDocument(Objects.requireNonNull(keyResponse.get()).getDocument());
        }

        if(checkValidation()){
            return;
        }
        showLoading();
        compositeDisposable.add(repository.getApiService().createKey(request)
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
                                showSuccessMessage(application.getString(R.string.add_new_key_success));
                                Intent intent = new Intent();
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, intent);
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
    public void updateKey(){
        KeyUpdateRequest request = new KeyUpdateRequest();
        request.setId(id.get());
        //Description
        if(description.get()!=null){
            request.setDescription(Objects.requireNonNull(description.get()).trim());
        }

        //Kind
        if(Objects.requireNonNull(kind.get()) == 1)
            request.setAdditionalInformation(ApiModelUtils.GSON.toJson(serverKey.get(), ServerKey.class));
        else if(Objects.requireNonNull(kind.get()) ==2)
            request.setAdditionalInformation(ApiModelUtils.GSON.toJson(ggKey.get(), GoogleKey.class));

        request.setKind(Objects.requireNonNull(keyResponse.get()).getKind());

        //KeyInformationGroup
        if(Objects.requireNonNull(keyResponse.get()).getKeyInformationGroup()!=null){
            request.setKeyInformationGroupId(Objects.requireNonNull(keyResponse.get()).getKeyInformationGroup().getId());
        } else {
            showErrorMessage(application.getResources().getString(R.string.invalid_key_group));
            return;
        }

        if (Boolean.FALSE.equals(isRightKeyGroup.get())) {
            showErrorMessage(application.getResources().getString(R.string.key_group_do_not_exist));
            return;
        }

        if (Boolean.FALSE.equals(isRightOrganization.get())) {
            showErrorMessage(application.getResources().getString(R.string.organization_do_not_exist));
            return;
        }

        if (Boolean.FALSE.equals(isRightTag.get())){
            showErrorMessage(application.getString(R.string.tag_do_not_exist));
            return;
        }

        //Organization
        if(Objects.requireNonNull(keyResponse.get()).getOrganization()!=null){
            request.setOrganizationId(Objects.requireNonNull(keyResponse.get()).getOrganization().getId());
        }

        //Name
        if(name.get()!=null){
            request.setName(Objects.requireNonNull(name.get()).trim());
        }
        if(name.get() == null || Objects.requireNonNull(name.get()).trim().isEmpty()){
            showErrorMessage(application.getResources().getString(R.string.key_name_not_empty));
            return;
        }

        //Document
        if(Objects.requireNonNull(keyResponse.get()).getDocument()!=null){
            request.setDocument(Objects.requireNonNull(keyResponse.get()).getDocument());
        }

        if (Objects.requireNonNull(keyResponse.get()).getTag().getId() != null){
            request.setTagId(Objects.requireNonNull(keyResponse.get()).getTag().getId());
        }

        if(checkValidation()){
            return;
        }
        showLoading();
        compositeDisposable.add(repository.getApiService().updateKey(request)
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
                                showSuccessMessage(application.getString(R.string.update_key_success));
                                Intent intent = new Intent();
                                intent.putExtra(Constants.KEY, ApiModelUtils.GSON.toJson(keyResponse.get(), KeyResponse.class));
                                hideLoading();
                                application.getCurrentActivity().setResult(Activity.RESULT_OK, intent);
                                application.getCurrentActivity().finish();
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void getKeyGroup(){
        showLoading();
        compositeDisposable.add(repository.getApiService().getKeyGroupList(null, 1000)
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
                                if(response.getData().getContent()!= null){
                                    keyGroups.setValue(response.getData().getContent());
                                }else {
                                    keyGroups.setValue(new ArrayList<>());
                                }

//                                showSuccessMessage(response.getMessage());
                            }else {
                                showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void getOrganizations(){
        showLoading();
        compositeDisposable.add(repository.getApiService().getAllOrganization(null, null, 0, "createDate")
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
                                if(response.getData().getContent()!= null){
                                    organizationResponses.setValue(response.getData().getContent());
                                }else {
                                    organizationResponses.setValue(new ArrayList<>());
                                }

                            }else {
                                showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public boolean checkValidation(){
        String phoneRegex = "^(0[35789])+([0-9]{8})$";
        Pattern phonePatter = Pattern.compile(phoneRegex);
        if(Objects.requireNonNull(kind.get()) == 1){

            if(Objects.requireNonNull(serverKey.get()).getUsername() == null
                    || Objects.requireNonNull(serverKey.get()).getUsername().trim().isEmpty()){
                showErrorMessage(application.getString(R.string.invalid_username));
                return true;
            }else if (Objects.requireNonNull(serverKey.get()).getUsername().contains(" ")) {
                showErrorMessage(application.getString(R.string.invalid_key_username));
                return true;
            }
            if (Objects.requireNonNull(serverKey.get()).getPassword() != null
                    && !Objects.requireNonNull(serverKey.get()).getPassword().trim().isEmpty() && Objects.requireNonNull(serverKey.get()).getPassword().trim().length()<6) {
                showErrorMessage(application.getString(R.string.password_length_invalid));
                return true;
            }
        }else if(Objects.requireNonNull(kind.get()) ==2 ){
            if(Objects.requireNonNull(ggKey.get()).getUsername() == null
                    || Objects.requireNonNull(ggKey.get()).getUsername().trim().isEmpty()){
                showErrorMessage(application.getString(R.string.invalid_username));
                return true;
            } else if (Objects.requireNonNull(ggKey.get()).getUsername().contains(" ")) {
                showErrorMessage(application.getString(R.string.invalid_key_username));
                return true;
            }
            if(Objects.requireNonNull(ggKey.get()).getPassword() == null
                    || Objects.requireNonNull(ggKey.get()).getPassword().trim().isEmpty()){
                showErrorMessage(application.getString(R.string.invalid_password));
                return true;
            }else if (Objects.requireNonNull(ggKey.get()).getPassword().trim().length()<6) {
                showErrorMessage(application.getString(R.string.password_length_invalid));
                return true;
            }

            if( Objects.requireNonNull(ggKey.get()).getPhoneNumber()!= null
                    && !Objects.requireNonNull(ggKey.get()).getPhoneNumber().trim().isEmpty()
                    && !phonePatter.matcher(Objects.requireNonNull(ggKey.get()).getPhoneNumber().trim()).matches()){
                showErrorMessage(application.getString(R.string.format_phone_number_invalid));
                return true;
            }
        }
        return false;
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
                                filePath.setValue(response.getData().getFilePath());
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

    @Override
    protected void onCleared() {
        super.onCleared();
        keyGroups.setValue(null);
        tags.setValue(null);
        organizationResponses.setValue(null);
        filePath.setValue(null);
    }

}
