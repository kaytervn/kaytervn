package com.finance.ui.organization;

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
import androidx.recyclerview.widget.RecyclerView;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.databinding.ActivityOrganizationBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.organization.adapter.OrganizationAdapter;
import com.finance.ui.organization.detail.OrganizationDetailActivity;

import java.util.ArrayList;
import java.util.Objects;

public class OrganizationActivity extends BaseActivity<ActivityOrganizationBinding, OrganizationViewModel>
        implements View.OnTouchListener
{
    OrganizationAdapter adapter;
    private float xAxis, yAxis,initialX,initialY;
    int lastAction;

    ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityResultLauncher();
    Integer position;

    @Override
    public int getLayoutId() {
        return R.layout.activity_organization;
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

        checkPrivateKey();
        //Get all organization
        getListOrganizations();
        //Get organization detail from API
        getOrganizationDetail();
        viewBinding.btnAdd.setOnTouchListener(this);
        addScrollForRcv();
        setupSwipeFreshLayout();
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getListOrganizations() {
        viewModel.organizations.observe(this, organizationResponses -> {
            if (organizationResponses == null || organizationResponses.isEmpty()){
                return;
            }
            adapter.getOrganizationResponses().addAll(organizationResponses);
            adapter.setSecretKey(SecretKey.getInstance().getKey());
            if (!checkPermission(Constants.PERMISSION_ORGANIZATION_DELETE)){
                for (OrganizationResponse organizationResponse : adapter.getOrganizationResponses()){
                    adapter.getViewBinderHelper().lockSwipe(organizationResponse.getId().toString());
                }
            }
            adapter.notifyDataSetChanged();
        });
    }


    public void addNewOrganization() {
        viewModel.isCreate.set(true);
        Intent intent = new Intent(this, OrganizationDetailActivity.class);
        intent.putExtra(Constants.IS_CREATE, true);
        startActivity(intent);
        finish();
    }
    @SuppressLint("NotifyDataSetChanged")
    private void checkPrivateKey() {
        viewModel.validKey.observe(this, valid->{
            if(valid){
                viewModel.isValidKey.set(true);
                //Default data
                setupAdapter();
                adapter.setSecretKey(SecretKey.getInstance().getKey());
                adapter.setOrganizationResponses(new ArrayList<>());
                adapter.notifyDataSetChanged();
                viewModel.getAllOrganization(0, Objects.requireNonNull(viewModel.size.get()));
            }else {
                viewModel.isValidKey.set(false);
                if (adapter != null){

                    adapter.setOrganizationResponses(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                this.showInputKey();
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
                            if (result == RESULT_OK){
                                assert data != null;
                                Bundle bundle = data.getExtras();
                                if (bundle != null){
                                    position = bundle.getInt(Constants.POSITION);
                                    Long id = bundle.getLong(Constants.ORGANIZATION_ID);
                                    viewModel.getOrganizationDetail(id);


                                }
                            }
                        }
                );
    }

    public void getOrganizationDetail(){
        viewModel.organizationLiveData.observe(this, organizationResponse -> {
            if (organizationResponse != null){
                adapter.getOrganizationResponses().get(position).setName(organizationResponse.getName());
                adapter.getOrganizationResponses().get(position).setLogo(organizationResponse.getLogo());
                adapter.notifyItemChanged(position);
            }
        });
    }

    private void setupAdapter() {
        adapter = new OrganizationAdapter(new ArrayList<>(), new OrganizationAdapter.OrganizationListener() {

            @Override
            public void onItemClick(int position, View view) {
                if (checkPermission(Constants.PERMISSION_ORGANIZATION_GET)){
                    viewModel.isCreate.set(false);
                    Intent intent = new Intent(view.getContext(), OrganizationDetailActivity.class);
                    intent.putExtra(Constants.ORGANIZATION_ID, adapter.getOrganizationResponses().get(position).getId());
                    intent.putExtra(Constants.POSITION, position);
                    activityResultLauncher.launch(intent);
                }
            }
            @Override
            public void onDeleteClick(int position, View view) {
                viewModel.isCreate.set(false);
                deleteAt(position);
            }
        });
        viewBinding.rcvOrganizations.setLayoutManager(new LinearLayoutManager(this));
        viewBinding.rcvOrganizations.setAdapter(adapter);
    }

    private void addScrollForRcv() {
        viewBinding.rcvOrganizations.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
                LinearLayoutManager layoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
                assert layoutManager != null;
                int totalItemCount = layoutManager.getItemCount();
                int lastVisiblePosition = layoutManager.findLastVisibleItemPosition();

                // Check if scrolled to the last item
                if (lastVisiblePosition == totalItemCount - 1
                        && (Objects.requireNonNull(viewModel.page.get())+1)
                        < Objects.requireNonNull(viewModel.totalPage.get())) {
                    // Perform your action here (e.g., load more data, trigger a notification)
                    loadMoreData();
                }
            }
        });
    }
    public void loadMoreData(){
        viewModel.page.set(Objects.requireNonNull(viewModel.page.get())+1);
        viewModel.getAllOrganization(Objects.requireNonNull(viewModel.page.get())
                , Objects.requireNonNull(viewModel.size.get()));
    }
    @SuppressLint("NotifyDataSetChanged")
    private void setupSwipeFreshLayout() {
        viewBinding.swipeLayout.setEnabled(true);
        viewBinding.swipeLayout.setOnRefreshListener(() -> {
            if (checkSecretKeyValid()){
                viewModel.page.set(0);
                adapter.setOrganizationResponses(new ArrayList<>());
                viewModel.getAllOrganization(Objects.requireNonNull(viewModel.page.get())
                        , Objects.requireNonNull(viewModel.size.get()));
                viewBinding.swipeLayout.setRefreshing(false);
            } else
            {
                if (adapter != null){
                    adapter.setOrganizationResponses(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                viewBinding.swipeLayout.setRefreshing(false);
                this.showInputKey();
            }
        });
    }

    @SuppressLint("NotifyDataSetChanged")
    public void deleteAt(int pos){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.organization), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                viewModel.deleteOrganization(adapter.getOrganizationResponses().get(pos).getId(), new BaseCallBack() {
                    @Override
                    public void doError(Throwable throwable) {
                        viewModel.showErrorMessage(throwable.getMessage());
                    }
                    @Override
                    public void doSuccess() {
                        adapter.getOrganizationResponses().remove(pos);
                        if (adapter.getOrganizationResponses().isEmpty())
                            viewModel.totalElements.set(0);
                        adapter.notifyDataSetChanged();
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
