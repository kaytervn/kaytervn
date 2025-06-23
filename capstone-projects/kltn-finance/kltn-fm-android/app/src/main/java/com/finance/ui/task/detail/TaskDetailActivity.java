package com.finance.ui.task.detail;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.finance.databinding.ActivityTaskDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.document.DocumentActivity;
import com.finance.ui.subtask.SubTaskActivity;
import com.finance.ui.task.create_or_update.TaskCreateUpdateActivity;
import com.finance.utils.AESUtils;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class TaskDetailActivity extends BaseActivity<ActivityTaskDetailBinding, TaskDetailViewModel>
{
    private Integer positionFromFragment;

    ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityResultLauncher();
    @Override
    public int getLayoutId() {
        return R.layout.activity_task_detail;
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
        //Get data from intent
        long taskId = getDataFromIntent();
        setOnClickUpdate();
        if (taskId != 0) {
            //Call api to get task detail
            viewModel.getDetailTask(taskId);
            //Get task detail from api
            getTaskDetail();
        } else {
            viewModel.showErrorMessage(getString(R.string.error_get_data));
        }
        viewBinding.layoutDocument.setOnClickListener(v -> navigateToDocument());
    }

    private long getDataFromIntent() {
        long taskId = getIntent().getLongExtra(Constants.TASK_ID, 0);
        positionFromFragment = getIntent().getIntExtra(Constants.POSITION, 0);
        //Check if task is sub task
        viewModel.isSubTask.set(getIntent().getBooleanExtra(Constants.IS_SUB_TASK, false));
        viewModel.fromProject.set(getIntent().getBooleanExtra(Constants.FROM_PROJECT, false));
        return taskId;
    }

    //If want to show dialog, use this function
    public void showMoreText(){
        // Show Dialog custom
        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_more_text);
        Window window = dialog.getWindow();
        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);

        TextView tvContent = dialog.findViewById(R.id.tv_content);
        TextView tvTitle = dialog.findViewById(R.id.tv_header_title);

        tvTitle.setText(getString(R.string.content));
        tvContent.setText(decrypt(Objects.requireNonNull(viewModel.task.get()).getNote()));
        dialog.show();
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getTaskDetail() {
        viewModel.taskLiveData.observe(this, taskResponse -> {
            if (taskResponse == null || taskResponse.getId() == null) {
                return;
            }
            viewModel.task.set(taskResponse);
            viewModel.isHaveDocument.set(taskResponse.getDocument() != null && !taskResponse.getDocument().isEmpty());
            setupDocument();

            //if task is updated, return data to TaskFragment
            if (Boolean.TRUE.equals(viewModel.isUpdated.get())) {
                setResultForUpdate();
            }
        });
    }
    @SuppressLint("NotifyDataSetChanged")
    private void setupDocument() {
        if (Objects.requireNonNull(viewModel.task.get()).getDocument() != null) {
            Objects.requireNonNull(viewModel.task.get()).setDocument(
                    AESUtils.decrypt(SecretKey.getInstance().getKey(),
                            Objects.requireNonNull(viewModel.task.get()).getDocument(), false));
            viewModel.isHaveDocument.set(true);
            Type listType = new TypeToken<List<DocumentResponse>>(){}.getType();
            Gson gson = new Gson();
            //Parse JSON string into list of objects
            List<DocumentResponse> mListDocumentResponses;
            mListDocumentResponses = gson.fromJson(
                    Objects.requireNonNull(viewModel.task.get()).getDocument(), listType);
            if (mListDocumentResponses == null) {
                mListDocumentResponses = new ArrayList<>();
            }
            viewModel.totalDocuments.set(mListDocumentResponses.size());
        } else {
            viewModel.isHaveDocument.set(false);
        }
    }

    private void setResultForUpdate() {
        Intent intent = new Intent();
        Bundle bundle = new Bundle();
        bundle.putSerializable(Constants.TASK_RESPONSE, viewModel.task.get());
        bundle.putInt(Constants.POSITION, positionFromFragment);
        intent.putExtras(bundle);
        if (Boolean.TRUE.equals(viewModel.isSubTask.get())) {
            setResult(Constants.RESULT_SUB_TASK, intent);
        } else {
            setResult(RESULT_OK, intent);
        }
    }

    private void setOnClickUpdate() {
        if (checkPermission(Constants.PERMISSION_TASK_UPDATE)) {
            viewBinding.layoutHeader.imgOther.setVisibility(View.VISIBLE);
            viewBinding.layoutHeader.imgOther.setImageResource(R.drawable.ic_update);
        }
        viewBinding.layoutHeader.imgOther.setOnClickListener(v -> {
            Intent intent = new Intent(this, TaskCreateUpdateActivity.class);
            Bundle bundle = new Bundle();
            bundle.putSerializable(Constants.TASK_RESPONSE, viewModel.task.get());
            intent.putExtra(Constants.PROJECT_RESPONSE, Objects.requireNonNull(viewModel.task.get()).getProject());
            intent.putExtra(Constants.FROM_PROJECT, viewModel.fromProject.get());
            intent.putExtras(bundle);
            activityResultLauncher.launch(intent);
        });
    }
    @NonNull
    private ActivityResultLauncher<Intent> getIntentActivityResultLauncher() {
        return
            registerForActivityResult(
                    new ActivityResultContracts.StartActivityForResult(),
                    activityResult -> {
                        int result = activityResult.getResultCode();
                        if (result == RESULT_OK ) {
                            viewModel.isUpdated.set(true);
                            viewModel.getDetailTask(Objects.requireNonNull(viewModel.task.get()).getId());
                        }
                    }
            );

    }

    public void navigateToSubTask() {
        Intent intent = new Intent(this, SubTaskActivity.class);
        Bundle bundle = new Bundle();
        bundle.putSerializable(Constants.TASK_RESPONSE, viewModel.task.get());
        intent.putExtras(bundle);
        startActivity(intent);
    }

    public void navigateToDocument() {
        Intent intent = new Intent(this, DocumentActivity.class);
        intent.putExtra(Constants.DOCUMENT, Objects.requireNonNull(viewModel.task.get()).getDocument());
        startActivity(intent);
    }

}
