package com.finance.ui.subtask;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.MotionEvent;
import android.view.View;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.task.TaskResponse;
import com.finance.databinding.ActivitySubTaskBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.dialog.YesNoDialog;
import com.finance.ui.task.create_or_update.TaskCreateUpdateActivity;
import com.finance.ui.task.detail.TaskDetailActivity;
import com.finance.ui.task.detail.adapter.SubTaskAdapter;

import java.util.ArrayList;
import java.util.Objects;

public class SubTaskActivity extends BaseActivity<ActivitySubTaskBinding, SubTaskViewModel>
        implements YesNoDialog.Listener, View.OnTouchListener
{
    private SubTaskAdapter mSubTaskAdapter;
    private Integer currentSubTaskPosition;
    ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityResultLauncher();
    private YesNoDialog changeStateDialog;
    private float xAxis, yAxis,initialX,initialY;
    int lastAction;
    @Override
    public int getLayoutId() {
        return R.layout.activity_sub_task;
    }

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    public void performDependencyInjection(ActivityComponent buildComponent) {
        buildComponent.inject(this);
    }

    @SuppressLint("ClickableViewAccessibility")
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getIntent().getExtras() != null) {
            viewModel.task.set((TaskResponse) getIntent().getSerializableExtra(Constants.TASK_RESPONSE));
            viewModel.getSubTasks(Objects.requireNonNull(viewModel.task.get()).getId());
        }
        setupSubTaskAdapter();
        getListSubTasks();
        setupSwipeFreshLayout();
        viewBinding.btnAdd.setOnTouchListener(this);
    }

    @NonNull
    private ActivityResultLauncher<Intent> getIntentActivityResultLauncher() {
        return
            registerForActivityResult(
                    new ActivityResultContracts.StartActivityForResult(),
                    activityResult -> {
                        int result = activityResult.getResultCode();
                        Intent intent = activityResult.getData();

                        if (result == Constants.RESULT_SUB_TASK) {
                            assert intent != null;
                            Bundle bundle = intent.getExtras();
                            if (bundle != null){
                                int position = bundle.getInt(Constants.POSITION);
                                TaskResponse taskResponse = (TaskResponse) bundle.getSerializable(Constants.TASK_RESPONSE);
                                assert taskResponse != null;
                                taskResponse.setName(decrypt(taskResponse.getName()));
                                mSubTaskAdapter.getListTaskResponse().get(position).setTaskResponse(taskResponse);
                                mSubTaskAdapter.notifyItemChanged(position);
                            }
                        }
                        //if from created sub task
                        else if (result == Constants.RESULT_CREATE) {
                            viewModel.getSubTasks(Objects.requireNonNull(viewModel.task.get()).getId());
                        }
                    }
            );

    }

    @SuppressLint("NotifyDataSetChanged")
    private void getListSubTasks() {
        viewModel.subTasks.observe(this, taskResponses -> {
            if (taskResponses == null || taskResponses.isEmpty()) {
                viewModel.totalSubTaskElements.set(0);
                mSubTaskAdapter.setListTaskResponse(new ArrayList<>());
                mSubTaskAdapter.notifyDataSetChanged();
            }
            else {
                for (TaskResponse subTask : taskResponses){
                    subTask.setName(decrypt(subTask.getName()));
                }
                viewModel.totalSubTaskElements.set(taskResponses.size());
                mSubTaskAdapter.setListTaskResponse(taskResponses);
                mSubTaskAdapter.notifyDataSetChanged();
            }
        });
    }

    @SuppressLint("NotifyDataSetChanged")
    private void setupSwipeFreshLayout() {
        viewBinding.swipeLayout.setEnabled(true);
        viewBinding.swipeLayout.setOnRefreshListener(() -> {
            if (checkSecretKeyValid()){
                viewBinding.swipeLayout.setRefreshing(false);
            } else
            {
                if (mSubTaskAdapter != null){
                    mSubTaskAdapter.setListTaskResponse(new ArrayList<>());
                    mSubTaskAdapter.notifyDataSetChanged();
                }
                viewBinding.swipeLayout.setRefreshing(false);
            }
        });
    }

    private void setupSubTaskAdapter() {
        mSubTaskAdapter = new SubTaskAdapter(new ArrayList<>(), new SubTaskAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int pos) {
                if (checkPermission(Constants.PERMISSION_TASK_GET)){
                    TaskResponse TaskResponse = mSubTaskAdapter.getListTaskResponse().get(pos);
                    Intent intent = new Intent(view.getContext(), TaskDetailActivity.class);
                    intent.putExtra(Constants.TASK_ID, TaskResponse.getId());
                    intent.putExtra(Constants.POSITION, pos);
                    intent.putExtra(Constants.IS_SUB_TASK, true);
                    activityResultLauncher.launch(intent);
                }
            }

            @Override
            public void onItemChangeState(View view, int pos) {
                changeStateAt(pos);
            }

            @Override
            public void onItemClickDelete(View view, int pos) {
                deleteAt(pos);
            }
        });
        mSubTaskAdapter.setSecretKey(SecretKey.getInstance().getKey());
        viewBinding.rcvTasks.setAdapter(mSubTaskAdapter);
        viewBinding.rcvTasks.setLayoutManager(new LinearLayoutManager(
                this,
                LinearLayoutManager.VERTICAL,
                false));
    }

    private void changeStateAt(Integer position){
        currentSubTaskPosition = position;
        changeStateDialog = new YesNoDialog(getString(R.string.question_change_state_task), getString(R.string.cancel), getString(R.string.confirm));
        changeStateDialog.show(this.getSupportFragmentManager(),Constants.YES_NO_DIALOG_FRAGMENT);
        changeStateDialog.setListener(this);
    }

    public void deleteAt(int pos){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.task), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                viewModel.deleteTask(mSubTaskAdapter.getListTaskResponse().get(pos).getId(), new BaseCallBack() {
                    @Override
                    public void doError(Throwable throwable) {
                        viewModel.showErrorMessage(getString(R.string.can_not_delete));
                    }

                    @Override
                    public void doSuccess() {
                        //Remove local
                        if (mSubTaskAdapter.getListTaskResponse().isEmpty()){
                            viewModel.totalSubTaskElements.set(0);
                        }
                        mSubTaskAdapter.getListTaskResponse().remove(pos);
                        mSubTaskAdapter.notifyItemRemoved(pos);
                    }
                });
            }
            @Override
            public void cancelDelete() {

            }
        });
        deleteDialog.show(this.getSupportFragmentManager(), Constants.DELETE_DIALOG);

    }

    @Override
    public void confirmYN() {
        viewModel.changeStateTask(mSubTaskAdapter.getListTaskResponse().get(currentSubTaskPosition).getId(), new BaseCallBack() {
            @Override
            public void doError(Throwable throwable) {
                viewModel.showErrorMessage(getString(R.string.can_not_change_state));
                changeStateDialog.dismiss();
            }

            @Override
            public void doSuccess() {
                mSubTaskAdapter.getListTaskResponse().get(currentSubTaskPosition).setState(2);
                mSubTaskAdapter.notifyItemChanged(currentSubTaskPosition);
                changeStateDialog.dismiss();
            }
        });
    }

    @Override
    public void cancelYN() {
        changeStateDialog.dismiss();
    }
    public void addNewTask() {
        Intent intent = new Intent(this, TaskCreateUpdateActivity.class);
        intent.putExtra(Constants.IS_CREATE, true);
        intent.putExtra(Constants.IS_SUB_TASK, true);
        intent.putExtra(Constants.TASK_RESPONSE, viewModel.task.get());
        activityResultLauncher.launch(intent);
    }

    @Override
    public boolean onTouch(View v, MotionEvent event) {
        switch (event.getActionMasked()) {
            case MotionEvent.ACTION_DOWN:
                xAxis = v.getX() - event.getRawX();
                yAxis = v.getY() - event.getRawY();
                initialX = event.getRawX();
                initialY = event.getRawY();
                lastAction = MotionEvent.ACTION_DOWN;
                break;

            case MotionEvent.ACTION_MOVE:
                float newX = event.getRawX() + xAxis;
                float newY = event.getRawY() + yAxis;

                DisplayMetrics displayMetrics = new DisplayMetrics();
                getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
                int screenWidth = displayMetrics.widthPixels;
                int screenHeight = displayMetrics.heightPixels;


                int viewWidth = v.getWidth();
                int viewHeight = v.getHeight();

                if (newX < 0) {
                    newX = 0;
                } else if (newX + viewWidth > screenWidth) {
                    newX = screenWidth - viewWidth;
                }

                if (newY < 0) {
                    newY = 0;
                } else if (newY + viewHeight > screenHeight) {
                    newY = screenHeight - viewHeight;
                }

                v.setX(newX);
                v.setY(newY);
                lastAction = MotionEvent.ACTION_MOVE;
                break;

            case MotionEvent.ACTION_UP:
                if (lastAction == MotionEvent.ACTION_DOWN) {
                    v.performClick();
                } else {
                    float finalX = event.getRawX();
                    float finalY = event.getRawY();
                    float distance = (float) Math.sqrt(Math.pow(finalX - initialX, 2) + Math.pow(finalY - initialY, 2));
                    if (distance < Constants.CLICK_ACTION_THRESHOLD) {
                        v.performClick();
                    }
                }
                break;

            default:
                return false;
        }
        return true;
    }
}
