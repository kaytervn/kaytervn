package com.finance.ui.fragment.task;

import static android.app.Activity.RESULT_OK;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.Editable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextWatcher;
import android.text.style.StyleSpan;
import android.util.DisplayMetrics;
import android.view.MotionEvent;
import android.view.View;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.databinding.Observable;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.task.TaskResponse;


import com.finance.databinding.FragmentTaskBinding;
import com.finance.di.component.FragmentComponent;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.base.BaseFragment;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.dialog.YesNoDialog;


import com.finance.ui.fragment.task.adapter.TaskAdapter;

import com.finance.ui.task.create_or_update.TaskCreateUpdateActivity;
import com.finance.ui.task.detail.TaskDetailActivity;
import com.finance.ui.task.filter.TaskFilterActivity;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class  TaskFragment extends BaseFragment<FragmentTaskBinding, TaskFragmentViewModel>
        implements View.OnTouchListener, YesNoDialog.Listener
{
    TaskAdapter adapter;
    List<TaskResponse> tasks;
    YesNoDialog yesNoDialog;
    Integer currentPosition;
    private float xAxis, yAxis,initialX,initialY;
    int lastAction;
    private final ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityResultLauncher();

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    protected int getLayoutId() {
        return R.layout.fragment_task;
    }
    protected void performDependencyInjection(FragmentComponent buildComponent) {
        buildComponent.inject(this);
    }

    @SuppressLint("ClickableViewAccessibility")
    @Override
    protected void performDataBinding() {
        checkPrivateKey();
        //Get list task from api
        getListTasks();
        setupSwipeFreshLayout();
        setupSearchByName();
        binding.btnAdd.setOnTouchListener(this);
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getListTasks() {
        viewModel.tasks.observe(this, taskResponses -> {
            if (taskResponses == null || taskResponses.isEmpty()) {
                if (adapter == null){
                    setupAdapter();
                }
                viewModel.totalElements.set(0);
                adapter.setListTaskResponse(new ArrayList<>());
                adapter.notifyDataSetChanged();
            }
            else {
                if (adapter == null){
                    setupAdapter();
                }
                for (TaskResponse taskResponse : taskResponses){
                    taskResponse.setName(decrypt(taskResponse.getName()));
                }
                tasks = taskResponses;
                viewModel.totalElements.set(taskResponses.size());
                adapter.setListTaskResponse(taskResponses);
            }
            adapter.notifyDataSetChanged();
        });
    }


    @Override
    public void confirmYN() {
        viewModel.changeStateTask(adapter.getListTaskResponse().get(currentPosition).getId(), new BaseCallBack() {
            @Override
            public void doError(Throwable throwable) {
                viewModel.showErrorMessage(getString(R.string.can_not_change_state));
                yesNoDialog.dismiss();
            }

            @Override
            public void doSuccess() {
                adapter.getListTaskResponse().get(currentPosition).setState(2);
                adapter.notifyItemChanged(currentPosition);
                yesNoDialog.dismiss();
            }
        });
    }

    @Override
    public void cancelYN() {

    }

    private void changeStateAt(Integer position){
        currentPosition = position;
        yesNoDialog = new YesNoDialog(getString(R.string.question_change_state_task), getString(R.string.cancel), getString(R.string.confirm));
        yesNoDialog.show(getChildFragmentManager(),Constants.YES_NO_DIALOG_FRAGMENT);
        yesNoDialog.setListener(this);
    }

    @SuppressLint("NotifyDataSetChanged")
    private void checkPrivateKey() {
        viewModel.validKey.observe(this, valid->{
            if(valid){
                viewModel.isValidKey.set(true);
                //Default data
                setupAdapter();
                adapter.setSecretKey(SecretKey.getInstance().getKey());
                adapter.setListTaskResponse(new ArrayList<>());
                adapter.notifyDataSetChanged();
                viewModel.getTasks();
            }else {
                viewModel.isValidKey.set(false);
                if (adapter != null){
                    adapter.setListTaskResponse(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
            }
        });
    }

    @SuppressLint("NotifyDataSetChanged")
    private void setupSwipeFreshLayout() {
        binding.swipeLayout.setEnabled(true);
        binding.swipeLayout.setOnRefreshListener(() -> {
            binding.edtSearch.setText("");
            if (checkSecretKeyValid()){
                viewModel.getTasks();
                binding.swipeLayout.setRefreshing(false);
            } else
            {
                if (adapter != null){
                    adapter.setListTaskResponse(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                binding.swipeLayout.setRefreshing(false);
            }

        });
    }

    private void setupAdapter() {
        adapter = new TaskAdapter(new ArrayList<>(), new TaskAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int pos) {
                if (checkPermission(Constants.PERMISSION_TASK_GET)){
                    TaskResponse TaskResponse = adapter.getListTaskResponse().get(pos);
                    Intent intent = new Intent(getContext(), TaskDetailActivity.class);
                    intent.putExtra(Constants.TASK_ID, TaskResponse.getId());
                    intent.putExtra(Constants.POSITION, pos);
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
        binding.rcvTasks.setAdapter(adapter);

        binding.rcvTasks.setLayoutManager(new LinearLayoutManager(
                getContext(),
                LinearLayoutManager.VERTICAL,
                false));
    }
    private void refreshRcv(){
        deleteEditSearch();
        viewModel.getTasks();
    }
    public void navigateToFilter(){
        Intent intent = new Intent(getActivity(), TaskFilterActivity.class);
        Bundle bundle = new Bundle();
        //Project
        if (viewModel.projectId.get() == null)
            bundle.putLong(Constants.PROJECT_ID, 0L);
        else
            bundle.putLong(Constants.PROJECT_ID, Objects.requireNonNull(viewModel.projectId.get()));
        //Organization
        if (viewModel.organizationId.get() == null)
            bundle.putLong(Constants.ORGANIZATION_ID, 0L);
        else
            bundle.putLong(Constants.ORGANIZATION_ID, Objects.requireNonNull(viewModel.organizationId.get()));
        intent.putExtras(bundle);
        activityResultLauncher.launch(intent);
    }

    public void deleteAt(int pos){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.task), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                viewModel.deleteTask(adapter.getListTaskResponse().get(pos).getId(), new BaseCallBack() {
                    @Override
                    public void doError(Throwable throwable) {
                        viewModel.showErrorMessage(getString(R.string.can_not_delete));
                    }
                    @Override
                    public void doSuccess() {
                        //Remove local
                        if (adapter.getListTaskResponse().isEmpty()){
                            viewModel.totalElements.set(0);
                        }
                        adapter.getListTaskResponse().remove(pos);
                        adapter.notifyItemRemoved(pos);
                    }
                });
            }

            @Override
            public void cancelDelete() {

            }
        });
        deleteDialog.show(getChildFragmentManager(), Constants.DELETE_DIALOG);
    }

    private void setupSearchByName() {
        binding.edtSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {}

            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                List<TaskResponse> TaskResponseFilters = new ArrayList<>();
                String editSearch = binding.edtSearch.getText().toString();
                viewModel.isSearchEmpty.set(editSearch);
                if (tasks == null || tasks.isEmpty()){
                    return;
                }
                for (TaskResponse TaskResponse : tasks){
                    if (TaskResponse.getName().toLowerCase().contains(editSearch.toLowerCase())){
                        TaskResponseFilters.add(TaskResponse);
                    }
                }
                adapter.setListTaskResponse(TaskResponseFilters);
                adapter.notifyDataSetChanged();

                viewModel.totalElements.set(TaskResponseFilters.size());
            }
            @Override
            public void afterTextChanged(Editable editable) {}
        });

        viewModel.isSearch.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                if (Boolean.TRUE.equals(viewModel.isSearch.get())){
                    binding.rcvTasks.stopScroll();
                    binding.rcvTasks.scrollToPosition(0);
                    binding.edtSearch.requestFocus();
                    showKeyboard();
                }
            }
        });

        SpannableString spannableHint = new SpannableString(binding.edtSearch.getHint());
        spannableHint.setSpan(new StyleSpan(Typeface.ITALIC), 0, binding.edtSearch.getHint().length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        binding.edtSearch.setHint(spannableHint);
    }

    @NonNull
    private ActivityResultLauncher<Intent> getIntentActivityResultLauncher() {
        return
            registerForActivityResult(
                    new ActivityResultContracts.StartActivityForResult(),
                    activityResult -> {

                        int result = activityResult.getResultCode();
                        Intent intent = activityResult.getData();

                        //Get Data from TaskDetailActivity when UPDATE
                        if (result == RESULT_OK){
                            Bundle bundle = Objects.requireNonNull(intent).getExtras();
                            if (bundle != null){
                                int position = bundle.getInt(Constants.POSITION);
                                TaskResponse taskResponse = (TaskResponse) bundle.getSerializable(Constants.TASK_RESPONSE);
                                Objects.requireNonNull(taskResponse).setName(decrypt(taskResponse.getName()));
                                adapter.getListTaskResponse().get(position).setTaskResponse(taskResponse);
                                adapter.notifyItemChanged(position);
                            }
                        }
                        //From filter
                        else  if(result == Constants.FILTER){
                            if(intent != null){
                                Bundle bundle = intent.getExtras();
                                if(bundle != null){
                                    //Project
                                    if(bundle.getLong(Constants.PROJECT_ID) != 0){
                                        viewModel.projectId.set(bundle.getLong(Constants.PROJECT_ID));
                                    }else {
                                        viewModel.projectId.set(null);
                                    }
                                    //Organization
                                    if(bundle.getLong(Constants.ORGANIZATION_ID) != 0){
                                        viewModel.organizationId.set(bundle.getLong(Constants.ORGANIZATION_ID));
                                    }else {
                                        viewModel.organizationId.set(null);
                                    }
                                    refreshRcv();
                                }
                            }
                        }
                        //from create
                        else if (result == Constants.RESULT_CREATE){
                            viewModel.getTasks();
                        }

                    }
            );
    }


    public void closeFilter(){
        hideKeyboard();
        if(Boolean.TRUE.equals(viewModel.isShowFilter.get())){
            showFilter();
        }
    }
    public void showFilter(){
        if(!checkPermission(Constants.PERMISSION_KEY_INFO_LIST) || Boolean.FALSE.equals(viewModel.isValidKey.get())){
            return;
        }
        viewModel.isShowFilter.set(Boolean.FALSE.equals(viewModel.isShowFilter.get()));
    }
    public void deleteEditSearch(){
        binding.edtSearch.setText("");
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
                requireActivity().getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
                int screenWidth = displayMetrics.widthPixels;
                int screenHeight = displayMetrics.heightPixels-getResources().getDimensionPixelSize(R.dimen.bottom_navigation_height);


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

    public void addNewTask() {
        Intent intent = new Intent(getActivity(), TaskCreateUpdateActivity.class);
        intent.putExtra(Constants.IS_CREATE, true);
        activityResultLauncher.launch(intent);
    }

    @SuppressLint("NotifyDataSetChanged")
    public void checkSecretKey(){
        setSecretKeyListener();
        if(checkSecretKeyValid()){
            if(Boolean.FALSE.equals(viewModel.validKey.getValue())){
                viewModel.validKey.setValue(true);
            }
        }else {
            viewModel.validKey.setValue(false);
            if (adapter != null){
                adapter.setListTaskResponse(new ArrayList<>());
                adapter.notifyDataSetChanged();
            }
        }
    }

    public Boolean onBackPressed() {
        // Your custom back press handling logic here
        // For example, you can pop the fragment back stack
        if (Boolean.TRUE.equals(viewModel.isSearch.get())){
            deleteEditSearch();
            hideKeyboard();
            viewModel.isShowSearch();
            return true;
        }
        return false;

    }

}
