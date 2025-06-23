package com.finance.ui.service.group;

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
import com.finance.data.model.api.response.service.group.ServiceGroupResponse;
import com.finance.databinding.ActivityServiceGroupBinding;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.service.adapter.ServiceGroupAdapter;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.service.group.detail.ServiceGroupDetailActivity;


import java.util.ArrayList;
import java.util.Objects;

public class ServiceGroupActivity extends BaseActivity<ActivityServiceGroupBinding, ServiceGroupViewModel>
        implements View.OnTouchListener
{

    ServiceGroupAdapter adapter;
    private float xAxis, yAxis,initialX,initialY;
    int lastAction;
    ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityResultLauncher();
    Integer currentPosition;
    @Override
    public int getLayoutId() {
        return R.layout.activity_service_group;
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
        //Get all group service
        checkPrivateKey();
        viewBinding.btnAdd.setOnTouchListener(this);
        addScrollForRcv();
        setupSwipeFreshLayout();

        //Get list service groups
        getListServiceGroups();
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getListServiceGroups() {
        viewModel.serviceGroups.observe(this, serviceGroupResponses -> {
            if (serviceGroupResponses == null || serviceGroupResponses.isEmpty())
                return;
            adapter.getGroupServiceResponses().addAll(serviceGroupResponses);
            adapter.setSecretKey(SecretKey.getInstance().getKey());
            if (!checkPermission(Constants.PERMISSION_GROUP_SERVICE_DELETE)){
                for (ServiceGroupResponse groupServiceResponse : adapter.getGroupServiceResponses()){
                    adapter.getViewBinderHelper().lockSwipe(groupServiceResponse.getId().toString());
                }
            }
            adapter.notifyDataSetChanged();
        });
    }

    @SuppressLint("NotifyDataSetChanged")
    private void checkPrivateKey() {
        viewModel.validKey.observe(this, valid->{
            if(valid){
                viewModel.isValidKey.set(true);
                //Default data
                setupAdapter();
                adapter.setSecretKey(SecretKey.getInstance().getKey());
                adapter.setGroupServiceResponses(new ArrayList<>());
                adapter.notifyDataSetChanged();
                viewModel.getAllGroupService(0, Objects.requireNonNull(viewModel.size.get()));
            }else {
                viewModel.isValidKey.set(false);
                if (adapter != null){
                    adapter.setGroupServiceResponses(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                this.showInputKey();
            }
        });
    }

    public void addNewGroupService() {
        viewModel.isCreate.set(true);
        Intent intent = new Intent(ServiceGroupActivity.this, ServiceGroupDetailActivity.class);
        intent.putExtra(Constants.POSITION, true);
        intent.putExtra(Constants.IS_CREATE, true);
        startActivity(intent);
    }

    private void setupAdapter() {
        adapter = new ServiceGroupAdapter(new ArrayList<>(), new ServiceGroupAdapter.GroupServiceListener() {

            @Override
            public void onItemClick(int position, View view) {
                if (checkPermission(Constants.PERMISSION_GROUP_SERVICE_GET)){
                    viewModel.isCreate.set(false);
                    Intent intent = new Intent(view.getContext(), ServiceGroupDetailActivity.class);
                    intent.putExtra(Constants.GROUP_SERVICE_ID, adapter.getGroupServiceResponses().get(position).getId());
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
        viewBinding.rcvGroupServices.setLayoutManager(new LinearLayoutManager(this));
        viewBinding.rcvGroupServices.setAdapter(adapter);
    }

    @SuppressLint("NotifyDataSetChanged")
    private void setupSwipeFreshLayout() {
        viewBinding.swipeLayout.setEnabled(true);
        viewBinding.swipeLayout.setOnRefreshListener(() -> {
            if (checkSecretKeyValid()){
                viewModel.page.set(0);
                adapter.setGroupServiceResponses(new ArrayList<>());
                viewModel.getAllGroupService(Objects.requireNonNull(viewModel.page.get())
                        , Objects.requireNonNull(viewModel.size.get()));
                viewBinding.swipeLayout.setRefreshing(false);
            } else
            {
                if (adapter != null){
                    adapter.setGroupServiceResponses(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                viewBinding.swipeLayout.setRefreshing(false);
                this.showInputKey();
            }
        });
    }
    private void addScrollForRcv() {
        viewBinding.rcvGroupServices.addOnScrollListener(new RecyclerView.OnScrollListener() {
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

                    loadMoreData();
                }
            }
        });
    }
    public void loadMoreData(){
        viewModel.page.set(Objects.requireNonNull(viewModel.page.get()) + 1);
        viewModel.getAllGroupService(
                Objects.requireNonNull(viewModel.page.get()),
                Objects.requireNonNull(viewModel.size.get()));
    }

    public void deleteAt(int pos){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.group_service), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                viewModel.deleteGroupService(adapter.getGroupServiceResponses().get(pos).getId(), new BaseCallBack() {
                    @Override
                    public void doError(Throwable throwable) {
                        viewModel.showErrorMessage(throwable.getMessage());
                    }

                    @SuppressLint("NotifyDataSetChanged")
                    @Override
                    public void doSuccess() {
                        adapter.getGroupServiceResponses().remove(pos);
                        if (adapter.getGroupServiceResponses().isEmpty())
                            viewModel.totalElements.set(0);
                        adapter.notifyDataSetChanged();
                    }
                });

            }
            @Override
            public void cancelDelete() {}
        });
        deleteDialog.show(this.getSupportFragmentManager(), Constants.DELETE_DIALOG);
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
                                    currentPosition = bundle.getInt(Constants.POSITION);
                                    Long id = bundle.getLong(Constants.GROUP_SERVICE_ID);
                                    viewModel.getGroupServiceDetail(id);

                                    //Get group service detail from API
                                    getServiceGroupDetail();
                                }
                            }
                        }
                );
    }

    public void getServiceGroupDetail(){
        viewModel.serviceGroupLiveData.observe(this, serviceGroupResponse -> {
            if (serviceGroupResponse != null){
                adapter.getGroupServiceResponses().get(currentPosition).setName(serviceGroupResponse.getName());
                adapter.getGroupServiceResponses().get(currentPosition).setDescription(serviceGroupResponse.getDescription());
                adapter.notifyItemChanged(currentPosition);
            }
        });
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
