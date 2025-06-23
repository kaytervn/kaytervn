package com.finance.ui.service.schedule;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.response.service.schedule.ServiceScheduleResponse;
import com.finance.databinding.ActivityServiceScheduleBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.service.adapter.ServiceScheduleAdapter;

import java.util.Collections;
import java.util.Objects;

import timber.log.Timber;

public class ServiceScheduleActivity extends BaseActivity<ActivityServiceScheduleBinding, ServiceScheduleViewModel>
{

    private ServiceScheduleAdapter adapter;
    private Integer currentPos = -1;

    @Override
    public int getLayoutId() {
        return R.layout.activity_service_schedule;
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
        viewModel.serviceId.set(getIntent().getLongExtra(Constants.SERVICE_ID, 0));
        setupAdapter();
        viewModel.getAllServiceSchedules(viewModel.serviceId.get());
        getListServiceSchedules();
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getListServiceSchedules() {
        viewModel.serviceSchedules.observe(this, serviceScheduleResponses -> {
            if (serviceScheduleResponses == null || serviceScheduleResponses.isEmpty())
                return;

            Objects.requireNonNull(viewModel.numberOfDueDaysList.get()).clear();
            for (ServiceScheduleResponse item : serviceScheduleResponses){
                Objects.requireNonNull(viewModel.numberOfDueDaysList.get()).add(item.getNumberOfDueDays());
            }
            Collections.sort(Objects.requireNonNull(viewModel.numberOfDueDaysList.get()), Collections.reverseOrder());
            adapter.setListNumbers(viewModel.numberOfDueDaysList.get());
            adapter.notifyDataSetChanged();
        });
    }

    @SuppressLint("NotifyDataSetChanged")
    public void addServiceSchedule() {
        try {
            if (viewBinding.editNameServiceSchedule.getText().toString().isEmpty()) {
                viewModel.showErrorMessage(getString(R.string.error_empty_number_service_schedule));
            } else {
                Integer number = Integer.parseInt(viewBinding.editNameServiceSchedule.getText().toString());
                if (Objects.requireNonNull(viewModel.numberOfDueDaysList.get()).contains(number)) {
                    viewModel.showErrorMessage(getString(R.string.error_exist_number_service_schedule));
                } else {
                    viewBinding.editNameServiceSchedule.setText("");
                    Objects.requireNonNull(viewModel.numberOfDueDaysList.get()).add(number);
                    viewModel.isHaveServiceSchedule.set(true);
                    Collections.sort(Objects.requireNonNull(viewModel.numberOfDueDaysList.get()), Collections.reverseOrder());
                    adapter.setListNumbers(viewModel.numberOfDueDaysList.get());
                    adapter.notifyDataSetChanged();
                }
            }
        } catch (Exception e){
            Timber.e(e);
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    public void updateServiceSchedule(){
        if (viewBinding.editNameServiceSchedule.getText().toString().isEmpty()) {
            viewModel.showErrorMessage(getString(R.string.error_empty_number_service_schedule));
            return;
        }
        Integer number = Integer.parseInt(viewBinding.editNameServiceSchedule.getText().toString());

        //Check if the number is already in the list
        for (int i = 0; i < Objects.requireNonNull(viewModel.numberOfDueDaysList.get()).size(); i++){
            if (i == currentPos){
                continue;
            }
            if (Objects.requireNonNull(viewModel.numberOfDueDaysList.get()).get(i).equals(number)){
                viewModel.showErrorMessage(getString(R.string.error_exist_number_service_schedule));
                return;
            }
        }
        viewModel.isUpdate.set(false);
        viewBinding.editNameServiceSchedule.setText("");
        Objects.requireNonNull(viewModel.numberOfDueDaysList.get()).set(currentPos, number);
        viewModel.isHaveServiceSchedule.set(true);
        Collections.sort(Objects.requireNonNull(viewModel.numberOfDueDaysList.get()), Collections.reverseOrder());
        adapter.setListNumbers(viewModel.numberOfDueDaysList.get());
        adapter.notifyDataSetChanged();


    }

    @SuppressLint("NotifyDataSetChanged")
    public void deleteServiceSchedule(int pos){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.service_schedule_string), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                Objects.requireNonNull(viewModel.numberOfDueDaysList.get()).remove(pos);
                adapter.setListNumbers(viewModel.numberOfDueDaysList.get());
                adapter.notifyDataSetChanged();
                if (Objects.requireNonNull(viewModel.numberOfDueDaysList.get()).isEmpty()){
                    viewModel.isHaveServiceSchedule.set(false);
                }
            }

            @Override
            public void cancelDelete() {

            }
        });
        deleteDialog.show(this.getSupportFragmentManager(), Constants.DELETE_DIALOG);
    }


    public void setupAdapter(){
        adapter = new ServiceScheduleAdapter(viewModel.numberOfDueDaysList.get(), new ServiceScheduleAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int pos) {
                viewModel.isUpdate.set(true);
                viewBinding.editNameServiceSchedule.setText(
                        String.valueOf(Objects.requireNonNull(viewModel.numberOfDueDaysList.get()).get(pos)));
                currentPos = pos;

                viewBinding.editNameServiceSchedule.requestFocus();
                viewBinding.editNameServiceSchedule.setSelection(viewBinding.editNameServiceSchedule.getText().length());
            }
            @Override
            public void onDeleteClick(View view, int position) {
                deleteServiceSchedule(position);
            }
        });
        viewBinding.rcvServiceSchedules.setAdapter(adapter);
        viewBinding.rcvServiceSchedules.setLayoutManager(new LinearLayoutManager(this));
    }

}
