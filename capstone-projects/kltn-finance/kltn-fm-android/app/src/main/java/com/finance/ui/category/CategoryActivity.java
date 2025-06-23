package com.finance.ui.category;

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
import com.finance.data.model.api.response.category.CateResponse;
import com.finance.databinding.ActivityCategoryBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.category.adapter.CategoryAdapter;
import com.finance.ui.category.details.CategoryDetailsActivity;
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

public class CategoryActivity extends BaseActivity<ActivityCategoryBinding, CategoryViewModel> implements  View.OnTouchListener{

    private CategoryAdapter categoryAdapter;
    private float xAxis, yAxis,initialX,initialY;
    int lastAction;
    private ActivityResultLauncher<Intent> activityResultLauncher;

    @Override
    public int getLayoutId() {
        return R.layout.activity_category;
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

        categoryAdapter = new CategoryAdapter();
        setRcCategory();

        viewModel.validKey.observe(this, valid->{
            Timber.d("CHECK KEY");
            if(valid){
                getMyCategories();
                viewModel.isValidKey.set(true);
            }else {
                showInputKey();
                viewModel.isValidKey.set(false);
            }
        });

        viewBinding.btnAdd.setOnTouchListener(this);

        activityResultLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        Intent data = result.getData();
                        if(data != null){
                            if(viewModel.positionUC.get() != null){
                                String key = Objects.requireNonNull(data.getExtras()).getString(Constants.CATEGORY);
                                CateResponse cateResponse = ApiModelUtils.fromJson(key, CateResponse.class);
                                assert cateResponse != null;
                                updateCategory(cateResponse.getId());
                            }else {
                                viewModel.pageNumber.set(0);
                                getMyCategories();
                            }
                        }
                    }
                });

        viewBinding.swipeLayout.setOnRefreshListener(() -> {
            viewModel.pageNumber.set(0);
            getMyCategories();
            viewBinding.swipeLayout.setRefreshing(false);
        });

    }

    private void getMyCategories(){
        if (Objects.requireNonNull(viewModel.pageNumber.get()) == 0){
            viewModel.showLoading();
        }
        viewModel.compositeDisposable.add(viewModel.getCategories()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    if(response.isResult() && response.getData().getContent()!=null) {
                        if (Objects.requireNonNull(viewModel.pageNumber.get()) == 0) {
                            categoryAdapter.setCategories(response.getData().getContent());
                        }else {
                            categoryAdapter.addList(response.getData().getContent());
                        }
                    }else {
                        if (Objects.requireNonNull(viewModel.pageNumber.get()) == 0) {
                            categoryAdapter.setCategories(response.getData().getContent());
                        }
                    }
                    viewModel.totalElement.set(categoryAdapter.getItemCount());
                    viewModel.hideLoading();
                },error->{
                    viewModel.showErrorMessage(getString(R.string.newtwork_error));
                    Timber.d(error);
                    viewModel.hideLoading();
                })
        );
    }

    public void setRcCategory(){
        categoryAdapter.setLock(!checkPermission(Constants.PERMISSION_CATEGORY_DELETE));
        LinearLayoutManager layout = new LinearLayoutManager(this,LinearLayoutManager.VERTICAL, false);
        viewBinding.rcCategories.setLayoutManager(layout);
        viewBinding.rcCategories.setAdapter(categoryAdapter);

        categoryAdapter.setCategoryListener(new CategoryAdapter.CategoryListener() {
            @Override
            public void itemClick(int position, CateResponse cateResponse) {
                if(!checkPermission(Constants.PERMISSION_CATEGORY_GET)){
                    return;
                }
                viewModel.positionUC.set(position);
                Intent intent = new Intent(getApplicationContext(), CategoryDetailsActivity.class);
                intent.putExtra(Constants.CATEGORY_ID, cateResponse.getId());
                activityResultLauncher.launch(intent);
            }

            @Override
            public void deleteCategory(int position, CateResponse cateResponse) {
                deleteAt(cateResponse.getId(), position);
            }
        });

        EndlessRecyclerViewScrollListener endlessRecyclerViewScrollListener
                = new EndlessRecyclerViewScrollListener(layout) {
            @Override
            public void onLoadMore(int page, int totalItemsCount, RecyclerView view){
                int pageCurrent = Objects.requireNonNull(viewModel.pageNumber.get());
                viewModel.pageNumber.set(pageCurrent+1);
                getMyCategories();

            }
        };
        viewBinding.rcCategories.addOnScrollListener(endlessRecyclerViewScrollListener);
    }


    @Override
    protected void onResume() {
        super.onResume();
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

                // Get screen dimensions
                DisplayMetrics displayMetrics = new DisplayMetrics();
                getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
                int screenWidth = displayMetrics.widthPixels;
                int screenHeight = displayMetrics.heightPixels;

                // Get the View's dimensions
                int viewWidth = v.getWidth();
                int viewHeight = v.getHeight();

                // Check if the view is being dragged outside the bounds
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

    public void deleteAt(Long id, int position){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.category), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                deleteCategory(id, position);
            }

            @Override
            public void cancelDelete() {

            }
        });
        deleteDialog.show(this.getSupportFragmentManager(), Constants.DELETE_DIALOG);
    }


    public void deleteCategory(Long id, int position){
        viewModel.showLoading();
        viewModel.compositeDisposable.add(viewModel.deleteCategory(id)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap(throwableFlatMap -> {
                            if (NetworkUtils.checkNetworkError(throwableFlatMap)) {
                                viewModel.hideLoading();
                                return ((MVVMApplication) getApplicationContext()).showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwableFlatMap);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            viewModel.hideLoading();
                            if (response.isResult()) {
                                categoryAdapter.deleteItem(position);
                                viewModel.totalElement.set(categoryAdapter.getItemCount());
                                viewModel.showSuccessMessage(getString(R.string.delete_category_success));
                            }else {
                                viewModel.showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            viewModel.hideLoading();
                            viewModel.showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void setKind(Integer kind){
        if(Objects.equals(viewModel.kind.get(), kind)){
            return;
        }
        viewModel.kind.set(kind);
        viewModel.pageNumber.set(0);
        getMyCategories();
    }

    public void navigateToDetails(){
        Intent intent = new Intent(getApplicationContext(), CategoryDetailsActivity.class);
        intent.putExtra(Constants.IS_CREATE, true);
        activityResultLauncher.launch(intent);
        viewModel.positionUC.set(null);
    }

    public void updateCategory(Long id){
        viewModel.compositeDisposable.add(viewModel.getCategory(id)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwableFlatMap -> {
                            if (NetworkUtils.checkNetworkError(throwableFlatMap)) {
                                return ((MVVMApplication) getApplicationContext()).showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwableFlatMap);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            if (response.isResult() && response.getData()!=null) {
                                categoryAdapter.updateItem(viewModel.positionUC.get(), response.getData());
                                viewModel.positionUC.set(null);
                            }
                        }, Timber::d
                ));
    }
}
