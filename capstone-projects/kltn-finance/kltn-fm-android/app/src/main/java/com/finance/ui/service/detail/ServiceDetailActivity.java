package com.finance.ui.service.detail;

import android.annotation.SuppressLint;
import android.app.DatePickerDialog;
import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.ArrayAdapter;

import androidx.annotation.Nullable;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.response.service.group.ServiceGroupResponse;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.databinding.ActivityServiceDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.tag.adapter.TagColorAdapter;
import com.finance.utils.DateUtils;
import com.finance.utils.NumberUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Objects;

import timber.log.Timber;

public class ServiceDetailActivity extends BaseActivity<ActivityServiceDetailBinding, ServiceDetailViewModel>
{
    private ArrayAdapter<String> adapterKind;
    private ArrayAdapter<String> adapterServiceGroup;
    private ArrayAdapter<String> adapterPeriod;
    private TagColorAdapter adapterTag;
    private List<ServiceGroupResponse> serviceGroups = new ArrayList<>();
    private List<TagResponse> mListTags;

    Boolean startDate = true;
    @Override
    public int getLayoutId() {
        return R.layout.activity_service_detail;
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

        long id = getIntent().getLongExtra(Constants.SERVICE_ID, -999);
        viewModel.position.set(getIntent().getIntExtra(Constants.POSITION,0));
        viewModel.isCreated.set(getIntent().getBooleanExtra(Constants.IS_CREATE,false));
        viewModel.isFromNotify.set(getIntent().getBooleanExtra(Constants.FROM_NOTIFICATION, false));

        setupKindCbb();
        setupPeriodCbb();
        setupOnItemClickForAllCbb();
        setupOnClickForAllCbb();
        addTextChangeEditMoney();
        setupDateDefault();

        //Update service
        if (Boolean.FALSE.equals(viewModel.isCreated.get()) && id != -999){
            viewModel.getServiceDetail(id);
            getServiceDetail();
        }
        viewModel.getListTags();
        viewModel.getAllServiceGroups();
        //Get data from APi
        getListServiceGroups();
        getListTags();
    }

    private void setupOnClickForAllCbb() {
        viewBinding.cbbServiceGroup.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.cbbServiceGroup.postDelayed(() ->
                    viewBinding.cbbServiceGroup.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN);
        });
        viewBinding.cbbTag.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.cbbTag.postDelayed(() ->
                    viewBinding.cbbTag.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN
            );
        });
    }

    private void getServiceDetail() {
        viewModel.serviceLiveData.observe(this, serviceResponse -> {
            if (serviceResponse == null || serviceResponse.getId() == null)
                return;
            //Name, Description
            serviceResponse.setName(decrypt(serviceResponse.getName()));
            serviceResponse.setDescription(decrypt(serviceResponse.getDescription()));
            Objects.requireNonNull(viewModel.serviceRequest.get()).setServiceCreateUpdateRequest(serviceResponse);
            viewModel.serviceRequest.notifyChange();
            //Money
            Objects.requireNonNull(viewModel.serviceRequest.get()).setMoney(
                    Double.parseDouble(decrypt(serviceResponse.getMoney())));
            String customMoney = NumberUtils.custom_money_not_currency(
                    Objects.requireNonNull(viewModel.serviceRequest.get()).getMoney());
            viewBinding.editServiceMoney.setText(customMoney);

            //Kind
            if (serviceResponse.getKind() == 1)
                viewBinding.cbbServiceKind.setText(adapterKind.getItem(0), false);
            else if (serviceResponse.getKind() == 2)
                viewBinding.cbbServiceKind.setText(adapterKind.getItem(1), false);

            //Period
            viewBinding.cbbServicePeriod.setText(adapterPeriod.getItem(serviceResponse.getPeriodKind() - 1), false);
            suggestDayForExpiration(serviceResponse.getPeriodKind());

            //Start Date
            Timber.tag("StartDate").e(Objects.requireNonNull(viewModel.serviceRequest.get()).getStartDate());
            viewBinding.tvPickServiceStartDate.setText(
                    DateUtils.getDayMonthYear(
                            DateUtils.convertFromUTCToDefaultApi(
                                    Objects.requireNonNull(viewModel.serviceRequest.get()).getStartDate())));
            Timber.tag("StartDate").e(
                    DateUtils.convertFromUTCToDefaultApi(
                            Objects.requireNonNull(viewModel.serviceRequest.get()).getStartDate()));

            //Expiration Date
            Timber.tag("StartDate - 2").e(Objects.requireNonNull(viewModel.serviceRequest.get()).getExpirationDate());
            viewBinding.tvPickServiceExpirationDate.setText(
                    DateUtils.getDayMonthYear(
                            DateUtils.convertFromUTCToDefaultApi(
                                    Objects.requireNonNull(viewModel.serviceRequest.get()).getExpirationDate())));
            Timber.tag("StartDate - 2").e(
                    DateUtils.convertFromUTCToDefaultApi(
                            Objects.requireNonNull(viewModel.serviceRequest.get()).getExpirationDate()));
        });
    }

    private void getListServiceGroups() {
        viewModel.serviceGroups.observe(this, serviceGroupResponses -> {
            if (serviceGroupResponses == null || serviceGroupResponses.isEmpty())
                return;
            viewModel.showLoading();
            serviceGroups = serviceGroupResponses;
            List<String> serviceGroupNames = new ArrayList<>();
            for (ServiceGroupResponse serviceGroupResponse : serviceGroupResponses) {
                serviceGroupNames.add(decrypt(serviceGroupResponse.getName()));
            }
            adapterServiceGroup = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, serviceGroupNames);
            viewBinding.cbbServiceGroup.setAdapter(adapterServiceGroup);

            for (int i = 0; i < serviceGroupResponses.size(); i++) {
                if (serviceGroupResponses.get(i).getId().equals(
                        Objects.requireNonNull(viewModel.serviceRequest.get()).getServiceGroupId())) {
                    viewBinding.cbbServiceGroup.setText(adapterServiceGroup.getItem(i), false);
                    break;
                }
            }
            viewModel.hideLoading();
        });
    }

    private void getListTags() {
        viewModel.tags.observe(this, tagResponses -> {
            if (tagResponses == null || tagResponses.isEmpty()) {
                viewModel.isHaveTag.set(false);
                return;
            }
            viewModel.showLoading();
            for (TagResponse tagResponse : tagResponses) {
                tagResponse.setName(decrypt(tagResponse.getName()));
                tagResponse.setColorCode(decrypt(tagResponse.getColorCode()));
            }
            mListTags = tagResponses;
            adapterTag = new TagColorAdapter(this, tagResponses);
            viewBinding.cbbTag.setAdapter(adapterTag);

            if (Boolean.FALSE.equals(viewModel.isCreated.get())){
                //Check if transaction group id is null or not
                if (Objects.requireNonNull(viewModel.serviceRequest.get()).getTagId() != null){
                    for (int i = 0; i < tagResponses.size(); i++) {
                        if (tagResponses.get(i).getId().equals(
                                Objects.requireNonNull(viewModel.serviceRequest.get()).getTagId())) {
                            viewBinding.layoutColor.setVisibility(View.VISIBLE);
                            viewBinding.cbbTag.setText(Objects.requireNonNull(adapterTag.getItem(i)).getName(), false);
                            viewBinding.layoutColor.setColorFilter(Color.parseColor(Objects.requireNonNull(adapterTag.getItem(i)).getColorCode()));
                            break;
                        }
                    }
                }
            }
            viewModel.hideLoading();

        });
    }

    private void setupOnItemClickForAllCbb(){
        viewBinding.cbbServiceKind.setOnItemClickListener((adapterView, view, position, l) ->
                Objects.requireNonNull(viewModel.serviceRequest.get()).setKind(position + 1)
        );

        viewBinding.cbbServiceGroup.setOnItemClickListener((adapterView, view, position, l) -> {
            Objects.requireNonNull(viewModel.serviceRequest.get()).setServiceGroupId(
                    serviceGroups.get(position).getId());
            hideKeyboard();
        });

        viewBinding.cbbServicePeriod.setOnItemClickListener((adapterView, view, position, l) -> {
            viewModel.isChoosePeriod.set(true);
            switch (position)
            {
                case 0:
                    suggestDayForExpiration(1);
                    break;
                case 1:
                    suggestDayForExpiration(2);
                    break;
                case 2:
                    suggestDayForExpiration(3);
                    break;
                default:
                    break;
            }
            Objects.requireNonNull(viewModel.serviceRequest.get()).setPeriodKind(position + 1);
            viewModel.serviceRequest.notifyChange();
        });

        viewBinding.cbbTag.setOnItemClickListener((adapterView, view, i, l) -> {
            Objects.requireNonNull(viewModel.serviceRequest.get()).
                    setTagId(mListTags.get(i).getId());
            viewBinding.layoutColor.setVisibility(View.VISIBLE);
            viewBinding.cbbTag.setText(mListTags.get(i).getName(), false);
            viewBinding.layoutColor.setColorFilter(Color.parseColor(mListTags.get(i).getColorCode()));
            hideKeyboard();
        });
    }

    private void setupKindCbb() {
        List<String> kindNames = new ArrayList<>();
        kindNames.add(this.getResources().getString(R.string.kind_1)); //Thu
        kindNames.add(this.getResources().getString(R.string.kind_2));
        adapterKind = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, kindNames);
        viewBinding.cbbServiceKind.setAdapter(adapterKind);

    }

    public void createOrUpdate() {
        //Handle right group service
        if (!viewBinding.cbbServiceGroup.getText().toString().isEmpty()){
            for (ServiceGroupResponse groupServiceResponse : serviceGroups) {
                if (decrypt(groupServiceResponse.getName()).equals(viewBinding.cbbServiceGroup.getText().toString())){
                    viewModel.isRightGroupService.set(true);
                    break;
                }
            }
        } else {
            viewModel.showErrorMessage(getString(R.string.invalid_service_group));
            return;
        }

        //Handle right tag
        if (!viewBinding.cbbTag.getText().toString().isEmpty()){
            for (TagResponse tagResponse : mListTags) {
                if (tagResponse.getName().equals(viewBinding.cbbTag.getText().toString())){
                    viewModel.isRightTag.set(true);
                    break;
                }
            }
        }
        else{
            Objects.requireNonNull(viewModel.serviceRequest.get()).setTagId(null);
            viewModel.isRightTag.set(true);
        }

        //StartDate, ExpirationDate
        Objects.requireNonNull(viewModel.serviceRequest.get()).setStartDate(
                DateUtils.convertFromDefaultToUTCApi(
                        viewBinding.tvPickServiceStartDate.getText().toString()+ " 07:00:00") );
        if (Objects.requireNonNull(viewModel.serviceRequest.get()).getPeriodKind() != null
                && Objects.requireNonNull(viewModel.serviceRequest.get()).getPeriodKind() == 1)
            Objects.requireNonNull(viewModel.serviceRequest.get()).setExpirationDate(
                    DateUtils.convertFromDefaultToUTCApi(viewBinding.tvPickServiceExpirationDate.getText().toString()+ " 07:00:00") );
        else
            Objects.requireNonNull(viewModel.serviceRequest.get()).setExpirationDate(null);
        //Name, Money, Description
        if (viewBinding.editServiceName.getText().toString().isEmpty())
            Objects.requireNonNull(viewModel.serviceRequest.get()).setName(null);
        else
            Objects.requireNonNull(viewModel.serviceRequest.get()).setName(viewBinding.editServiceName.getText().toString());
        // Money
        if (viewBinding.editServiceMoney.getText().toString().isEmpty())
            Objects.requireNonNull(viewModel.serviceRequest.get()).setMoney(null);
        else {
            Objects.requireNonNull(viewModel.serviceRequest.get()).setMoney(Double.parseDouble(
                    NumberUtils.unFormatNumber(viewBinding.editServiceMoney.getText().toString())));
            Objects.requireNonNull(viewModel.serviceRequest.get()).setMoney(
                    Double.parseDouble(NumberUtils.unFormatNumber(viewBinding.editServiceMoney.getText().toString())));
        }
        Objects.requireNonNull(viewModel.serviceRequest.get()).setDescription(viewBinding.editServiceDescription.getText().toString());

        if(Boolean.TRUE.equals(viewModel.isCreated.get()))
            viewModel.createService();
        else {
            viewModel.updateService();
        }
        hideKeyboard();
    }
    @SuppressLint("DefaultLocale")
    private void setupDateDefault() {
        //Pick current date as default
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) + 1);
        viewBinding.tvPickServiceStartDate.setText(
                String.format("%02d/%02d/%04d", day, month + 1, year));
        viewBinding.tvPickServiceExpirationDate.setText(
                String.format("%02d/%02d/%04d", calendar.get(Calendar.DATE), calendar.get(Calendar.MONTH) + 1, calendar.get(Calendar.YEAR)));
    }

    private void addTextChangeEditMoney() {
        viewBinding.editServiceMoney.addTextChangedListener(new TextWatcher() {
            private String current = "";

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
            }

            @Override
            public void afterTextChanged(Editable s) {
                if (!s.toString().equals(current)) {
                    viewBinding.editServiceMoney.removeTextChangedListener(this);
                    String cleanString = s.toString().replaceAll(",", "");
                    String formatted = NumberUtils.formatNumber(cleanString);
                    current = formatted;
                    viewBinding.editServiceMoney.setText(formatted);
                    viewBinding.editServiceMoney.setSelection(formatted.length());
                    viewBinding.editServiceMoney.addTextChangedListener(this);
                }
            }
        });
    }



    private void setupPeriodCbb() {
        List<String> periodNames = new ArrayList<>();
        periodNames.add(this.getResources().getString(R.string.Day));
        periodNames.add(this.getResources().getString(R.string.month));
        periodNames.add(this.getResources().getString(R.string.year));
        //Period
        adapterPeriod = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, periodNames);
        viewBinding.cbbServicePeriod.setAdapter(adapterPeriod);

    }

    private void suggestDayForExpiration(Integer type) {
        Calendar calendar = Calendar.getInstance();
        Calendar currentDate = Calendar.getInstance();
        Calendar tempDate = Calendar.getInstance();
        @SuppressLint("SimpleDateFormat")
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        try {
            calendar.setTime(Objects.requireNonNull(dateFormat.parse(viewBinding.tvPickServiceStartDate.getText().toString())));
            if (type == 1){
                calendar.add(Calendar.DATE, 1);
            }
            else if (type == 2){
                tempDate.setTime(Objects.requireNonNull(dateFormat.parse(
                        viewBinding.tvPickServiceStartDate.getText().toString())));
                tempDate.set(Calendar.MONTH, currentDate.get(Calendar.MONTH));
                tempDate.set(Calendar.YEAR, currentDate.get(Calendar.YEAR));
                if (tempDate.before(currentDate)){
                    currentDate.add(Calendar.MONTH, 1);
                    currentDate.set(Calendar.DATE, calendar.get(Calendar.DATE));
                    calendar.setTime(currentDate.getTime());
                } else {
                    calendar.setTime(tempDate.getTime());
                }
            } else if (type == 3){
                calendar.set(Calendar.YEAR, calendar.get(Calendar.YEAR) + 1);
                if (calendar.before(currentDate)){
                    currentDate.set(Calendar.DATE, calendar.get(Calendar.DATE));
                    currentDate.set(Calendar.MONTH, calendar.get(Calendar.MONTH));
                    currentDate.set(Calendar.YEAR, currentDate.get(Calendar.YEAR) + 1);
                    calendar = currentDate;
                }
            }
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        viewBinding.tvPickServiceExpirationDate.setText(dateFormat.format(calendar.getTime()));
    }

    public void pickExpirationDate(){
        startDate = false;
        if (Boolean.TRUE.equals(viewModel.isCreated.get())) {
            Objects.requireNonNull(viewModel.serviceRequest.get()).setExpirationDate(
                    viewBinding.tvPickServiceExpirationDate.getText().toString()+ " 23:59:59");
            showDatePickerDialog(Objects.requireNonNull(viewModel.serviceRequest.get()).getExpirationDate());
        } else {
            if (Objects.requireNonNull(viewModel.serviceRequest.get()).getExpirationDate() == null)
                Objects.requireNonNull(viewModel.serviceRequest.get()).setExpirationDate(
                        DateUtils.convertFromDefaultToUTC(
                                viewBinding.tvPickServiceExpirationDate.getText().toString()+ " 23:59:59"));

            showDatePickerDialog(DateUtils.convertFromUTCToDefaultApi(
                    Objects.requireNonNull(viewModel.serviceRequest.get()).getExpirationDate()));
        }
    }

    //TODO MAYBE change Expiration
    public void pickStartDate(){
        startDate = true;
        if (Boolean.TRUE.equals(viewModel.isCreated.get())) {
            Objects.requireNonNull(viewModel.serviceRequest.get()).setStartDate(
                    viewBinding.tvPickServiceStartDate.getText().toString()+ " 00:00:00");
            showDatePickerDialog(Objects.requireNonNull(viewModel.serviceRequest.get()).getStartDate());
        } else {
            if (Objects.requireNonNull(viewModel.serviceRequest.get()).getStartDate() == null)
                Objects.requireNonNull(viewModel.serviceRequest.get()).setStartDate(
                        DateUtils.convertFromUTCToDefaultApi(
                                viewBinding.tvPickServiceStartDate.getText().toString()+ " 00:00:00"));

            showDatePickerDialog(DateUtils.convertFromUTCToDefaultApi(
                    Objects.requireNonNull(viewModel.serviceRequest.get()).getStartDate()));
        }
    }

    private void showDatePickerDialog(String dateTime) {
        String date = DateUtils.getDayMonthYear(dateTime);
        int day = Integer.parseInt(date.split("/")[0]);
        int month = Integer.parseInt(date.split("/")[1]) - 1;
        int year = Integer.parseInt(date.split("/")[2]);
        //Pick current date as default
        DatePickerDialog dialog = new DatePickerDialog(this, (datePicker, year1, month1, day1) -> {
            @SuppressLint("DefaultLocale") String date1 = String.format("%02d/%02d/%04d", day1, month1 + 1, year1);
            if (startDate) {
                viewBinding.tvPickServiceStartDate.setText(date1);
                if (Objects.requireNonNull(viewModel.serviceRequest.get()).getPeriodKind() == 2){
                    suggestDayForExpiration(2);
                } else if (Objects.requireNonNull(viewModel.serviceRequest.get()).getPeriodKind() == 3){
                    suggestDayForExpiration(3);
                }
            } else {
                viewBinding.tvPickServiceExpirationDate.setText(date1);
            }
        }, year, month, day); //Pass year, month and day to date picker

        dialog.show(); //Show dialog
    }

    @Override
    public void onBackPressed() {
        hideKeyboard();
        super.onBackPressed();
    }
    @Override
    protected void onDestroy() {
        viewModel.serviceLiveData.removeObservers(this);
        viewModel.serviceGroups.removeObservers(this);
        viewModel.tags.removeObservers(this);
        super.onDestroy();
    }
}
