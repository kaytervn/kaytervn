package com.finance.ui.fragment.account;


import static android.app.Activity.RESULT_OK;

import android.Manifest;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.request.account.UpdateProfileRequest;
import com.finance.data.model.api.request.privatekey.PrivateKeyRequest;
import com.finance.databinding.FragmentAccountBinding;
import com.finance.di.component.FragmentComponent;
import com.finance.ui.base.BaseFragment;
import com.finance.ui.chat.ChatActivity;
import com.finance.ui.dialog.DownLoadDialog;
import com.finance.ui.fragment.account.update.UpdateProfileActivity;
import com.finance.ui.scanner.CustomScanner;
import com.finance.ui.scanner.WebQRCodeRequest;
import com.finance.utils.BindingUtils;
import com.finance.utils.DateUtils;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.NotFoundException;
import com.google.zxing.RGBLuminanceSource;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;
import com.journeyapps.barcodescanner.ScanContract;
import com.journeyapps.barcodescanner.ScanOptions;

import org.json.JSONObject;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Date;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;
import okhttp3.ResponseBody;
import retrofit2.HttpException;
import timber.log.Timber;

public class AccountFragment extends BaseFragment<FragmentAccountBinding, AccountFragmentViewModel>
        implements DownLoadDialog.Listener
{
    //Set up activityResultLauncher for update profile
    ActivityResultLauncher<Intent> activityResultLauncher =
            getIntentActivityResultLauncher();

    DownLoadDialog downLoadDialog;

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    protected int getLayoutId() {
        return R.layout.fragment_account;
    }

    @Override
    protected void performDataBinding() {
        viewModel.filePath.observe(this, filePath -> {
            if (filePath != null) {
                BindingUtils.setImageUrl(binding.imgAccountIcon,
                        Objects.requireNonNull(viewModel.profile.get()).getAvatarPath());
            }
        });
    }

    public void goToUpdateProfile(){
        Intent intent = new Intent(getActivity(), UpdateProfileActivity.class);
        Bundle bundle = new Bundle();
        bundle.putSerializable(Constants.ACCOUNT_RESPONSE, viewModel.profile.get());
        intent.putExtras(bundle);
        activityResultLauncher.launch(intent);
    }

    @Override
    protected void performDependencyInjection(FragmentComponent buildComponent) {
        buildComponent.inject(this);
    }

    public void requestKey(){
        viewModel.showLoading();
        if (downLoadDialog.password.get() == null || Objects.requireNonNull(downLoadDialog.password.get()).isEmpty()) {
            viewModel.showErrorMessage(getString(R.string.invalid_password));
            viewModel.hideLoading();
            return;
        }
        compositeDisposable.add(viewModel.requestKey(
                new PrivateKeyRequest(downLoadDialog.password.get()))
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                    response -> {
                        viewModel.fileContent = response;
                        if (android.os.Build.VERSION.SDK_INT == android.os.Build.VERSION_CODES.Q) {
                            saveFileToDownloads(response);
                        }else {
                            viewModel.saveFile2(response);
                        }
                        downLoadDialog.dismiss();
                        viewModel.hideLoading();
                    },
                    throwable -> {
                        viewModel.hideLoading();
                        if (throwable instanceof HttpException) {
                            // Handle HTTP errors
                            HttpException httpException = (HttpException) throwable;
                            ResponseBody errorBody = Objects.requireNonNull(httpException.response()).errorBody();
                            try {
                                if (errorBody != null) {
                                    String errorResponse = errorBody.string();
                                    // Parse the error response (JSON parsing example)
                                    JSONObject jsonObject = new JSONObject(errorResponse);
//                                    String code = jsonObject.optString(getString(R.string.code), getString(R.string.unknown_code));
                                    String message = jsonObject.optString(getString(R.string.message), getString(R.string.unknown_code));
                                    // Log and display a specific error message
                                    if (message.equals(getString(R.string.wrong_password_eng))) {
                                        viewModel.showErrorMessage(getString(R.string.wrong_password));
                                    } else {
                                        viewModel.showErrorMessage(message);
                                    }
                                }
                            } catch (Exception e) {
                                viewModel.showErrorMessage(getString(R.string.no_internet));
                            }
                        } else {

                            viewModel.showErrorMessage(getString(R.string.no_internet));
                        }
                    }
            ));
    }

    public void checkFilePermission(){
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q &&
                ContextCompat.checkSelfPermission(requireContext(),
                        Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED &&
                ContextCompat.checkSelfPermission(requireContext(),
                        Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {

            ActivityResultLauncher<String[]> requestPermissionLauncher = registerForActivityResult(
                    new ActivityResultContracts.RequestMultiplePermissions(),
                    isGranted -> {
                        if (isGranted.containsValue(Boolean.FALSE)) {
                            Toast.makeText(getActivity(),
                                    getString(R.string.permission_storage_denied),
                                    Toast.LENGTH_SHORT).show();
                        } else {
                            confirmDownloadFile();
                        }
                    });

            requestPermissionLauncher.launch( new String[]{
                    Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.READ_EXTERNAL_STORAGE
            });
        }else {
            confirmDownloadFile();
        }
    }

    public void confirmDownloadFile(){
        downLoadDialog = new DownLoadDialog();
        downLoadDialog.setListener(this);
        downLoadDialog.show(getChildFragmentManager(), "Download File");
    }

    @Override
    public void confirm() {
        requestKey();
    }

    @Override
    public void cancel() {

    }

    @NonNull
    private ActivityResultLauncher<Intent> getIntentActivityResultLauncher() {
        return registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                activityResult -> {
                    int result = activityResult.getResultCode();
                    Intent data = activityResult.getData();
                    if (result == RESULT_OK && data != null) {
                        //Get data from UpdateProfileActivity
                        Bundle bundle = data.getExtras();
                        UpdateProfileRequest updateProfileRequest
                                = (UpdateProfileRequest) Objects.requireNonNull(bundle).getSerializable(Constants.UPDATE_PROFILE);
                        Objects.requireNonNull(viewModel.profile.get()).setAccountResponse(Objects.requireNonNull(updateProfileRequest));
                        viewModel.profile.notifyChange();
                        //Get avatarPath from UpdateProfileActivity
                        if (viewModel.profile.get() != null
                                && Objects.requireNonNull(viewModel.profile.get()).getAvatarPath() != null) {
                            BindingUtils.setImageUrl(binding.imgAccountIcon,
                                    Objects.requireNonNull(viewModel.profile.get()).getAvatarPath());
                        }
                    }
                }
        );
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    private void saveFileToDownloads(ResponseBody body) {
        ContentResolver resolver = requireActivity().getContentResolver();
        ContentValues contentValues = new ContentValues();
        contentValues.put(MediaStore.MediaColumns.DISPLAY_NAME, Constants.KEY_FILE_NAME + DateUtils.getCurrentDateTime() + ".txt");
        contentValues.put(MediaStore.MediaColumns.MIME_TYPE, "text/plain");
        contentValues.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
        Uri uri = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues);
        }

        if (uri != null) {
            try (OutputStream outputStream = resolver.openOutputStream(uri)) {
                byte[] fileReader = new byte[4096];
                InputStream inputStream = body.byteStream();
                while (true) {
                    int read = inputStream.read(fileReader);
                    if (read == -1) {
                        break;
                    }
                    Objects.requireNonNull(outputStream).write(fileReader, 0, read);
                }
                Objects.requireNonNull(outputStream).flush();
                viewModel.showSuccessMessage(getString(R.string.save_file_success));
            } catch (IOException e) {
                Timber.d(e);
                viewModel.showSuccessMessage(getString(R.string.save_file_failed));
            }
        }
    }

    private int scanType;
    private static final int REQUEST_OPEN_SCAN_QRCODE = 2309;
    private static final int REQUEST_OPEN_SCAN_QRCODE_FROM_PC = 2139;

    private void scanQrCodeFromGallery(){
        Intent pickIntent = new Intent(Intent.ACTION_PICK);
        pickIntent.setDataAndType( android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");

        galleryI.launch(pickIntent);
    }

    private final ActivityResultLauncher<ScanOptions> scan = registerForActivityResult(new ScanContract(), result -> {
        if (scanType == REQUEST_OPEN_SCAN_QRCODE) {
            Timber.d("Handle request from mobile");
            if (result.getOriginalIntent()!=null && result.getOriginalIntent().getExtras() != null && result.getOriginalIntent().getExtras().getBoolean("gallery")) {
                scanQrCodeFromGallery();
            } else {
                handleQRCode(result.getContents());
            }
        } else if (scanType == REQUEST_OPEN_SCAN_QRCODE_FROM_PC) {
            Timber.d("Handle request from pc");
            handleQRCodeFromPC(result.getContents());
        }
    });

    private final ActivityResultLauncher<Intent> galleryI = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
        if  (result.getData() == null){
            return;
        }
        Uri uri = result.getData().getData();
        try
        {
            InputStream inputStream = getActivity().getContentResolver().openInputStream(uri);
            Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
            if (bitmap == null)
            {
                Log.e("TAG", "uri is not a bitmap," + uri.toString());
                return;
            }
            int width = bitmap.getWidth(), height = bitmap.getHeight();
            int[] pixels = new int[width * height];
            bitmap.getPixels(pixels, 0, width, 0, 0, width, height);
            bitmap.recycle();
            bitmap = null;
            RGBLuminanceSource source = new RGBLuminanceSource(width, height, pixels);
            BinaryBitmap bBitmap = new BinaryBitmap(new HybridBinarizer(source));
            MultiFormatReader reader = new MultiFormatReader();
            try
            {
                Result resultX = reader.decode(bBitmap);
                handleQRCode(resultX.getText());
            }
            catch (NotFoundException e)
            {
                viewModel.showErrorMessage(getString(R.string.qr_code_not_found_gallery));
            }
        }
        catch (FileNotFoundException e)
        {
            viewModel.showErrorMessage(getString(R.string.gallery_open_error));
        }
    });

    private void handleQRCode(String result){
        if (result == null) {
            viewModel.showErrorMessage(getString(R.string.scan_qr_code_cancelled));
//            openScanQRCode(REQUEST_OPEN_SCAN_QRCODE);
        } else {
            try {
                doVerifyQRCode(result);
            } catch (IndexOutOfBoundsException e) {
                viewModel.showErrorMessage(getString(R.string.qr_code_wrong_format));
            }
        }
    }

    private void doVerifyQRCode(String message) {
        Timber.d("Verify QR Code");
        Timber.d(message);
        String[] parts = message.split(";");
        // TODO
        viewModel.verifyQrcode(message);
    }

    private void handleQRCodeFromPC(String result){
        viewModel.showSuccessMessage(getString(R.string.scan_qr_success));
        sendQRCodeToWebView(result);
    }
    private void sendQRCodeToWebView(String qrCode ){
        Timber.d("Send to qrcode pc: %s", qrCode);
        WebQRCodeRequest webQRCodeRequest = new WebQRCodeRequest(qrCode);
    }

    public void openScanQRCode(int requestOpenScanQrcode) {
        scanType = requestOpenScanQrcode;
        ScanOptions integrator = new ScanOptions();
        integrator.setCaptureActivity(CustomScanner.class);
        integrator.setDesiredBarcodeFormats(ScanOptions.QR_CODE);
        integrator.setCameraId(0);  // Use a specific camera of the device
        integrator.setPrompt("");
        integrator.setBeepEnabled(false);
        integrator.setBarcodeImageEnabled(true);
        scan.launch(integrator);
    }

    public void navigateToChatActivity() {
        Intent intent = new Intent(getActivity(), ChatActivity.class);
        startActivity(intent);
    }

    public void scanQrCode() {
        openScanQRCode(REQUEST_OPEN_SCAN_QRCODE);
    }
}