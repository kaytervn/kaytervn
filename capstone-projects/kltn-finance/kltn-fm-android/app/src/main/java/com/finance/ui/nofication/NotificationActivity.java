package com.finance.ui.nofication;

import android.annotation.SuppressLint;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.response.notification.NotificationResponse;
import com.finance.databinding.ActivityNotificationBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.dialog.ConfirmDialog;
import com.finance.ui.dialog.YesNoDialog;
import com.finance.ui.nofication.adapter.NotificationAdapter;
import com.finance.ui.view.EndlessRecyclerViewScrollListener;

import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class NotificationActivity extends BaseActivity<ActivityNotificationBinding, NotificationViewModel>
        implements ConfirmDialog.ConfirmDialogListener, YesNoDialog.Listener
{
    
    NotificationAdapter notificationAdapter;
    ConfirmDialog confirmDialog;
    YesNoDialog yesNoDialog;

    //0: delete
    //1: delete all
    private Integer kindDialog;

    @Override
    public int getLayoutId() {
        return R.layout.activity_notification;
    }

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    public void performDependencyInjection(ActivityComponent buildComponent) {
        buildComponent.inject(this);
    }


    @SuppressLint("NotifyDataSetChanged")
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        notificationAdapter = new NotificationAdapter();
        setRcNotifications();

        viewBinding.layoutHeader.imgOther.setImageResource(R.drawable.ic_menu);
        viewBinding.layoutHeader.imgOther.setOnClickListener(v -> viewModel.showFilter());

        viewModel.notificationList.observe(this, notificationResponses -> {
            if(notificationResponses!=null){
                if (Objects.requireNonNull(viewModel.pageNumber.get()) == 0) {
                    notificationAdapter.setNotifications(notificationResponses);
                }else {
                    notificationAdapter.addList(notificationResponses);
                }
                notificationAdapter.notifyDataSetChanged();
            }
        });

        viewModel.getMyNotification();
        viewBinding.swipeLayout.setOnRefreshListener(() -> {
            viewModel.pageNumber.set(0);
            viewModel.getMyNotification();
            viewBinding.swipeLayout.setRefreshing(false);
        });

        notificationAdapter = new NotificationAdapter();
        setRcNotifications();
    }

    public void setRcNotifications(){
        LinearLayoutManager layout = new LinearLayoutManager(this,LinearLayoutManager.VERTICAL, false);
        viewBinding.rcNotification.setAdapter(notificationAdapter);

        notificationAdapter.setNotificationListener(new NotificationAdapter.NotificationListener() {
            @Override
            public void itemClick(int position, NotificationResponse notification) {
                viewModel.closeFilter();
                viewModel.readNotification(notification.getId(), new BaseCallBack() {
                    @Override
                    public void doError(Throwable throwable) {
                        viewModel.showErrorMessage(getResources().getString(R.string.no_internet));
                    }

                    @Override
                    public void doSuccess() {
                        notification.setState(1);
                        notificationAdapter.updateItem(position,notification);
                    }
                });

            }

            @Override
            public void deleteNotification(int position, NotificationResponse notification) {
                viewModel.closeFilter();
                viewModel.position.set(position);
                showDeleteDialog(0,getString(R.string.confirm_delete_dialog));
            }
        } );

        EndlessRecyclerViewScrollListener endlessRecyclerViewScrollListener
                = new EndlessRecyclerViewScrollListener(layout) {
            @Override
            public void onLoadMore(int page, int totalItemsCount, RecyclerView view){
                int pageCurrent = Objects.requireNonNull(viewModel.pageNumber.get());
                viewModel.pageNumber.set(pageCurrent+1);
                viewModel.getMyNotification();
            }
        };
        viewBinding.rcNotification.addOnScrollListener(endlessRecyclerViewScrollListener);
        viewBinding.rcNotification.setLayoutManager(layout);
    }

    @Override
    public void confirm() {
        if(kindDialog == 0){
            deleteNotification();
        }else if(kindDialog == 1){
            confirmDialog.dismiss();
            viewModel.deleteAllNotifications();
        }
    }

    public void showYesNoDialog(){
        yesNoDialog = new YesNoDialog(getString(R.string.read_all_notification), getString(R.string.cancel), getString(R.string.confirm));
        yesNoDialog.show(this.getSupportFragmentManager(), Constants.YES_NO_DIALOG_FRAGMENT);
        yesNoDialog.setListener(this);
    }

    public void showDeleteDialog(Integer kindDialog, String title){
        this.kindDialog = kindDialog;
        confirmDialog = new ConfirmDialog();
        confirmDialog.setTitle(title);
        confirmDialog.show(this.getSupportFragmentManager(),Constants.CONFIRM_DIALOG);
        confirmDialog.setListener(this);
    }

    public void deleteNotification(){
        viewModel.showLoading();
        viewModel.compositeDisposable.add(viewModel.deleteNotification(
                notificationAdapter.getNotifications().get(Objects.requireNonNull(viewModel.position.get())).getId())
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        response -> {
                            viewModel.hideLoading();
                            if (response.isResult()) {
                                notificationAdapter.deleteItem(Objects.requireNonNull(viewModel.position.get()));
                                viewModel.totalElement.set(notificationAdapter.getItemCount());
                                confirmDialog.dismiss();
                                viewModel.showSuccessMessage(response.getMessage());
                            }else {
                                viewModel.showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            viewModel.hideLoading();
                            viewModel.showErrorMessage(getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void deleteAllNotification(){
        showDeleteDialog(1,getString(R.string.confirm_delete_all_notification));
        viewModel.closeFilter();
    }

    public void readAllNotification(){
        showYesNoDialog();
        viewModel.closeFilter();
    }

    @Override
    public void confirmYN() {
        yesNoDialog.dismiss();
        viewModel.pageNumber.set(0);
        viewModel.readAllNotifications();
    }

    @Override
    public void cancelYN() {

    }
}
