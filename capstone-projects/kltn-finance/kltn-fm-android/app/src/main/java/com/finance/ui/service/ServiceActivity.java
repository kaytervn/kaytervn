package com.finance.ui.service;

import static java.lang.Math.pow;
import static java.lang.Math.sqrt;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Intent;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.text.Editable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextWatcher;
import android.text.style.StyleSpan;
import android.util.DisplayMetrics;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.Observable;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.service.ServiceResponse;
import com.finance.databinding.ActivityServiceBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.service.adapter.ServiceAdapter;
import com.finance.ui.service.detail.ServiceDetailActivity;
import com.finance.ui.service.schedule.ServiceScheduleActivity;
import com.finance.utils.DateUtils;
import com.github.dewinjm.monthyearpicker.MonthYearPickerDialogFragment;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Objects;

public class
ServiceActivity extends BaseActivity<ActivityServiceBinding, ServiceViewModel>
    implements  View.OnTouchListener
{
    private Integer positionBackFromDetail, positionAfterResolve;
    private Boolean isResolve = false;
    private List<ServiceResponse> services;
    ServiceAdapter adapter;
    private float xAxis, yAxis,initialX,initialY;
    int lastAction;
    //ServicePay
    private EditText editDate;
    private int periodKind;
    //Set up activityResultLauncher for update profile
    ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityResultLauncher();

    @Override
    public int getLayoutId() {
        return R.layout.activity_service;
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
        viewBinding.btnAdd.setOnTouchListener(this);
        setupAdapter();
        setupSwipeFreshLayout();
        setupSearch();
        //Get list services from API
        getListServices();
        //Get service detail from update - API
        getServiceDetail();
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getListServices() {
        viewModel.services.observe(this, serviceResponses -> {
            if (serviceResponses == null || serviceResponses.isEmpty())
                return;
            for (ServiceResponse serviceResponse : serviceResponses){
                serviceResponse.setName(decrypt(serviceResponse.getName()));
                serviceResponse.calculateDayToExpiration();
            }
            services = serviceResponses;
            adapter.setServiceResponses(serviceResponses);
            viewBinding.rcvServices.scrollToPosition(0);
            adapter.notifyDataSetChanged();
        });
    }

    private void getServiceDetail() {
        viewModel.serviceLiveData.observe(this, serviceResponse -> {
            //resolve
            if (serviceResponse != null && serviceResponse.getId() != null && isResolve){
                serviceResponse.setName(decrypt(serviceResponse.getName()));
                serviceResponse.calculateDayToExpiration();
                adapter.getServiceResponses().set(positionAfterResolve, serviceResponse);
                adapter.notifyItemChanged(positionAfterResolve);
                isResolve = false;
            }
            //update
            else {
                assert serviceResponse != null;
                serviceResponse.setName(decrypt(serviceResponse.getName()));
                serviceResponse.calculateDayToExpiration();
                adapter.getServiceResponses().set(positionBackFromDetail, serviceResponse);
                adapter.notifyItemChanged(positionBackFromDetail);
            }
        });
    }

    public void sortServiceByExpirationDate(){
        viewModel.sort.set(3);
        viewModel.getAllServices(viewModel.sort.get());
    }
    public void sortServiceByCreatedDate(){
        viewModel.sort.set(0);
        viewModel.getAllServices(null);
    }

    private void setupSearch() {
        viewBinding.edtSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                List<ServiceResponse> serviceResponsesFilter = new ArrayList<>();
                String editSearch = viewBinding.edtSearch.getText().toString();
                viewModel.isSearchEmpty.set(editSearch);
                if (services == null || services.isEmpty()){
                    return;
                }
                for (ServiceResponse serviceResponse : services){
                    if (serviceResponse.getName().toLowerCase().contains(editSearch.toLowerCase())){
                        serviceResponsesFilter.add(serviceResponse);
                    }
                }
                adapter.setServiceResponses(serviceResponsesFilter);
                adapter.notifyDataSetChanged();
                viewModel.totalElements.set(serviceResponsesFilter.size());
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        viewModel.isSearch.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                if (Boolean.TRUE.equals(viewModel.isSearch.get())){
                    viewBinding.rcvServices.stopScroll();
                    viewBinding.rcvServices.scrollToPosition(0);
                    viewBinding.edtSearch.requestFocus();
                    showKeyboard();
                }
            }
        });
        SpannableString spannableHint = new SpannableString(viewBinding.edtSearch.getHint());
        spannableHint.setSpan(new StyleSpan(Typeface.ITALIC), 0, viewBinding.edtSearch.getHint().length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        viewBinding.edtSearch.setHint(spannableHint);
    }

    @SuppressLint("NotifyDataSetChanged")
    private void checkPrivateKey() {
        viewModel.validKey.observe(this,valid->{
            if(valid){
                viewModel.isValidKey.set(true);
                //Default data
                setupAdapter();
                adapter.setServiceResponses(new ArrayList<>());
                adapter.setSecretKey(SecretKey.getInstance().getKey());
                adapter.notifyDataSetChanged();
                //Check if sort by Date
                if (Objects.requireNonNull(viewModel.sort.get()) == 3){
                    viewModel.getAllServices(viewModel.sort.get());
                } else {
                    viewModel.getAllServices(null);
                }
            }else {
                viewModel.isValidKey.set(false);
                if (adapter != null){
                    adapter.setServiceResponses(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                showInputKey();
            }
        });
    }

    public void addNewService() {
        viewModel.isCreate.set(true);
        Intent intent = new Intent(ServiceActivity.this, ServiceDetailActivity.class);
        intent.putExtra(Constants.IS_CREATE, true);
        startActivity(intent);
    }

    @SuppressLint("NotifyDataSetChanged")
    private void setupSwipeFreshLayout() {
        viewBinding.swipeLayout.setEnabled(true);
        viewBinding.swipeLayout.setOnRefreshListener(() -> {
            viewBinding.edtSearch.setText("");
            if (checkSecretKeyValid()){
                //Check if sort by Date
                if (Objects.requireNonNull(viewModel.sort.get()) == 3){
                    viewModel.getAllServices( viewModel.sort.get());
                } else {
                    viewModel.getAllServices( null);
                }
                viewBinding.swipeLayout.setRefreshing(false);
            } else
            {
                if (adapter != null){
                    adapter.setServiceResponses(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                viewBinding.swipeLayout.setRefreshing(false);
                showInputKey();
            }
        });
    }

    private void setupAdapter() {
        adapter = new ServiceAdapter(new ArrayList<>(), new ServiceAdapter.ServiceListener() {
            @Override
            public void onItemClick(int position, View view) {
                if (checkPermission(Constants.PERMISSION_SERVICE_GET)){
                    viewModel.isCreate.set(false);
                    Intent intent = new Intent(view.getContext(), ServiceDetailActivity.class);
                    intent.putExtra(Constants.SERVICE_ID, adapter.getServiceResponses().get(position).getId());
                    intent.putExtra(Constants.POSITION, position);
                    activityResultLauncher.launch(intent);
                }
            }
            @Override
            public void onDeleteClick(int position, View view) {
                viewModel.isCreate.set(false);
                deleteAt(position);
            }

            @Override
            public void onCalendarClick(int position, View view) {
                viewModel.isCreate.set(false);
                Intent intent = new Intent(view.getContext(), ServiceScheduleActivity.class);
                intent.putExtra(Constants.SERVICE_ID, adapter.getServiceResponses().get(position).getId());
                startActivity(intent);
            }

            @Override
            public void onPayClick(int position, View view) {
                periodKind = adapter.getServiceResponses().get(position).getPeriodKind();
                payServiceAt(position);
            }
        });

        viewBinding.rcvServices.setLayoutManager(new LinearLayoutManager(this));
        viewBinding.rcvServices.setAdapter(adapter);
    }


    private void payServiceAt(int position) {
        Dialog dialog = new Dialog(ServiceActivity.this);
        // Set the content view
        dialog.setContentView(R.layout.dialog_pay);
        Window window = dialog.getWindow();
        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);
        Button btnConfirm = dialog.findViewById(R.id.btn_confirm);
        Button btnCancel = dialog.findViewById(R.id.btn_cancel);
        LinearLayout tvTitle = dialog.findViewById(R.id.layout_title_date);
        RelativeLayout layoutPickDate = dialog.findViewById(R.id.layout_pick_date);
        editDate = dialog.findViewById(R.id.tv_pick_date);

        //Set default date
        Calendar calendar = Calendar.getInstance();
        String expirationDate = adapter.getServiceResponses().get(position).getExpirationDate();
        int eDay, eMonth, eYear;
        String mDate = DateUtils.getDayMonthYear(adapter.getServiceResponses().get(position).getStartDate());
        int sDay = Integer.parseInt(mDate.split("/")[0]);
        String mDate2 = DateUtils.getDayMonthYear(expirationDate);
        eDay = Integer.parseInt(mDate2.split("/")[0]);
        eMonth = Integer.parseInt(mDate2.split("/")[1]) - 1;
        eYear = Integer.parseInt(mDate2.split("/")[2]);
        calendar.set(eYear, eMonth, eDay);
        if (periodKind == 2)
            calendar.add(Calendar.MONTH, 1);
        else if (periodKind == 3)
            calendar.add(Calendar.YEAR, 1);
        int dateOfMonth = sDay;
        int dueDayOfMonth = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
        if (dateOfMonth > 28) {
            dateOfMonth = Math.min(dateOfMonth, dueDayOfMonth);
        }
        @SuppressLint("DefaultLocale")
        String date = String.format("%02d/%02d/%04d",dateOfMonth, calendar.get(Calendar.MONTH)+1, eYear);
        editDate.setText(date);

        if (periodKind == 1){
            tvTitle.setVisibility(View.GONE);
            layoutPickDate.setVisibility(View.GONE);
        } else {
            tvTitle.setVisibility(View.VISIBLE);
            layoutPickDate.setVisibility(View.VISIBLE);
            editDate.setOnClickListener(v ->
                    showPickMonthYearDialog(adapter.getServiceResponses().get(position).getStartDate(),
                            adapter.getServiceResponses().get(position).getExpirationDate())
            );
            layoutPickDate.setOnClickListener(v ->
                    showPickMonthYearDialog(adapter.getServiceResponses().get(position).getStartDate(),
                    adapter.getServiceResponses().get(position).getExpirationDate())
            );
        }

        btnCancel.setOnClickListener(v -> dialog.dismiss());
        btnConfirm.setOnClickListener(v -> {
            if (periodKind == 1)
                viewModel.payService(adapter.getServiceResponses().get(position).getId(),
                        null,
                        new BaseCallBack() {
                            @Override
                            public void doError(Throwable throwable) {
                                viewModel.showErrorMessage(getString(R.string.invalid_date));
                            }

                            @Override
                            public void doSuccess() {
                                //Call List Service again
                                viewModel.getServiceDetail(adapter.getServiceResponses().get(position).getId());
                                positionAfterResolve = position;
                                isResolve = true;
                                viewModel.showSuccessMessage(getString(R.string.pay_service_success));
                            }
                        });
            else {
                viewModel.payService(adapter.getServiceResponses().get(position).getId(),
                        editDate.getText().toString()+ " 07:00:00",
                        new BaseCallBack() {
                            @Override
                            public void doError(Throwable throwable) {
                                viewModel.showErrorMessage(getString(R.string.invalid_date));
                            }

                            @Override
                            public void doSuccess() {
                                //Call List Service again
                                viewModel.getServiceDetail(adapter.getServiceResponses().get(position).getId());
                                positionAfterResolve = position;
                                isResolve = true;
                                viewModel.showSuccessMessage(getString(R.string.pay_service_success));
                            }
                        });
            }

            dialog.dismiss();
        });
        dialog.show();
    }

    public void showPickMonthYearDialog(String startDate, String expirationDate) {
        int yearSelected;
        int monthSelected;
        int sDay, sMonth, sYear, eDay, eMonth, eYear;
        //minDate
        Calendar calendar = Calendar.getInstance();
        long minDate = calendar.getTimeInMillis();
        //startDate
        String mDate = DateUtils.getDayMonthYear(startDate);
        sDay = Integer.parseInt(mDate.split("/")[0]);
        sMonth = Integer.parseInt(mDate.split("/")[1]) - 1;
        sYear = Integer.parseInt(mDate.split("/")[2]);
        calendar.set(sYear, sMonth, sDay);

        //maxDate
        calendar.clear();
        calendar.set(2100, 12, 31);
        long maxDate = calendar.getTimeInMillis();
        //Set default values
        calendar.clear();
        String mDate2 = DateUtils.getDayMonthYear(expirationDate);
        eDay = Integer.parseInt(mDate2.split("/")[0]);
        eMonth = Integer.parseInt(mDate2.split("/")[1]) - 1;
        eYear = Integer.parseInt(mDate2.split("/")[2]);
        calendar.set(eYear, eMonth, eDay);
        if (periodKind == 2)
            calendar.add(Calendar.MONTH, 1);
        else if (periodKind == 3)
            calendar.add(Calendar.YEAR, 1);
        yearSelected = calendar.get(Calendar.YEAR);
        monthSelected = calendar.get(Calendar.MONTH);

        //Title
        String title = getString(R.string.pick_month_year);
        MonthYearPickerDialogFragment dialogFragment = MonthYearPickerDialogFragment
                .getInstance(monthSelected, yearSelected, minDate, maxDate,title);

        dialogFragment.setOnDateSetListener((year1, monthOfYear) -> {
            // do something
            Calendar currentPickDate = Calendar.getInstance();
            currentPickDate.set(year1, monthOfYear, 1);
            int dateOfMonth = sDay;
            int dueDayOfMonth = currentPickDate.getActualMaximum(Calendar.DAY_OF_MONTH);
            if (dateOfMonth > 28) {
                dateOfMonth = Math.min(dateOfMonth, dueDayOfMonth);
            }
            @SuppressLint("DefaultLocale")
            String date = String.format("%02d/%02d/%04d",dateOfMonth, monthOfYear + 1, year1);
            editDate.setText(date);

        });
        dialogFragment.show(getSupportFragmentManager(), null);

    }

    @NonNull
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
                                positionBackFromDetail = bundle.getInt(Constants.POSITION);
                                Long id =  bundle.getLong(Constants.SERVICE_ID);
                                viewModel.getServiceDetail(id);
                            }
                        }
                    }
            );

    }

    public void deleteAt(int pos){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.service), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                viewModel.deleteService(adapter.getServiceResponses().get(pos).getId(), new BaseCallBack() {
                    @Override
                    public void doError(Throwable throwable) {
                        viewModel.showErrorMessage(throwable.getMessage());
                    }

                    @Override
                    public void doSuccess() {
                        adapter.getServiceResponses().remove(pos);
                        if (adapter.getServiceResponses().isEmpty()){
                            viewModel.totalElements.set(0);
                        }
                        adapter.notifyItemRangeChanged(pos, adapter.getServiceResponses().size());
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
                    float distance = (float) sqrt(pow(finalX - initialX, 2) + pow(finalY - initialY, 2));
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

    public void deleteEditSearch(){
        viewBinding.edtSearch.setText("");
    }



    @Override
    public void onBackPressed() {
        if (Boolean.TRUE.equals(viewModel.isSearch.get())){
            viewModel.isShowSearch();
            deleteEditSearch();
            hideKeyboard();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        viewModel.services.removeObservers(this);
        viewModel.serviceLiveData.removeObservers(this);
        super.onDestroy();
    }
}
