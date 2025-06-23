package com.finance.ui.organization.detail;

import android.Manifest;
import android.app.Dialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.widget.RelativeLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.databinding.ActivityOrganizationDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.utils.BindingUtils;
import com.finance.utils.RealPathUtil;
import com.github.dhaval2404.imagepicker.ImagePicker;

import java.io.File;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import timber.log.Timber;

public class OrganizationDetailActivity extends BaseActivity<ActivityOrganizationDetailBinding, OrganizationDetailViewModel> {
    
    @Override
    public int getLayoutId() {
        return R.layout.activity_organization_detail;
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

        viewModel.id.set(getIntent().getLongExtra(Constants.ORGANIZATION_ID,0));
        viewModel.position.set(getIntent().getIntExtra(Constants.POSITION,0));
        viewModel.isCreate.set(getIntent().getBooleanExtra(Constants.IS_CREATE,false));

        viewModel.getOrganizationDetails(viewModel.id.get());

        //Get organization detail from API
        getOrganizationDetail();
    }

    private void getOrganizationDetail() {
        viewModel.organization.observe(this, organizationResponse -> {
            if (organizationResponse != null){
                String name = decrypt(organizationResponse.getName());
                viewModel.name.set(name);
                if (organizationResponse.getLogo() != null){
                    String logo = decrypt(organizationResponse.getLogo());
                    viewModel.logo.set(logo);
                    BindingUtils.setImageUrl(viewBinding.imgLogo, logo);
                } else
                    BindingUtils.setImageUrl(viewBinding.imgLogo, null);
            }
        });
    }

    public void doDone(){
        if(Boolean.TRUE.equals(viewModel.isCreate.get())){
            createOrganization();
        }else {
            updateOrganization();
        }
        hideKeyboard();
    }
    public void createOrganization(){
        viewModel.name.set(viewBinding.editOrganizationName.getText().toString());
        viewModel.createOrganization();
    }

    public void updateOrganization(){
        viewModel.name.set(viewBinding.editOrganizationName.getText().toString());
        viewModel.updateOrganization();
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
            if (ContextCompat.checkSelfPermission(OrganizationDetailActivity.this, Manifest.permission.READ_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED)
            {
                ActivityCompat.requestPermissions(OrganizationDetailActivity.this,
                        new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, Constants.STORAGE_REQUEST);

            } else {
                openGallery();
            }

        });
        btnCamera.setOnClickListener(v -> {
            // Camera option clicked
            dialog.dismiss();
            if (ContextCompat.checkSelfPermission(OrganizationDetailActivity.this, Manifest.permission.CAMERA)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(OrganizationDetailActivity.this,
                        new String[]{Manifest.permission.CAMERA}, Constants.CAMERA_REQUEST);
            } else {
                openCamera();
            }
        });
        dialog.show();
    }

    private void openGallery() {
        ImagePicker.with(OrganizationDetailActivity.this)
                .galleryOnly()
                .cropSquare()
                .start();
    }

    private void openCamera() {
        ImagePicker.with(OrganizationDetailActivity.this)
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
                MultipartBody.Part imagePart = uriToMultipartBodyPart(selectedImageUri, this.getResources().getString(R.string.file));
                Glide.with(this)
                        .load(selectedImageUri)
                        .diskCacheStrategy(DiskCacheStrategy.NONE)
                        .skipMemoryCache(true)
                        .into(viewBinding.imgLogo);
                // Call API to upload image
                viewModel.uploadLogo(imagePart);
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
            RequestBody requestFile = RequestBody.create( file, MediaType.parse("multipart/form-data"));
            return MultipartBody.Part.createFormData(partName, file.getName(), requestFile);
        } catch (Exception e) {
            Timber.e(e);
            return null;
        }
    }
}
