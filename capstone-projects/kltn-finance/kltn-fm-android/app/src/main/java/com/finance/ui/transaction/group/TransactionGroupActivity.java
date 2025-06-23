package com.finance.ui.transaction.group;

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
import com.finance.data.model.api.response.transaction.group.TransactionGroupResponse;
import com.finance.databinding.ActivityTransactionGroupBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.transaction.group.adapter.TransactionGroupAdapter;
import com.finance.ui.transaction.group.detail.TransactionGroupDetailActivity;

import java.util.ArrayList;
import java.util.Objects;

public class TransactionGroupActivity extends BaseActivity<ActivityTransactionGroupBinding, TransactionGroupViewModel>
    implements View.OnTouchListener
{
    private TransactionGroupAdapter adapter;
    private float xAxis, yAxis,initialX,initialY;
    int lastAction;
    ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityResultLauncher();
    Integer position;

    @Override
    public int getLayoutId() {
        return R.layout.activity_transaction_group;
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
        //Get all group transaction
        getListTransactionGroups();

        viewBinding.btnAdd.setOnTouchListener(this);
        addScrollForRcv();
        setupSwipeFreshLayout();
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getListTransactionGroups() {
        viewModel.transactionGroups.observe(this, transactionGroupResponses -> {
            if (transactionGroupResponses == null || transactionGroupResponses.isEmpty())
                return;
            adapter.getGroupTransactionResponses().addAll(transactionGroupResponses);
            adapter.setSecretKey(SecretKey.getInstance().getKey());
            if (!checkPermission(Constants.PERMISSION_GROUP_TRANSACTION_DELETE)){
                for (TransactionGroupResponse groupTransactionResponse : adapter.getGroupTransactionResponses()){
                    adapter.getViewBinderHelper().lockSwipe(groupTransactionResponse.getId().toString());
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
                adapter.setGroupTransactionResponses(new ArrayList<>());
                adapter.notifyDataSetChanged();
                viewModel.getAllGroupTransaction(0, Objects.requireNonNull(viewModel.size.get()));
            }else {
                viewModel.isValidKey.set(false);
                if (adapter != null){

                    adapter.setGroupTransactionResponses(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                this.showInputKey();
            }
        });
    }
    public void addNewGroupTransaction() {
        viewModel.isCreate.set(true);
        Intent intent = new Intent(TransactionGroupActivity.this, TransactionGroupDetailActivity.class);
        intent.putExtra(Constants.IS_CREATE, true);
        startActivity(intent);
        finish();
    }

    @SuppressLint("NotifyDataSetChanged")
    private void setupSwipeFreshLayout() {
        viewBinding.swipeLayout.setEnabled(true);
        viewBinding.swipeLayout.setOnRefreshListener(() -> {
            if (checkSecretKeyValid()){
                viewModel.page.set(0);
                adapter.setGroupTransactionResponses(new ArrayList<>());
                viewModel.getAllGroupTransaction(Objects.requireNonNull(viewModel.page.get())
                        , Objects.requireNonNull(viewModel.size.get()));
                viewBinding.swipeLayout.setRefreshing(false);
            } else
            {
                if (adapter != null){
                    adapter.setGroupTransactionResponses(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                viewBinding.swipeLayout.setRefreshing(false);
                this.showInputKey();
            }
        });
    }

    private void addScrollForRcv() {
        viewBinding.rcvGroupTransactions.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
                LinearLayoutManager layoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
                int totalItemCount = Objects.requireNonNull(layoutManager).getItemCount();
                int lastVisiblePosition = layoutManager.findLastVisibleItemPosition();

                // Check if scrolled to the last item
                if (lastVisiblePosition == totalItemCount - 1 && (
                        Objects.requireNonNull(viewModel.page.get())+1)
                            < Objects.requireNonNull(viewModel.totalPage.get())) {
                    // Perform your action here (e.g., load more data, trigger a notification)
                    loadMoreData();
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
                        if (result == RESULT_OK){
                            Bundle bundle = Objects.requireNonNull(data).getExtras();
                            if (bundle != null){
                                position = bundle.getInt(Constants.POSITION);
                                Long id = bundle.getLong(Constants.GROUP_TRANSACTION_ID);
                                viewModel.getTransactionGroupDetail(id);
                                getTransactionGroupDetail();
                            }
                        }
                    }
            );
    }

    private void getTransactionGroupDetail() {
        viewModel.transactionGroupLiveData.observe(this, transactionGroupResponse -> {
            adapter.getGroupTransactionResponses().get(position).setName(transactionGroupResponse.getName());
            adapter.getGroupTransactionResponses().get(position).setDescription(transactionGroupResponse.getDescription());
            adapter.notifyItemChanged(position);
        });
    }
    private void setupAdapter() {
        adapter = new TransactionGroupAdapter(new ArrayList<>(), new TransactionGroupAdapter.GroupTransactionListener() {

            @Override
            public void onItemClick(int position, View view) {
                if (checkPermission(Constants.PERMISSION_GROUP_TRANSACTION_GET)){
                    viewModel.isCreate.set(false);
                    Intent intent = new Intent(view.getContext(), TransactionGroupDetailActivity.class);
                    intent.putExtra(Constants.GROUP_TRANSACTION_ID, adapter.getGroupTransactionResponses().get(position).getId());
                    intent.putExtra(Constants.POSITION, position);
                    activityResultLauncher.launch(intent);
                }
            }
            @Override
            public void onDeleteClick(int position, View view) {
                viewModel.isCreate.set(false);
                deleteGroupTransaction(position);
            }
        });
        viewBinding.rcvGroupTransactions.setLayoutManager(new LinearLayoutManager(this));
        viewBinding.rcvGroupTransactions.setAdapter(adapter);
    }



    public void loadMoreData(){
        viewModel.page.set(Objects.requireNonNull(viewModel.page.get())+1);
        viewModel.getAllGroupTransaction(Objects.requireNonNull(viewModel.page.get()),
                Objects.requireNonNull(viewModel.size.get()));
    }

    @SuppressLint("NotifyDataSetChanged")
    public void deleteGroupTransaction(int pos){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.group_transaction), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                viewModel.deleteGroupTransaction(adapter.getGroupTransactionResponses().get(pos).getId(), new BaseCallBack() {
                    @Override
                    public void doError(Throwable throwable) {
                        viewModel.showErrorMessage(throwable.getMessage());
                    }

                    @Override
                    public void doSuccess() {
                        adapter.getGroupTransactionResponses().remove(pos);
                        if (adapter.getGroupTransactionResponses().isEmpty()){
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
