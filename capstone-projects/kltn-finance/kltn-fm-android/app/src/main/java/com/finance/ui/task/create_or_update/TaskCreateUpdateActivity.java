package com.finance.ui.task.create_or_update;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ArrayAdapter;
import android.widget.RelativeLayout;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.ui.document.adapter.DocumentAdapter;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.finance.data.model.api.response.project.ProjectResponse;
import com.finance.data.model.api.response.task.TaskResponse;
import com.finance.databinding.ActivityTaskCreateUpdateBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.utils.FileUtils;
import com.finance.utils.RealPathUtil;
import com.github.dhaval2404.imagepicker.ImagePicker;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import okhttp3.MultipartBody;
import timber.log.Timber;

public class TaskCreateUpdateActivity extends BaseActivity<ActivityTaskCreateUpdateBinding,TaskCreateUpdateViewModel >
{
    //Project
    private ArrayAdapter<String> adapterProject;
    private List<ProjectResponse> mListProjectResponses = new ArrayList<>();

    private final List<String> stateNames = new ArrayList<>();

    //Document
    private List<DocumentResponse> mListDocumentResponses = new ArrayList<>();
    private DocumentAdapter mDocumentAdapter;
    private DocumentResponse currentDocument = new DocumentResponse();

    private Integer currentDocumentPosition = -1;


    @Override
    public int getLayoutId() {
        return R.layout.activity_task_create_update;
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
        try {
            viewModel.isCreated.set(getIntent().getBooleanExtra(Constants.IS_CREATE,false));
            viewModel.isSubTask.set(getIntent().getBooleanExtra(Constants.IS_SUB_TASK, false));
            viewModel.fromProject.set(getIntent().getBooleanExtra(Constants.FROM_PROJECT, false));
            ifSubTaskOrFromProject();
            setOnClickForAllCbb();
            setupForAllCbb();
            //Get data from intent, if it is updating task
            setupDocumentAdapter();
            getDataFromIntent();
            //Get data from API
            getListProjects();
            getDocumentAfterUpload();
        } catch (Exception e) {
            Timber.tag("TaskCreateUpdate").e("onCreate: %s", e.getMessage());
        }


    }

    private void ifSubTaskOrFromProject() {
        if (Boolean.TRUE.equals(viewModel.isSubTask.get())){
            TaskResponse taskFromIntent = (TaskResponse) getIntent().getSerializableExtra(Constants.TASK_RESPONSE);
            //Set Parent Task
            Objects.requireNonNull(viewModel.taskResponse.get()).setParent(taskFromIntent);
            //Set Project
            if (Boolean.TRUE.equals(viewModel.isCreated.get())) {
                assert taskFromIntent != null;
                if (taskFromIntent.getProject() != null) {
                    Objects.requireNonNull(viewModel.taskResponse.get()).setProject(taskFromIntent.getProject());
                }
            }
        } else if (Boolean.TRUE.equals(viewModel.fromProject.get())){
            ProjectResponse projectResponse = (ProjectResponse) getIntent().getSerializableExtra(Constants.PROJECT_RESPONSE);
            Objects.requireNonNull(viewModel.taskResponse.get()).setProject(projectResponse);
        }
    }

    private void setOnClickForAllCbb() {
        viewBinding.cbbProject.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.cbbProject.postDelayed(() -> viewBinding.cbbProject.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN);
        });
    }

    private void getListProjects() {
        viewModel.projects.observe(this, projectResponses -> {
            if (projectResponses == null || projectResponses.isEmpty()) {
                return;
            }
                mListProjectResponses = projectResponses;
                List<String> projectNames = new ArrayList<>();
                for (ProjectResponse projectResponse : mListProjectResponses){
                    projectNames.add(decrypt(projectResponse.getName()));
                }
                adapterProject = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, projectNames);
                viewBinding.cbbProject.setAdapter(adapterProject);
                //Check if project id is null or not
                if (Boolean.FALSE.equals(viewModel.isCreated.get())
                        || Boolean.TRUE.equals(viewModel.isSubTask.get())
                        || Boolean.TRUE.equals(viewModel.fromProject.get())
                ) {
                    if (Objects.requireNonNull(viewModel.taskResponse.get()).getProject() != null
                            && Objects.requireNonNull(viewModel.taskResponse.get()).getProject().getId() != null) {
                        for (int i = 0; i < projectNames.size(); i++) {
                            if (mListProjectResponses.get(i).getId().equals(
                                    Objects.requireNonNull(viewModel.taskResponse.get()).getProject().getId())) {
                                viewBinding.cbbProject.setText(adapterProject.getItem(i), false);
                                break;
                            }
                        }
                    }
                }


        });
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getDocumentAfterUpload() {
        viewModel.filePathDocuments.observe(this, filePath -> {
            if (filePath !=null && !filePath.isEmpty()){
                currentDocument.setUrl(filePath);
                //User update file
                if (currentDocumentPosition != -1) {
                    mDocumentAdapter.getListDocument().set(currentDocumentPosition, currentDocument);
                    currentDocumentPosition = -1;
                    mDocumentAdapter.notifyItemChanged(currentDocumentPosition);
                }
                //User add new file
                else {
                    mDocumentAdapter.getListDocument().add(currentDocument);
                    mDocumentAdapter.notifyDataSetChanged();
                }
            }
        });
    }
    @SuppressLint("NotifyDataSetChanged")
    private void getDataFromIntent() {
        if (Boolean.FALSE.equals(viewModel.isCreated.get())){
            Bundle bundle = getIntent().getExtras();
            assert bundle != null;
            TaskResponse taskResponse = (TaskResponse) bundle.getSerializable(Constants.TASK_RESPONSE);
            viewModel.taskResponse.set(taskResponse);
            //State
            if (Objects.requireNonNull(viewModel.taskResponse.get()).getState() == 1)
                viewBinding.cbbState.setText(stateNames.get(0), false);
            else if (Objects.requireNonNull(viewModel.taskResponse.get()).getState() == 2)
                viewBinding.cbbState.setText(stateNames.get(1), false);
            //Document
            setupDocument();
        }
        else if (Boolean.TRUE.equals(viewModel.isSubTask.get())
                && Objects.requireNonNull(viewModel.taskResponse.get()).getProject() != null){
            viewBinding.cbbProject.setText(Objects.requireNonNull(viewModel.taskResponse.get()).getProject().getName(), false);
        }
    }
    @SuppressLint("NotifyDataSetChanged")
    private void setupDocument() {
        if (Objects.requireNonNull(viewModel.taskResponse.get()).getDocument() != null) {
            Type listType = new TypeToken<List<DocumentResponse>>(){}.getType();
            Gson gson = new Gson();
            //Parse JSON string into list of objects
            mListDocumentResponses = gson.fromJson(
                    Objects.requireNonNull(viewModel.taskResponse.get()).getDocument(), listType);
            mDocumentAdapter.setListDocument(mListDocumentResponses);
        } else {
            mListDocumentResponses.clear();
            mDocumentAdapter.setListDocument(mListDocumentResponses);
        }
        mDocumentAdapter.notifyDataSetChanged();
    }

    private void setupDocumentAdapter() {
        mDocumentAdapter = new DocumentAdapter(new ArrayList<>(), new DocumentAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int pos) {
                currentDocumentPosition = pos;
                showDialogChooseFile();
            }

            @Override
            public void onDeleteClick(View view, int pos) {
                deleteDocumentAt(pos);
            }
        });
        viewBinding.rcvDocuments.setAdapter(mDocumentAdapter);
        viewBinding.rcvDocuments.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));
    }

    private void setupForAllCbb() {
        viewModel.getAllProject();
        viewBinding.cbbProject.setOnItemClickListener((adapterView, view, position, id) -> {
            Objects.requireNonNull(viewModel.taskResponse.get()).setProject(mListProjectResponses.get(position));
            hideKeyboard();
        });

        stateNames.add(getString(R.string.pending));
        stateNames.add(getString(R.string.done));
        //State
        ArrayAdapter<String> adapterState = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, stateNames);
        viewBinding.cbbState.setAdapter(adapterState);
        viewBinding.cbbState.setOnItemClickListener((adapterView, view, position, id) -> {
            if (position == 0) {
                Objects.requireNonNull(viewModel.taskResponse.get()).setState(1);
            } else if (position == 1) {
                Objects.requireNonNull(viewModel.taskResponse.get()).setState(2);
            }
            hideKeyboard();
        });
    }



    public void createOrUpdateTask(){
        Objects.requireNonNull(viewModel.taskResponse.get()).setName(viewBinding.editTaskName.getText().toString());
        Objects.requireNonNull(viewModel.taskResponse.get()).setNote(viewBinding.editTaskContent.getText().toString());

        if (!mListDocumentResponses.isEmpty()){
            //Parse json to transaction create
            Gson gson = new Gson();
            String json = gson.toJson(mListDocumentResponses);
            Objects.requireNonNull(viewModel.taskResponse.get()).setDocument(json);
        } else {
            Objects.requireNonNull(viewModel.taskResponse.get()).setDocument(null);
        }

        //Handle right project
        if (!viewBinding.cbbProject.getText().toString().isEmpty()){
            for (ProjectResponse projectResponse : mListProjectResponses) {
                if (decrypt(projectResponse.getName()).equals(viewBinding.cbbProject.getText().toString())){
                    viewModel.isRightProject.set(true);
                    break;
                }
            }
        } else {
            viewModel.showErrorMessage(getString(R.string.invalid_project));
            return;
        }

        viewModel.createOrUpdateTask();
        hideKeyboard();
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
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.document), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                mDocumentAdapter.getListDocument().remove(pos);
                mDocumentAdapter.notifyDataSetChanged();
            }
            @Override
            public void cancelDelete() {

            }
        });
        deleteDialog.show(this.getSupportFragmentManager(), Constants.DELETE_DIALOG);
    }



}
