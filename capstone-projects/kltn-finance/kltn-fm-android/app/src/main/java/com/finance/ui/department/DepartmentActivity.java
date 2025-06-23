package com.finance.ui.department;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.MotionEvent;
import android.view.View;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.BR;
import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.response.department.DepartmentResponse;
import com.finance.databinding.ActivityDepartmentBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.department.adapter.DepartmentAdapter;
import com.finance.ui.department.details.DepartmentDetailActivity;
import com.finance.ui.dialog.ConfirmDialog;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.view.EndlessRecyclerViewScrollListener;
import com.finance.utils.NetworkUtils;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;
import timber.log.Timber;

public class DepartmentActivity extends BaseActivity<ActivityDepartmentBinding, DepartmentViewModel> implements View.OnTouchListener, ConfirmDialog.ConfirmDialogListener{
    
    DepartmentAdapter departmentAdapter;
    private float xAxis, yAxis,initialX,initialY;
    int lastAction;
    private final ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityResultLauncher();
    @Override
    public int getLayoutId() {
        return R.layout.activity_department;
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

        departmentAdapter = new DepartmentAdapter();
        getDepartment();

        viewBinding.swipeLayout.setOnRefreshListener(() -> {
            viewModel.pageNumber.set(0);
            getDepartment();
            viewBinding.swipeLayout.setRefreshing(false);
        });
        viewBinding.btnAdd.setOnTouchListener(this);
    }

    private ActivityResultLauncher<Intent> getIntentActivityResultLauncher() {
        return registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        Intent data = result.getData();
                        if(data != null){
                            if(viewModel.positionUC.get() != null){
                                String key = Objects.requireNonNull(data.getExtras()).getString(Constants.DEPARTMENT);
                                DepartmentResponse departmentResponse = ApiModelUtils.fromJson(key, DepartmentResponse.class);
                                departmentAdapter.updateItem(viewModel.positionUC.get(), departmentResponse);
                                viewModel.positionUC.set(null);
                            }else {
                                viewModel.pageNumber.set(0);
                                getDepartment();
                            }
                        }
                    }
                });
    }

    public void navigateToDetails(){
        Intent intent = new Intent(getApplicationContext(), DepartmentDetailActivity.class);
        intent.putExtra(Constants.IS_CREATE, true);
        activityResultLauncher.launch(intent);
        viewModel.positionUC.set(null);
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
                        navigateToDetails();
                    }
                }
                break;

            default:
                return false;
        }
        return true;
    }

    private void getDepartment(){
        if (Objects.requireNonNull(viewModel.pageNumber.get()) == 0) {
            viewModel.showLoading();
        }
        viewModel.compositeDisposable.add(viewModel.getDepartments()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    if(response.isResult()) {
                        if (Objects.requireNonNull(viewModel.pageNumber.get()) == 0
                                && response.getData().getContent()!=null) {
                            departmentAdapter.setDepartments(response.getData().getContent());
                            setRcDepartments();
                        }else {
                            departmentAdapter.addList(response.getData().getContent());
                        }
                        viewModel.totalElement.set(departmentAdapter.getItemCount());
                    }
                    viewModel.hideLoading();
                },error->{
                    viewModel.showErrorMessage(getString(R.string.newtwork_error));
                    Timber.d(error);
                    viewModel.hideLoading();
                })
        );
    }

    public void setRcDepartments(){
        departmentAdapter.setLock(!checkPermission(Constants.PERMISSION_DEPARTMENT_DELETE));
        LinearLayoutManager layout = new LinearLayoutManager(this,LinearLayoutManager.VERTICAL, false);
        viewBinding.rcDepartments.setAdapter(departmentAdapter);

        departmentAdapter.setDepartmentListener(new DepartmentAdapter.DepartmentListener() {
            @Override
            public void itemClick(int position, DepartmentResponse department) {
                if(!checkPermission(Constants.PERMISSION_DEPARTMENT_GET)){
                    return;
                }
                viewModel.positionUC.set(position);
                Intent intent = new Intent(getApplicationContext(), DepartmentDetailActivity.class);
                intent.putExtra(Constants.DEPARTMENT_ID, department.getId());
                activityResultLauncher.launch(intent);
            }

            @Override
            public void deleteDepartment(int position, DepartmentResponse department) {
                deleteAt(department.getId(), position);
            }
        });

        EndlessRecyclerViewScrollListener endlessRecyclerViewScrollListener
                = new EndlessRecyclerViewScrollListener(layout) {
            @Override
            public void onLoadMore(int page, int totalItemsCount, RecyclerView view){
                int pageCurrent = Objects.requireNonNull(viewModel.pageNumber.get());
                viewModel.pageNumber.set(pageCurrent+1);
                getDepartment();
            }
        };
        viewBinding.rcDepartments.addOnScrollListener(endlessRecyclerViewScrollListener);
        viewBinding.rcDepartments.setLayoutManager(layout);
    }

    @Override
    public void confirm() {

    }


    public void deleteAt(Long id, int position){

        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.department), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                deleteDepartment(id, position);
            }

            @Override
            public void cancelDelete() {

            }
        });
        deleteDialog.show(this.getSupportFragmentManager(), Constants.DELETE_DIALOG);

    }

    public void deleteDepartment(Long id, int position){
        viewModel.showLoading();
        viewModel.compositeDisposable.add(viewModel.deleteDepartment(id)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                viewModel.hideLoading();
                                return ((MVVMApplication) getApplicationContext()).showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            viewModel.hideLoading();
                            if (response.isResult()) {
                                departmentAdapter.deleteItem(position);
                                viewModel.totalElement.set(departmentAdapter.getItemCount());
                                viewModel.showSuccessMessage(getString(R.string.delete_department_success));
                            }else {
                                viewModel.showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            viewModel.hideLoading();
                            viewModel.showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    @Override
    protected void onResume() {
        super.onResume();
    }
}
