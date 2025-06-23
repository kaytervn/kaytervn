package com.finance.ui.key.details;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.text.method.PasswordTransformationMethod;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.databinding.Observable;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.ui.document.adapter.DocumentAdapter;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.finance.data.model.api.response.key.GoogleKey;
import com.finance.data.model.api.response.key.KeyGroupResponse;
import com.finance.data.model.api.response.key.ServerKey;
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.databinding.ActivityKeyInfoDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.tag.adapter.TagColorAdapter;
import com.finance.utils.FileUtils;
import com.finance.utils.RealPathUtil;
import com.github.dhaval2404.imagepicker.ImagePicker;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import eu.davidea.flexibleadapter.databinding.BR;
import okhttp3.MultipartBody;

public class KeyDetailsActivity extends BaseActivity<ActivityKeyInfoDetailBinding, KeyDetailsViewModel>
{
    List<String> kindNames = new ArrayList<>();
    ArrayAdapter<String> adapterKind;

    ArrayAdapter<String> keyGroupAdapter;
    ArrayAdapter<String> organizationAdapter;
    private TagColorAdapter adapterTag;
    //Document
    private List<DocumentResponse> mListDocumentResponses = new ArrayList<>();
    private DocumentAdapter mDocumentAdapter;
    private DocumentResponse currentDocument;
    private List<TagResponse> mListTags;

    private Integer currentDocumentPosition = -1;

    @Override
    public int getLayoutId() {
        return R.layout.activity_key_info_detail;
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


        viewModel.id.set(getIntent().getLongExtra(Constants.KEY_ID,0));
        if(Objects.requireNonNull(viewModel.id.get()) != 0
                && !getIntent().getBooleanExtra(Constants.IS_CREATE,false)
        ){
            viewModel.getKeyDetails(viewModel.id.get());
        }
        viewModel.getKeyGroup();
        viewModel.getOrganizations();
        viewModel.isCreated.set(getIntent().getBooleanExtra(Constants.IS_CREATE,false));
        viewModel.getListTags();

        setupDocumentAdapter();
        setupOnClickForAllCbb();
        setupOnItemClickForAllCbb();
        getListKeyGroups();
        getListOrganizations();
        getListTags();
        getKeyDetail();
        getUploadDocument();
        showPassword();

    }

    private void setupOnClickForAllCbb() {
        viewBinding.dropdownGroup.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.dropdownGroup.postDelayed(() ->
                    viewBinding.dropdownGroup.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN);
        });
        viewBinding.dropdownOrganization.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.dropdownOrganization.postDelayed(
                    () -> viewBinding.dropdownOrganization.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN
            );
        });
        viewBinding.cbbTag.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.cbbTag.postDelayed(() ->
                    viewBinding.cbbTag.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN
            );
        });
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getUploadDocument() {
        viewModel.filePath.observe(this, filePath -> {
            if (filePath != null && !filePath.isEmpty()){
                currentDocument.setUrl(filePath);
                //Check if user update file or not
                if (currentDocumentPosition != -1) {
                    mListDocumentResponses.set(currentDocumentPosition, currentDocument);
                    mDocumentAdapter.setListDocument(mListDocumentResponses);
                    currentDocumentPosition = -1;
                }
                else {
                    mListDocumentResponses.add(currentDocument);
                    mDocumentAdapter.setListDocument(mListDocumentResponses);
                }
                mDocumentAdapter.notifyDataSetChanged();
            }
        });
    }

    private void getKeyDetail() {
        viewModel.keyResponse.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                viewModel.kind.set(Objects.requireNonNull(viewModel.keyResponse.get()).getKind());
                viewModel.name.set(decrypt(Objects.requireNonNull(viewModel.keyResponse.get()).getName()));
                viewModel.description.set(decrypt(Objects.requireNonNull(viewModel.keyResponse.get()).getDescription()));
                //Parse json document from Intent
                if (Objects.requireNonNull(viewModel.keyResponse.get()).getDocument() != null && !Objects.requireNonNull(viewModel.keyResponse.get()).getDocument().isEmpty())
                {
                    Type listType = new TypeToken<List<DocumentResponse>>(){}.getType();
                    Gson gson = new Gson();
                    mListDocumentResponses = gson.fromJson(decrypt(Objects.requireNonNull(viewModel.keyResponse.get()).getDocument()), listType);
                    mDocumentAdapter.setListDocument(mListDocumentResponses);
                    mDocumentAdapter.notifyDataSetChanged();
                }
                if(Objects.requireNonNull(viewModel.keyResponse.get()).getKind() == 1){
                    viewBinding.dropdownKind.setText(adapterKind.getItem(0), false);
                    if(Objects.requireNonNull(viewModel.keyResponse.get()).getAdditionalInformation() != null && !Objects.requireNonNull(viewModel.keyResponse.get()).getAdditionalInformation().isEmpty() ){
                        viewModel.serverKey.set(ApiModelUtils.fromJson(decrypt(Objects.requireNonNull(viewModel.keyResponse.get()).getAdditionalInformation()), ServerKey.class));
                    }
                } else {
                    viewBinding.dropdownKind.setText(adapterKind.getItem(1), false);
                    if(Objects.requireNonNull(viewModel.keyResponse.get()).getAdditionalInformation() != null && !Objects.requireNonNull(viewModel.keyResponse.get()).getAdditionalInformation().isEmpty() ){
                        viewModel.ggKey.set(ApiModelUtils.fromJson(decrypt(Objects.requireNonNull(viewModel.keyResponse.get()).getAdditionalInformation()), GoogleKey.class));
                    }
                }

            }
        });
    }

    private void setupDocumentAdapter() {
        mDocumentAdapter = new DocumentAdapter(mListDocumentResponses, new DocumentAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int pos) {
                currentDocumentPosition = pos;
                showDialogChooseFile();
            }

            @Override
            public void onDeleteClick(View view, int pos) {
                deleteDocumentAt( pos);
            }
        });
        viewBinding.rcvDocuments.setAdapter(mDocumentAdapter);
        viewBinding.rcvDocuments.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));
    }

    private void setupOnItemClickForAllCbb(){
        kindNames.add(getString(R.string.server));
        kindNames.add(getString(R.string.google));
        adapterKind = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, kindNames);
        viewBinding.dropdownKind.setAdapter(adapterKind);
        viewBinding.dropdownKind.setOnItemClickListener((parent, view, position, id) -> {
            if (position == 0){
                Objects.requireNonNull(viewModel.keyResponse.get()).setKind(1);
                viewModel.kind.set(1);
            } else {
                Objects.requireNonNull(viewModel.keyResponse.get()).setKind(2);
                viewModel.kind.set(2);
            }
        });
        viewBinding.dropdownGroup.setOnItemClickListener((parent, view, position, id) ->
                Objects.requireNonNull(viewModel.keyResponse.get()).setKeyInformationGroup(
                        Objects.requireNonNull(viewModel.keyGroups.getValue()).get(position)));

        viewBinding.dropdownOrganization.setOnItemClickListener((parent, view, position, id) ->
                Objects.requireNonNull(viewModel.keyResponse.get()).setOrganization(
                        Objects.requireNonNull(viewModel.organizationResponses.getValue()).get(position)));

        viewBinding.cbbTag.setOnItemClickListener((adapterView, view, i, l) -> {
            Objects.requireNonNull(viewModel.keyResponse.get()).getTag().setId(mListTags.get(i).getId());
            viewBinding.layoutColor.setVisibility(View.VISIBLE);
            viewBinding.cbbTag.setText(mListTags.get(i).getName(), false);
            viewBinding.layoutColor.setColorFilter(Color.parseColor(mListTags.get(i).getColorCode()));
            hideKeyboard();
        });

    }

    private void getListOrganizations(){
        viewModel.organizationResponses.observe(this, organizationResponses -> {
            List<String> names = new ArrayList<>();
            for (OrganizationResponse response : organizationResponses) {
                names.add(decrypt(response.getName()));
            }
            organizationAdapter = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, names);
            viewBinding.dropdownOrganization.setAdapter(organizationAdapter);
            if(Objects.requireNonNull(viewModel.keyResponse.get()).getOrganization()!=null){
                for(int i = 0; i < Objects.requireNonNull(viewModel.organizationResponses.getValue()).size(); i++){
                    if(viewModel.organizationResponses.getValue().get(i).getId().equals(
                            Objects.requireNonNull(viewModel.keyResponse.get()).getOrganization().getId())){
                        viewBinding.dropdownOrganization.setText(organizationAdapter.getItem(i), false);
                        return;
                    }
                }
            }
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

            if (Boolean.FALSE.equals(viewModel.isCreated.get())){
                //Check if transaction group id is null or not
                if (Objects.requireNonNull(viewModel.keyResponse.get()).getTag().getId() != null){
                    for (int i = 0; i < tagResponses.size(); i++) {
                        if (tagResponses.get(i).getId().equals(
                                Objects.requireNonNull(viewModel.keyResponse.get()).getTag().getId())) {
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

    private void getListKeyGroups(){
        viewModel.keyGroups.observe(this, keyGroupResponses -> {
            List<String> names = new ArrayList<>();
            for (KeyGroupResponse response : keyGroupResponses) {
                names.add(decrypt(response.getName()));
            }
            keyGroupAdapter = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, names);
            viewBinding.dropdownGroup.setAdapter(keyGroupAdapter);

            if(Boolean.TRUE.equals(viewModel.isCreated.get())){
                viewBinding.dropdownKind.setText(adapterKind.getItem(0), false);
                Objects.requireNonNull(viewModel.keyResponse.get()).setKind(1);
                viewModel.kind.set(1);
            }

            if(Objects.requireNonNull(viewModel.keyResponse.get()).getKeyInformationGroup()!=null){
                for(int i = 0; i < Objects.requireNonNull(viewModel.keyGroups.getValue()).size(); i++){
                    if(viewModel.keyGroups.getValue().get(i).getId().equals(Objects.requireNonNull(viewModel.keyResponse.get()).getKeyInformationGroup().getId())){
                        viewBinding.dropdownGroup.setText(Objects.requireNonNull(keyGroupAdapter.getItem(i)), false);
                        return;
                    }
                }
            }
        });
    }

    private void showPassword(){
        viewModel.isShowPassword.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                if(Objects.requireNonNull(viewModel.kind.get()) == 1){
                    int pos = viewBinding.editPassword.getSelectionStart();
                    if(Boolean.FALSE.equals(viewModel.isShowPassword.get())){
                        viewBinding.editPassword.setTransformationMethod(PasswordTransformationMethod.getInstance());
                    }else {
                        viewBinding.editPassword.setTransformationMethod(null);
                    }
                    viewBinding.editPassword.setSelection(pos);
                }else {
                    int pos = viewBinding.editPassword1.getSelectionStart();
                    if(Boolean.FALSE.equals(viewModel.isShowPassword.get())){
                        viewBinding.editPassword1.setTransformationMethod(PasswordTransformationMethod.getInstance());
                    }else {
                        viewBinding.editPassword1.setTransformationMethod(null);
                    }
                    viewBinding.editPassword1.setSelection(pos);
                }

            }
        });
    }

    public void showDialogChooseFile() {
        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_file_picker);
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
            // Check multiple permissions
            boolean hasStoragePermission = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
            boolean hasMediaImagesPermission = true; // Default true for older Android
            // For Android 13+ (API 33+)
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                hasMediaImagesPermission = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES) == PackageManager.PERMISSION_GRANTED;
            }

            if (!hasStoragePermission || !hasMediaImagesPermission) {
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                    // Android 13+
                    ActivityCompat.requestPermissions(this,
                            new String[]{
                                    Manifest.permission.READ_MEDIA_IMAGES,
                                    Manifest.permission.READ_MEDIA_VIDEO
                            }, Constants.STORAGE_REQUEST);
                } else {
                    // Android 12 and below
                    ActivityCompat.requestPermissions(this,
                            new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, Constants.STORAGE_REQUEST);
                }
            } else {
                openGallery();
            }
        });
        btnCamera.setOnClickListener(v -> {
            // Camera option clicked
            dialog.dismiss();
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.CAMERA}, Constants.CAMERA_REQUEST);
            } else {
                openCamera();
            }
        });
        dialog.show();
    }

    private void openGallery() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("*/*");
        String[] mimeTypes = {
                "application/pdf",
                "image/*"};
        intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
        activityResultLauncher.launch(intent);
    }
    private final ActivityResultLauncher<Intent> activityResultLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    Uri selectedImageUri = result.getData().getData();
                    String filePath = FileUtils.getFileFromUri(selectedImageUri, this);
                    //Get file name and type
                    String filename = filePath.substring(filePath.lastIndexOf("/") + 1);
                    //Pass them to current document
                    currentDocument = new DocumentResponse();
                    currentDocument.setName(filename);
                    MultipartBody.Part imagePart = FileUtils.filePathToMultipartBodyPart(filePath, "file");
                    //Call API to upload image
                    viewModel.doUploadFile(imagePart);
                }
            });

    private void openCamera() {
        ImagePicker.with(this)
                .cameraOnly()
                .cropSquare()
                .start();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == Constants.STORAGE_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openGallery();
            } else {
                Toast.makeText(this, R.string.not_permission_gallery, Toast.LENGTH_SHORT).show();
            }
        } else if (requestCode == Constants.CAMERA_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openCamera();
            } else {
                Toast.makeText(this, R.string.not_permission_camera, Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == ImagePicker.REQUEST_CODE) {
            if (resultCode == RESULT_OK && data != null) {
                Uri selectedImageUri = data.getData();
                currentDocument = new DocumentResponse();
                String filePath = RealPathUtil.getRealPath(this, selectedImageUri);
                String filename = filePath.substring(filePath.lastIndexOf("/") + 1);
                currentDocument.setName(filename);
                MultipartBody.Part imagePart = FileUtils.uriToMultipartBodyPart(selectedImageUri, "file", this);
                // Call API to upload image
                viewModel.doUploadFile(imagePart);
            }
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    public void deleteDocumentAt(int pos){
        // Dialog custom
        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_confirm);
        Window window = dialog.getWindow();
        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));

        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);

        Button btnConfirm = dialog.findViewById(R.id.btn_confirm);
        Button btnCancel = dialog.findViewById(R.id.btn_cancel);
        TextView textView = dialog.findViewById(R.id.tv_title);
        textView.setText(R.string.question_delete_document);
        btnCancel.setOnClickListener(v -> dialog.dismiss());

        btnConfirm.setOnClickListener(v -> {
            mListDocumentResponses.remove(pos);
            mDocumentAdapter.setListDocument(mListDocumentResponses);
            mDocumentAdapter.notifyDataSetChanged();
            dialog.dismiss();
        });
        dialog.show();
    }



    public void createOrUpdate(){
        if (!mListDocumentResponses.isEmpty()){
            //Parse json to transaction create
            Gson gson = new Gson();
            String json = gson.toJson(mListDocumentResponses);
            Objects.requireNonNull(viewModel.keyResponse.get()).setDocument(json);
        } else {
            Objects.requireNonNull(viewModel.keyResponse.get()).setDocument(null);
        }

        if (!viewBinding.dropdownGroup.getText().toString().isEmpty()) {
            for (KeyGroupResponse keyGroupResponse : Objects.requireNonNull(viewModel.keyGroups.getValue())) {
                {
                    if (decrypt(keyGroupResponse.getName()).equals(viewBinding.dropdownGroup.getText().toString())) {
                        viewModel.isRightKeyGroup.set(true);
                        break;
                    }
                }
            }
        }else {
            viewModel.showErrorMessage(getString(R.string.invalid_key_group));
            return;
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
            Objects.requireNonNull(viewModel.keyResponse.get()).getTag().setId(null);
            viewModel.isRightTag.set(true);
        }

        if (!viewBinding.dropdownOrganization.getText().toString().isEmpty()){
            for (OrganizationResponse organizationResponse : Objects.requireNonNull(viewModel.organizationResponses.getValue())) {
                if (decrypt(organizationResponse.getName()).equals(viewBinding.dropdownOrganization.getText().toString())){
                    viewModel.isRightOrganization.set(true);
                    break;
                }
            }
        } else {
            Objects.requireNonNull(viewModel.keyResponse.get()).setOrganization(null);
            viewModel.isRightOrganization.set(true);
        }

        if (Boolean.TRUE.equals(viewModel.isCreated.get())){
            viewModel.createKey();
        } else {
            viewModel.updateKey();
        }
    }

    @Override
    protected void onDestroy() {
        viewModel.keyGroups.removeObservers(this);
        viewModel.tags.removeObservers(this);
        viewModel.organizationResponses.removeObservers(this);
        viewModel.filePath.removeObservers(this);
        super.onDestroy();
    }
}
