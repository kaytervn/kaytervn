package com.finance.ui.task.filter;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.data.model.api.response.project.ProjectResponse;
import com.finance.databinding.ActivityTaskFilterBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.task.filter.adapter.OrganizationSelectAdapter;
import com.finance.ui.task.filter.adapter.ProjectSelectAdapter;

import java.util.Objects;


public class TaskFilterActivity extends BaseActivity<ActivityTaskFilterBinding, TaskFilterViewModel> {

    private ProjectSelectAdapter projectSelectAdapter;
    private OrganizationSelectAdapter organizationSelectAdapter;

    @Override
    public int getLayoutId() {
        return R.layout.activity_task_filter;
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
        setupSwipeFreshLayout();
        //Get data from intent
        getDataFromIntent();
        //Call API
        viewModel.getAllProjects();
        viewModel.getAllOrganizations();
        //Get data from API
        getListProjects();
        getListOrganizations();

        viewBinding.rcvSelects.setLayoutManager(new LinearLayoutManager(this));
    }

    private void getDataFromIntent() {
        Bundle bundle = getIntent().getExtras();
        if (bundle != null) {
            viewModel.projectId.set(bundle.getLong(Constants.PROJECT_ID));
            viewModel.organizationId.set(bundle.getLong(Constants.ORGANIZATION_ID));
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    public void clearFilter(){
        //Clear project
        viewModel.projectId.set(0L);
        projectSelectAdapter.setIsSelected(0L);
        projectSelectAdapter.notifyDataSetChanged();
        //Clear organization
        viewModel.organizationId.set(0L);
        organizationSelectAdapter.setIsSelected(0L);
        organizationSelectAdapter.notifyDataSetChanged();
    }
    private void setupSwipeFreshLayout() {
        viewBinding.swipeLayout.setEnabled(true);
        viewBinding.swipeLayout.setOnRefreshListener(() -> {
            selectCategory(viewModel.category.get());
            viewBinding.swipeLayout.setRefreshing(false);
        });
    }
    public void selectCategory(Integer category) {
        viewModel.category.set(category);
        switch (category) {
            case 1:
                viewBinding.rcvSelects.setAdapter(projectSelectAdapter);
                break;
            case 2:
                viewBinding.rcvSelects.setAdapter(organizationSelectAdapter);
                break;
            default:
                break;
        }
    }

    private void getListOrganizations() {
        //Get Data from call API
        viewModel.getOrganizationResponses().observe(this, organizationResponses -> {
            if (organizationResponses != null) {
                organizationSelectAdapter = new OrganizationSelectAdapter(organizationResponses, new OrganizationSelectAdapter.OrganizationSelectListener() {
                    @SuppressLint("NotifyDataSetChanged")
                    @Override
                    public void itemClick(View view, int position) {
                        viewModel.organizationId.set(organizationResponses.get(position).getId());
                        organizationSelectAdapter.setIsSelected(organizationResponses.get(position).getId());
                        organizationSelectAdapter.notifyDataSetChanged();
                    }
                });
                organizationSelectAdapter.setIsSelected(viewModel.organizationId.get());
                organizationSelectAdapter.getOrganizations().add(0, new OrganizationResponse(0L, getResources().getString(R.string.all), null));
                organizationSelectAdapter.notifyItemChanged(0);
            }
        });
    }

    private void getListProjects() {
        viewModel.getProjectResponses().observe(this, projectResponses -> {
            if (projectResponses != null) {
                projectSelectAdapter = new ProjectSelectAdapter(projectResponses, new ProjectSelectAdapter.ProjectSelectListener() {
                    @SuppressLint("NotifyDataSetChanged")
                    @Override
                    public void itemClick(View view, int position) {
                        viewModel.projectId.set(projectResponses.get(position).getId());
                        projectSelectAdapter.setIsSelected(projectResponses.get(position).getId());
                        projectSelectAdapter.notifyDataSetChanged();
                    }
                });
                projectSelectAdapter.setIsSelected(viewModel.projectId.get());
                projectSelectAdapter.getProjects().add(0, new ProjectResponse(0L, getResources().getString(R.string.all), "", null,0));
                projectSelectAdapter.notifyItemChanged(0);
                selectCategory(1);
            }
        });
    }


    public void filter(){
        Intent resultIntent = new Intent();
        Bundle bundle = new Bundle();
        bundle.putLong(Constants.PROJECT_ID, Objects.requireNonNull(viewModel.projectId.get()));
        bundle.putLong(Constants.ORGANIZATION_ID, Objects.requireNonNull(viewModel.organizationId.get()));
        resultIntent.putExtras(bundle);
        setResult(Constants.FILTER, resultIntent);
        finish();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        viewModel.getProjectResponses().removeObservers(this);
        viewModel.getOrganizationResponses().removeObservers(this);
    }
}
