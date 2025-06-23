package com.finance.ui.fragment.project;

import android.annotation.SuppressLint;
import android.app.Activity;
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
import androidx.databinding.Observable;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.project.ProjectResponse;
import com.finance.data.model.api.response.task.TaskResponse;
import com.finance.databinding.FragmentProjectBinding;
import com.finance.di.component.FragmentComponent;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.base.BaseFragment;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.main.MainActivity;
import com.finance.ui.project.adapter.ProjectAdapter;
import com.finance.ui.project.detail.ProjectDetailActivity;
import com.finance.ui.task.TaskActivity;

import java.util.ArrayList;
import java.util.List;

import timber.log.Timber;

public class ProjectFragment extends BaseFragment<FragmentProjectBinding, ProjectFragmentViewModel>
        implements View.OnTouchListener
{
    ProjectAdapter adapter;
    private List<ProjectResponse> mListProjects = new ArrayList<>();
    private float xAxis, yAxis,initialX,initialY;
    int lastAction;

    ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityResultLauncher();
    Integer position;

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    protected int getLayoutId() {
        return R.layout.fragment_project;
    }
    @Override
    protected void performDependencyInjection(FragmentComponent buildComponent) {
        buildComponent.inject(this);
    }
    @SuppressLint("ClickableViewAccessibility")
    @Override
    protected void performDataBinding() {
        setupAdapter();
        setupSearchByName();
        checkPrivateKey();
        //Get all Project
        getListProjects();
        //Get Project detail
        getProjectDetail();
        binding.btnAdd.setOnTouchListener(this);
        setupSwipeFreshLayout();
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getListProjects() {
        viewModel.projects.observe(this, projectResponses -> {
            if (projectResponses == null || projectResponses.isEmpty())
                return;
            mListProjects = projectResponses;
            for (ProjectResponse projectResponse : projectResponses){
                projectResponse.setName(decrypt(projectResponse.getName()));
            }
            adapter.setProjectResponses(projectResponses);
            adapter.notifyDataSetChanged();
        });
    }

    private void setupSearchByName() {
        binding.edtSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {}

            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                List<ProjectResponse> projectResponseFilters = new ArrayList<>();
                String editSearch = binding.edtSearch.getText().toString();
                viewModel.isSearchEmpty.set(editSearch);
                if (mListProjects == null || mListProjects.isEmpty()){
                    return;
                }
                for (ProjectResponse projectResponse : mListProjects){
                    if (projectResponse.getName().toLowerCase().contains(editSearch.toLowerCase())){
                        projectResponseFilters.add(projectResponse);
                    }
                }
                adapter.setProjectResponses(projectResponseFilters);
                adapter.notifyDataSetChanged();
                viewModel.totalElements.set(projectResponseFilters.size());
            }
            @Override
            public void afterTextChanged(Editable editable) {}
        });

        viewModel.isSearch.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                if (Boolean.TRUE.equals(viewModel.isSearch.get())){
                    binding.rcvProjects.stopScroll();
                    binding.rcvProjects.scrollToPosition(0);
                    binding.edtSearch.requestFocus();
                    showKeyboard();
                }
            }
        });

        SpannableString spannableHint = new SpannableString(binding.edtSearch.getHint());
        spannableHint.setSpan(new StyleSpan(Typeface.ITALIC), 0, binding.edtSearch.getHint().length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        binding.edtSearch.setHint(spannableHint);
    }

    public void addNewProject() {
        viewModel.isCreate.set(true);
        Intent intent = new Intent(getActivity(), ProjectDetailActivity.class);
        intent.putExtra(Constants.IS_CREATE, true);
        activityResultLauncher.launch(intent);
    }

    @SuppressLint("NotifyDataSetChanged")
    private void checkPrivateKey() {
        viewModel.validKey.observe(this, valid-> {
            if(valid){
                viewModel.isValidKey.set(true);
                adapter.setSecretKey(SecretKey.getInstance().getKey());
                viewModel.getAllProject();
            }else {
                viewModel.isValidKey.set(false);
                if (adapter != null){
                    adapter.setProjectResponses(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
            }
        });
    }

    private ActivityResultLauncher<Intent> getIntentActivityResultLauncher() {
        return
                registerForActivityResult(
                        new ActivityResultContracts.StartActivityForResult(),
                        activityResult -> {
                            int result = activityResult.getResultCode();
                            Intent data = activityResult.getData();
                            if (result == Constants.RESULT_UPDATE){
                                assert data != null;
                                Bundle bundle = data.getExtras();
                                if (bundle != null){
                                    position = bundle.getInt(Constants.POSITION);
                                    Long id = bundle.getLong(Constants.PROJECT_ID);
                                    viewModel.getProjectDetails(id);
                                }
                            }
                            else if (result == Activity.RESULT_OK){
                                viewModel.getAllProject();
                            }
                            else if (result == Constants.RESULT_FROM_TASK){
                                assert data != null;
                                Bundle bundle = data.getExtras();
                                if (bundle != null){
                                    int totalTask = bundle.getInt(Constants.TOTAL_TASKS);
                                    position = bundle.getInt(Constants.POSITION);
                                    adapter.getProjectResponses().get(position).setTotalTasks(totalTask);
                                    adapter.notifyItemChanged(position);
                                }
                            }
                        }
                );
    }

    public void getProjectDetail(){
        viewModel.projectLiveData.observe(this, projectResponse -> {
            if (projectResponse == null || projectResponse.getId() == null)
                return;
            projectResponse.setName(decrypt(projectResponse.getName()));
            adapter.getProjectResponses().set(position, projectResponse);
            adapter.notifyItemChanged(position);
        });
    }

    private void setupAdapter() {
        adapter = new ProjectAdapter(new ArrayList<>(), new ProjectAdapter.ProjectListener() {
            @Override
            public void onItemClick(int position, View view) {
                if (checkPermission(Constants.PERMISSION_TASK_LIST)){
                    viewModel.isCreate.set(false);
                    Intent intent = new Intent(view.getContext(), TaskActivity.class);
                    intent.putExtra(Constants.PROJECT_RESPONSE, adapter.getProjectResponses().get(position));
                    intent.putExtra(Constants.POSITION, position);
                    activityResultLauncher.launch(intent);
                }
            }

            @Override
            public void onUpdateClick(int position, View view) {
                if (checkPermission(Constants.PERMISSION_PROJECT_GET)){
                    viewModel.isCreate.set(false);
                    Intent intent = new Intent(view.getContext(), ProjectDetailActivity.class);
                    intent.putExtra(Constants.PROJECT_ID, adapter.getProjectResponses().get(position).getId());
                    intent.putExtra(Constants.POSITION, position);
                    activityResultLauncher.launch(intent);
                }
            }

            @Override
            public void onDeleteClick(int position, View view) {
                viewModel.isCreate.set(false);
                deleteAt( position);
            }
        });
        binding.rcvProjects.setAdapter(adapter);
        binding.rcvProjects.setLayoutManager(new LinearLayoutManager(getActivity()));
    }

    @SuppressLint("NotifyDataSetChanged")
    private void setupSwipeFreshLayout() {
        binding.swipeLayout.setEnabled(true);
        binding.swipeLayout.setOnRefreshListener(() -> {
            deleteEditSearch();
            if (checkSecretKeyValid()){
                viewModel.getAllProject();
                binding.swipeLayout.setRefreshing(false);
            } else
            {
                if (adapter != null){
                    adapter.setProjectResponses(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                binding.swipeLayout.setRefreshing(false);
            }
        });
    }

    public void deleteAt(int pos){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.project), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                viewModel.deleteProject(adapter.getProjectResponses().get(pos).getId(), new BaseCallBack() {
                    @Override
                    public void doError(Throwable throwable) {
                        viewModel.showErrorMessage(throwable.getMessage());
                    }

                    @SuppressLint("NotifyDataSetChanged")
                    @Override
                    public void doSuccess() {
                        adapter.getProjectResponses().remove(pos);
                        if (adapter.getProjectResponses().isEmpty()){
                            viewModel.totalElements.set(0);
                        }
                        adapter.notifyDataSetChanged();
                    }
                });
            }
            @Override
            public void cancelDelete() {

            }
        });
        deleteDialog.show(this.getChildFragmentManager(), Constants.DELETE_DIALOG);
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

    @SuppressLint("NotifyDataSetChanged")
    public void checkSecretKey(){
        setSecretKeyListener();
        if(checkSecretKeyValid()){
            if(Boolean.FALSE.equals(viewModel.validKey.getValue())){
                viewModel.validKey.setValue(true);
            }
        }else {
            viewModel.validKey.setValue(false);
        }
    }

    public void deleteEditSearch(){
        binding.edtSearch.setText("");
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
