package com.finance.ui.project.detail;

import android.Manifest;
import android.app.Dialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ArrayAdapter;
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
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.databinding.ActivityProjectDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.tag.adapter.TagColorAdapter;
import com.finance.utils.BindingUtils;
import com.finance.utils.RealPathUtil;
import com.github.dhaval2404.imagepicker.ImagePicker;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import timber.log.Timber;

public class ProjectDetailActivity extends BaseActivity<ActivityProjectDetailBinding, ProjectDetailViewModel>

{
    //Organization
    private ArrayAdapter<String> adapterOrganization;
    private TagColorAdapter adapterTag;
    private List<OrganizationResponse> organizations = new ArrayList<>();
    private List<TagResponse> mListTags;



    @Override
    public int getLayoutId() {
        return R.layout.activity_project_detail;
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
        setupOnClickForAllCbb();
        setupOnItemClickForAllCbb();
        //Call API to get data
        if (Boolean.FALSE.equals(viewModel.isCreated.get())){
            viewModel.getProjectDetails(Objects.requireNonNull(viewModel.project.get()).getId());
        }
        viewModel.getAllOrganization();
        viewModel.getListTags();
        //Get data from API
        getProjectDetail();
        getListTags();
        getListOrganizations();

    }

    private void getDataFromIntent() {
        Objects.requireNonNull(
                viewModel.project.get()).setId(getIntent().getLongExtra(Constants.PROJECT_ID,0));
        viewModel.position.set(getIntent().getIntExtra(Constants.POSITION,0));
        viewModel.isCreated.set(getIntent().getBooleanExtra(Constants.IS_CREATE,false));
        viewModel.isCreated.notifyChange();
    }

    private void setupOnClickForAllCbb() {
        viewBinding.cbbOrganization.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.cbbOrganization.postDelayed(() ->
                    viewBinding.cbbOrganization.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN);
        });
        viewBinding.cbbTag.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.cbbTag.postDelayed(() ->
                    viewBinding.cbbTag.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN);
        });
    }

    private void getListOrganizations() {
        viewModel.organizations.observe(this, organizationResponses -> {
            organizations = organizationResponses;
            List<String> organizationNames = new ArrayList<>();
            for (OrganizationResponse organizationResponse : organizationResponses){
                organizationNames.add(decrypt(organizationResponse.getName()));
            }
            adapterOrganization = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, organizationNames);
            viewBinding.cbbOrganization.setAdapter(adapterOrganization);
            //Check if organization id is null or not
            if (viewModel.projectLiveData.getValue() != null
                    && viewModel.projectLiveData.getValue().getOrganization() != null
                    && viewModel.projectLiveData.getValue().getOrganization().getId() != null) {
                for (int i = 0; i < organizationNames.size(); i++) {
                    if (organizationResponses.get(i).getId().equals(
                            viewModel.projectLiveData.getValue().getOrganization().getId())) {
                        viewBinding.cbbOrganization.setText(adapterOrganization.getItem(i), false);
                        break;
                    }
                }
            }
        });
    }

    private void getProjectDetail() {
        viewModel.projectLiveData.observe(this, projectResponse -> {
            if (projectResponse == null || projectResponse.getId() == null){
                return;
            }
            viewModel.project.set(projectResponse);
            Objects.requireNonNull(viewModel.project.get()).setName(decrypt(projectResponse.getName()));
            Objects.requireNonNull(viewModel.project.get()).setNote(decrypt(projectResponse.getNote()));
            if (projectResponse.getLogo() != null){
                String logo = decrypt(projectResponse.getLogo());
                Objects.requireNonNull(viewModel.project.get()).setLogo(logo);
                BindingUtils.setImageUrlByDrawable(viewBinding.imgLogo, logo, R.drawable.ic_project_default);
            }else
                BindingUtils.setImageUrlByDrawable(viewBinding.imgLogo, null, R.drawable.ic_project_default);
            if (projectResponse.getOrganization() != null){
                viewBinding.cbbOrganization.setText(decrypt(projectResponse.getOrganization().getName()), false);
            }
            viewModel.project.notifyChange();
        });
    }

    private void getListTags() {
        viewModel.tags.observe(this, tagResponses -> {
            if (tagResponses == null || tagResponses.isEmpty()) {
                viewModel.isHaveTag.set(false);
                return;
            }

            for (TagResponse tagResponse : tagResponses) {
                tagResponse.setName(decrypt(tagResponse.getName()));
                tagResponse.setColorCode(decrypt(tagResponse.getColorCode()));
            }
            mListTags = tagResponses;
            adapterTag = new TagColorAdapter(this, tagResponses);
            viewBinding.cbbTag.setAdapter(adapterTag);

            if (Boolean.FALSE.equals(viewModel.isCreated.get())) {
                //Check if transaction group id is null or not
                if (Objects.requireNonNull(viewModel.project.get()).getTag().getId() != null) {
                    for (int i = 0; i < tagResponses.size(); i++) {
                        if (tagResponses.get(i).getId().equals(
                                Objects.requireNonNull(viewModel.project.get()).getTag().getId())) {
                            viewBinding.layoutColor.setVisibility(View.VISIBLE);
                            viewBinding.cbbTag.setText(Objects.requireNonNull(adapterTag.getItem(i)).getName(), false);
                            viewBinding.layoutColor.setColorFilter(Color.parseColor(Objects.requireNonNull(adapterTag.getItem(i)).getColorCode()));
                            break;
                        }
                    }
                }
            }

        });
    }

    private void setupOnItemClickForAllCbb() {
        viewBinding.cbbOrganization.setOnItemClickListener((adapterView, view, position, id) -> {
            Objects.requireNonNull(viewModel.project.get()).setOrganization(organizations.get(position));
            hideKeyboard();
        });
        viewBinding.cbbTag.setOnItemClickListener((adapterView, view, i, l) -> {
            Objects.requireNonNull(viewModel.project.get()).getTag().setId(mListTags.get(i).getId());
            viewBinding.layoutColor.setVisibility(View.VISIBLE);
            viewBinding.cbbTag.setText(mListTags.get(i).getName(), false);
            viewBinding.layoutColor.setColorFilter(Color.parseColor(mListTags.get(i).getColorCode()));
            hideKeyboard();
        });
    }


    public void createOrUpdate(){
        //Handle right organization
        if (!viewBinding.cbbOrganization.getText().toString().isEmpty()){
            for (OrganizationResponse organizationResponse : organizations) {
                if (decrypt(organizationResponse.getName()).equals(viewBinding.cbbOrganization.getText().toString())){
                    viewModel.isRightOrganization.set(true);
                    break;
                }
            }
        }
        else{
            Objects.requireNonNull(viewModel.project.get()).setOrganization(null);
            viewModel.isRightOrganization.set(true);
        }

        //Handle right tag
        if (!viewBinding.cbbTag.getText().toString().isEmpty()){
            for (TagResponse tagResponse : mListTags) {
                if (tagResponse.getName().equals(viewBinding.cbbTag.getText().toString())){
                    viewModel.isRightTag.set(true);
                    break;
                }
            }
        }
        else{
            Objects.requireNonNull(viewModel.project.get()).getTag().setId(null);
            viewModel.isRightTag.set(true);
        }

        if(Boolean.TRUE.equals(viewModel.isCreated.get()))
            viewModel.createProject();
        else
            viewModel.updateProject();
        hideKeyboard();
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
            if (ContextCompat.checkSelfPermission(ProjectDetailActivity.this, Manifest.permission.READ_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED)
            {
                ActivityCompat.requestPermissions(ProjectDetailActivity.this,
                        new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, Constants.STORAGE_REQUEST);

            } else {
                openGallery();
            }

        });
        btnCamera.setOnClickListener(v -> {
            // Camera option clicked
            dialog.dismiss();
            if (ContextCompat.checkSelfPermission(ProjectDetailActivity.this, Manifest.permission.CAMERA)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(ProjectDetailActivity.this,
                        new String[]{Manifest.permission.CAMERA}, Constants.CAMERA_REQUEST);
            } else {
                openCamera();
            }
        });
        dialog.show();
    }

    private void openGallery() {
        ImagePicker.with(ProjectDetailActivity.this)
                .galleryOnly()
                .cropSquare()
                .start();
    }

    private void openCamera() {
        ImagePicker.with(ProjectDetailActivity.this)
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
