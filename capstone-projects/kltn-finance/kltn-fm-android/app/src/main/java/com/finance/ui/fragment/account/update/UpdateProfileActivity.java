package com.finance.ui.fragment.account.update;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.text.method.PasswordTransformationMethod;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.databinding.Observable;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.databinding.ActivityProfileUpdateBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.utils.BindingUtils;
import com.finance.utils.DateUtils;
import com.finance.utils.RealPathUtil;
import com.github.dhaval2404.imagepicker.ImagePicker;

import java.io.File;
import java.util.Calendar;
import java.util.Objects;


import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import timber.log.Timber;

public class UpdateProfileActivity extends BaseActivity<ActivityProfileUpdateBinding, UpdateProfileViewModel> {

    @Override
    public int getLayoutId() {
        return R.layout.activity_profile_update;
    }

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    public void performDependencyInjection(ActivityComponent buildComponent) {
        buildComponent.inject(this);
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getDataFromIntent();
        setupIsShowPassWord();
        addOnTextChangePickBirthDay();
    }

    public void updateProfile(){
        if (!viewBinding.editAddress.getText().toString().isEmpty())
            Objects.requireNonNull(viewModel.profile.get()).setAddress(viewBinding.editAddress.getText().toString());
        else
            Objects.requireNonNull(viewModel.profile.get()).setAddress(null);
        if (viewBinding.pickBirthDay.getText().toString().isEmpty())
            Objects.requireNonNull(viewModel.profile.get()).setBirthDate(null);

        viewModel.doUpdateProfile();
    }

    private void setupIsShowPassWord() {
        viewModel.isShowPassword.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                int pos = viewBinding.editPassword.getSelectionStart();
                if(Boolean.FALSE.equals(viewModel.isShowPassword.get())){
                    viewBinding.editPassword.setTransformationMethod(PasswordTransformationMethod.getInstance());
                }else {
                    viewBinding.editPassword.setTransformationMethod(null);
                }
                viewBinding.editPassword.setSelection(pos);

            }
        });
    }

    private void getDataFromIntent() {
        //Get data from AccountFragment
        Bundle bundle = getIntent().getExtras();
        if (bundle!=null){
            AccountResponse accountResponse = (AccountResponse) bundle.getSerializable(Constants.ACCOUNT_RESPONSE);
            viewModel.accountResponseFromIntent.set(accountResponse);
            Objects.requireNonNull(viewModel.profile.get()).setUpdateProfileRequest(
                    Objects.requireNonNull(accountResponse));
            BindingUtils.setImageUrl(viewBinding.imgAvatar,
                    Objects.requireNonNull(viewModel.profile.get()).getAvatarPath());
            viewModel.profile.notifyChange();
        }
        if (Objects.requireNonNull(viewModel.profile.get()).getBirthDate() == null
                || Objects.requireNonNull(viewModel.profile.get()).getBirthDate().isEmpty()){
            viewModel.isHasBirthDay.set(false);
        } else{
            viewModel.isHasBirthDay.set(true);
        }
        if (Objects.requireNonNull(viewModel.profile.get()).getBirthDate() != null
                && !Objects.requireNonNull(viewModel.profile.get()).getBirthDate().isEmpty()
            && !Objects.requireNonNull(viewModel.profile.get()).getBirthDate().isEmpty()
        ){
            String date = DateUtils.convertFromUTCToDefaultApi(Objects.requireNonNull(viewModel.profile.get()).getBirthDate());
            Objects.requireNonNull(viewModel.profile.get()).setBirthDate(date);
            viewModel.profile.notifyChange();
        }


    }

    private void addOnTextChangePickBirthDay() {
        viewBinding.pickBirthDay.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                if (viewBinding.pickBirthDay.getText().toString().isEmpty())
                    viewModel.isHasBirthDay.set(false);
                else
                    viewModel.isHasBirthDay.set(true);
            }
            @Override
            public void afterTextChanged(Editable editable) {

            }
        });
    }

    public void pickBirthDay(){
        if (viewBinding.pickBirthDay.getText().toString().isEmpty()){
            Calendar calendar = Calendar.getInstance();
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONTH);
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            String dateMonthYearCurrent = day + "/" + (month + 1) + "/" + year;
            showDatePickerDialog(dateMonthYearCurrent + " 00:00:00");
        }
        else
            showDatePickerDialog(viewBinding.pickBirthDay.getText().toString() + " 00:00:00");

    }

    private void showDatePickerDialog(String dateTime) {
        String date = DateUtils.getDayMonthYear(dateTime);
        int day = Integer.parseInt(date.split("/")[0]);
        int month = Integer.parseInt(date.split("/")[1]) - 1;
        int year = Integer.parseInt(date.split("/")[2]);
        //Pick current date as default
        DatePickerDialog dialog = new DatePickerDialog(this, (datePicker, year1, month1, day1) -> {
            @SuppressLint("DefaultLocale")
            String date1 = String.format("%02d/%02d/%04d", day1, month1 + 1, year1);
            viewBinding.pickBirthDay.setText(date1);
            String dateUTC = DateUtils.convertFromDefaultToUTCApi(date1 + " 00:00:00");
            Objects.requireNonNull(viewModel.profile.get()).setBirthDate(dateUTC);
        }, year, month, day); //Pass year, month and day to date picker

        dialog.getDatePicker().setMaxDate(System.currentTimeMillis());
        dialog.show(); //Show dialog
    }

    public void showDialogChooseImage() {
        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_image_picker);
        Window window = dialog.getWindow();
        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);

        RelativeLayout btnGallery = dialog.findViewById(R.id.btn_galery);
        RelativeLayout btnCamera = dialog.findViewById(R.id.btn_camera);
        btnGallery.setOnClickListener(v -> {
            // Gallery option clicked
            dialog.dismiss();
            if (ContextCompat.checkSelfPermission(UpdateProfileActivity.this, Manifest.permission.READ_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED)
            {
                ActivityCompat.requestPermissions(UpdateProfileActivity.this,
                        new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, Constants.STORAGE_REQUEST);

            } else {
                openGallery();
            }

        });
        btnCamera.setOnClickListener(v -> {
            // Camera option clicked
            dialog.dismiss();
            if (ContextCompat.checkSelfPermission(UpdateProfileActivity.this, Manifest.permission.CAMERA)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(UpdateProfileActivity.this,
                        new String[]{Manifest.permission.CAMERA}, Constants.CAMERA_REQUEST);
            } else {
                openCamera();
            }
        });
        dialog.show();
    }

    private void openGallery() {
        ImagePicker.with(UpdateProfileActivity.this)
                .galleryOnly()
                .cropSquare()
                .start();
    }

    private void openCamera() {
        ImagePicker.with(UpdateProfileActivity.this)
                .cameraOnly()
                .cropSquare()
                .start();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
         if (requestCode == ImagePicker.REQUEST_CODE) {
            if (resultCode == RESULT_OK && data != null) {
                Uri selectedImageUri = data.getData();
                Glide.with(this)
                        .load(selectedImageUri)
                        .diskCacheStrategy(DiskCacheStrategy.NONE)
                        .skipMemoryCache(true)
                        .into(viewBinding.imgAvatar);
                MultipartBody.Part imagePart = uriToMultipartBodyPart(selectedImageUri, this.getResources().getString(R.string.file));
                // Call API to upload image
                viewModel.doUploadAvatar(imagePart);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == Constants.STORAGE_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openGallery();
            } else {
                Toast.makeText(this, getResources().getString(R.string.not_permission_gallery), Toast.LENGTH_SHORT).show();
            }
        } else if (requestCode == Constants.CAMERA_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openCamera();
            } else {
                Toast.makeText(this, getResources().getString(R.string.not_permission_camera), Toast.LENGTH_SHORT).show();
            }
        }
    }

    private MultipartBody.Part uriToMultipartBodyPart(Uri uri, String partName) {
        try {
            File file = new File(RealPathUtil.getRealPath(this, uri));
            RequestBody requestFile = RequestBody.create(file, MediaType.parse("multipart/form-data"));
            return MultipartBody.Part.createFormData(partName, file.getName(), requestFile);
        } catch (Exception e) {
            Timber.e(e);
            return null;
        }
    }

    @Override
    public void onBackPressed() {
        // Show Dialog custom
        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_continue);
        Window window = dialog.getWindow();
        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));

        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);

        Button btnContinue = dialog.findViewById(R.id.btn_continue);
        Button btnExit = dialog.findViewById(R.id.btn_exit);

        btnContinue.setOnClickListener(v -> dialog.dismiss());

        btnExit.setOnClickListener(v -> {
            dialog.dismiss();
            super.onBackPressed();
        });
        dialog.show();
    }

}
