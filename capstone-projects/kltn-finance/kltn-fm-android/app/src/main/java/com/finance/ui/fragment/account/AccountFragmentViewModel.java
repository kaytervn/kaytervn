package com.finance.ui.fragment.account;

import android.app.Dialog;
import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Environment;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.Repository;
import com.finance.data.SecretKey;
import com.finance.data.model.api.request.privatekey.PrivateKeyRequest;
import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.data.model.api.response.account.Permission;
import com.finance.ui.base.BaseFragmentViewModel;
import com.finance.ui.category.CategoryActivity;
import com.finance.ui.debit.DebitActivity;
import com.finance.ui.department.DepartmentActivity;
import com.finance.ui.key.group.KeyGroupActivity;
import com.finance.ui.nofication.NotificationActivity;
import com.finance.ui.organization.OrganizationActivity;
import com.finance.ui.password.change.ChangePasswordActivity;
import com.finance.ui.project.ProjectActivity;
import com.finance.ui.scanner.WebQRCodeRequest;
import com.finance.ui.service.group.ServiceGroupActivity;
import com.finance.ui.tag.TagActivity;
import com.finance.ui.transaction.group.TransactionGroupActivity;
import com.finance.ui.login.LoginActivity;
import com.finance.ui.service.ServiceActivity;
import com.finance.utils.DateUtils;
import com.finance.utils.NetworkUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;
import okhttp3.ResponseBody;
import timber.log.Timber;

public class    AccountFragmentViewModel extends BaseFragmentViewModel {

    //MutableLiveData for callback api
    public MutableLiveData<String> filePath = new MutableLiveData<>();
    public ObservableField<Boolean> isShowPassWord = new ObservableField<>(false);
    public ObservableField<AccountResponse> profile = new ObservableField<>();
    public ResponseBody fileContent;


    public AccountFragmentViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
        getProfile();
    }
    public void showPassword(){
        isShowPassWord.set(Boolean.FALSE.equals(isShowPassWord.get()));
    }

    public void getProfile(){
        showLoading();
            compositeDisposable.add(repository.getApiService().getProfile()
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
                                profile.set(response.getData());
                                Objects.requireNonNull(profile.get()).setBirthDate(
                                        DateUtils.convertFromUTCToDefaultApi(Objects.requireNonNull(profile.get()).getBirthDate()));
                                filePath.setValue(Objects.requireNonNull(profile.get()).getAvatarPath());
                            }else{
                                showErrorMessage(response.getMessage());
                            }
                            hideLoading();
                        },
                        throwable -> {
                            hideLoading();
                            showErrorMessage(throwable.getMessage());
                        }
                ));
    }


    public void verifyQrcode(String message){
        showLoading();
        compositeDisposable.add(repository.getApiService().verifyQrcode(new WebQRCodeRequest(message))
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
                               showSuccessMessage("Xác thực đăng nhập web thành công");
                            }else{
                                showErrorMessage(response.getMessage());
                            }
                            hideLoading();
                        },
                        throwable -> {
                            hideLoading();
                            showErrorMessage(throwable.getMessage());
                        }
                ));
    }



    public void logOut(){
        // Dialog custom
        Dialog dialog = new Dialog(application.getCurrentActivity());
        dialog.setContentView(R.layout.dialog_logout);
        Window window = dialog.getWindow();

        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));

        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);

        Button btnSignOut = dialog.findViewById(R.id.btn_signout);
        Button btnCancel = dialog.findViewById(R.id.btn_cancel);

        btnCancel.setOnClickListener(v -> dialog.dismiss());

        btnSignOut.setOnClickListener(v -> {
            Intent intent = new Intent(application.getCurrentActivity(), LoginActivity.class);
            repository.getSharedPreferences().setToken(null);
            repository.getSharedPreferences().setAccount(null);
            SecretKey.getInstance().setKey(null);
            application.getCurrentActivity().startActivity(intent);
            application.getCurrentActivity().finish();
            dialog.dismiss();
        });
        dialog.show();
    }

    public void navigateToCategory(){
        Intent intent = new Intent(application.getCurrentActivity(), CategoryActivity.class);
        application.getCurrentActivity().startActivity(intent);
    }

    public void navigateToDepartment(){
        Intent intent = new Intent(application.getCurrentActivity(), DepartmentActivity.class);
        application.getCurrentActivity().startActivity(intent);
    }

    public void navigateToGroupTransaction(){
        Intent intent = new Intent(application.getCurrentActivity(), TransactionGroupActivity.class);
        application.getCurrentActivity().startActivity(intent);
    }
    public void navigateToNotification(){
        Intent intent = new Intent(application.getCurrentActivity(), NotificationActivity.class);
        application.getCurrentActivity().startActivity(intent);
    }
    public void navigateToGroupService(){
        Intent intent = new Intent(application.getCurrentActivity(), ServiceGroupActivity.class);
        application.getCurrentActivity().startActivity(intent);
    }

    public void navigateToKey(){
        Intent intent = new Intent(application.getCurrentActivity(), KeyGroupActivity.class);
        application.getCurrentActivity().startActivity(intent);
    }

    public void navigateToTag(){
        Intent intent = new Intent(application.getCurrentActivity(), TagActivity.class);
        application.getCurrentActivity().startActivity(intent);
    }

    public void navigateToDebit(){
        Intent intent = new Intent(application.getCurrentActivity(), DebitActivity.class);
        application.getCurrentActivity().startActivity(intent);
    }
    public void navigateToOrganization(){
        Intent intent = new Intent(application.getCurrentActivity(), OrganizationActivity.class);
        application.getCurrentActivity().startActivity(intent);
    }
    public void navigateToProject(){
        Intent intent = new Intent(application.getCurrentActivity(), ProjectActivity.class);
        application.getCurrentActivity().startActivity(intent);
    }

    public void navigateToService(){
        Intent intent = new Intent(application.getCurrentActivity(), ServiceActivity.class);
        application.getCurrentActivity().startActivity(intent);
    }
    public void navigateToChangePassword(){
        Intent intent = new Intent(application.getCurrentActivity(), ChangePasswordActivity.class);
        application.getCurrentActivity().startActivity(intent);
    }

    public Boolean checkPermission(String code){
        return Permission.checkPermission(code, MVVMApplication.getPermissions());
    }
    public Observable<ResponseBody> requestKey(PrivateKeyRequest request){
        return repository.getApiService().exportToExcelKey(request);
    }

    public void saveFile2(ResponseBody body){
        try {
            File futureStudioIconFile = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)+File.separator, Constants.KEY_FILE_NAME+DateUtils.getCurrentDateTime()+".txt");
            InputStream inputStream = null;
            OutputStream outputStream = null;
            try {
                byte[] fileReader = new byte[4096];
                inputStream = body.byteStream();

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                    outputStream = Files.newOutputStream(futureStudioIconFile.toPath());
                else
                    outputStream = new FileOutputStream(futureStudioIconFile);
                while (true) {
                    int read = inputStream.read(fileReader);
                    if (read == -1) {
                        break;
                    }
                    outputStream.write(fileReader, 0, read);
                    showSuccessMessage(application.getString(R.string.save_file_success));
                }
                outputStream.flush();
            } catch (IOException e) {
                Timber.d(e);
                showSuccessMessage(application.getString(R.string.save_file_failed));
            } finally {
                if (inputStream != null) {
                    inputStream.close();
                }

                if (outputStream != null) {
                    outputStream.close();
                }
            }
        } catch (IOException e) {
            Timber.d(e);
            showSuccessMessage(application.getString(R.string.save_file_failed));
        }
    }

}
