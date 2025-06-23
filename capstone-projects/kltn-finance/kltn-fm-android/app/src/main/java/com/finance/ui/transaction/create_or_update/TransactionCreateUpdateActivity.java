package com.finance.ui.transaction.create_or_update;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ArrayAdapter;
import android.widget.RelativeLayout;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.request.transaction.TransactionCreateUpdateRequest;
import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.data.model.api.response.category.CategoryResponse;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.ui.document.adapter.DocumentAdapter;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.finance.data.model.api.response.transaction.TransactionResponse;
import com.finance.data.model.api.response.transaction.group.TransactionGroupResponse;
import com.finance.databinding.ActivityTransactionCreateUpdateBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.tag.adapter.TagColorAdapter;
import com.finance.utils.AESUtils;
import com.finance.utils.DateUtils;
import com.finance.utils.FileUtils;
import com.finance.utils.NumberUtils;
import com.finance.utils.RealPathUtil;
import com.github.dhaval2404.imagepicker.ImagePicker;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Objects;

import okhttp3.MultipartBody;

public class TransactionCreateUpdateActivity extends BaseActivity<ActivityTransactionCreateUpdateBinding, TransactionCreateUpdateViewModel>
{
    //Adapter for cbb
    private ArrayAdapter<String> adapterKind;
    private ArrayAdapter<String> adapterCategory;
    private ArrayAdapter<String> adapterTransactionGroup;
    private ArrayAdapter<String> adapterAccount;
    private TagColorAdapter adapterTag;
    //List of group transaction, category, account
    private List<TransactionGroupResponse> mListGroupTransactions;
    private List<CategoryResponse> mListCategories;
    private List<AccountResponse> mListAccounts;
    private List<TagResponse> mListTags;

    //Document and current document
    private DocumentAdapter mDocumentAdapter;
    private DocumentResponse currentDocument = new DocumentResponse();
    private Integer currentDocumentPosition = -1;

    @Override
    public int getLayoutId() {
        return R.layout.activity_transaction_create_update;
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
        setupDocumentAdapter();
        setupCbbKind();
        setupOnClickForAllCbb();
        setupOnItemClickForAllCbb();
        addTextChangeEditTextMoney();
        //Check create or update
        viewModel.isCreated.set(getIntent().getBooleanExtra(Constants.IS_CREATE, false));
        //--Update
        if (Boolean.FALSE.equals(viewModel.isCreated.get())){
            if (!getDataFromIntent())
                return;
        }

        if (checkPermissionToCallApiGetListAccount())
            viewModel.getListAccounts();
        viewModel.getListTags();
        viewModel.getAllGroupTransaction();
        //Get data from api and setup adapter for cbb
        getListGroupTransactions();
        getListCategories();
        getListTags();
        getDocumentAfterUpload();
        getListAccounts();

    }

    @SuppressLint("NotifyDataSetChanged")
    private void getDocumentAfterUpload() {
        viewModel.filePathDocuments.observe(this, filePath -> {
            if (filePath !=null && !filePath.isEmpty()){
                currentDocument.setUrl(filePath);
                //User update file
                if (currentDocumentPosition != -1) {
                    mDocumentAdapter.getListDocument().set(currentDocumentPosition, currentDocument);
                    currentDocumentPosition = -1;
                    mDocumentAdapter.notifyItemChanged(currentDocumentPosition);
                }
                //User add new file
                else {
                    mDocumentAdapter.getListDocument().add(currentDocument);
                    mDocumentAdapter.notifyDataSetChanged();
                }
            }
        });
    }

    private void getListGroupTransactions() {
        viewModel.groupTransactions.observe(this, groupTransactions -> {
            if (groupTransactions == null || groupTransactions.isEmpty()){
                viewModel.isHaveGroupTransaction.set(false);
                return;
            }
            mListGroupTransactions = groupTransactions;
            List<String> groupTransactionNames = new ArrayList<>();
            for (TransactionGroupResponse groupTransactionResponse : groupTransactions) {
                groupTransactionNames.add(decrypt(groupTransactionResponse.getName()));
            }
            adapterTransactionGroup = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, groupTransactionNames);
            viewBinding.cbbTransactionGroup.setAdapter(adapterTransactionGroup);

            //Check if transaction group id is null or not
            if (Objects.requireNonNull(viewModel.transactionRequest.get()).getTransactionGroupId() != null){
                for (int i = 0; i < groupTransactions.size(); i++) {
                    if (groupTransactions.get(i).getId().equals(
                            Objects.requireNonNull(viewModel.transactionRequest.get()).getTransactionGroupId())) {
                        viewBinding.cbbTransactionGroup.setText(adapterTransactionGroup.getItem(i), false);
                        break;
                    }
                }
            }
        });
    }

    private void getListCategories() {
        viewModel.categories.observe(this, categoryResponses -> {
            if (categoryResponses == null || categoryResponses.isEmpty()) {
                viewModel.isHaveCategory.set(false);
                return;
            }
            mListCategories = categoryResponses;
            List<String> categoryNames = new ArrayList<>();
            for (CategoryResponse categoryResponse : categoryResponses) {
                categoryNames.add(AESUtils.decrypt(SecretKey.getInstance().getKey(), categoryResponse.getName(), false));
            }
            adapterCategory = new ArrayAdapter<>(this,R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, categoryNames);
            viewBinding.cbbTransactionCategory.setAdapter(adapterCategory);

            if (Boolean.FALSE.equals(viewModel.isCreated.get())){
                //Check if transaction group id is null or not
                if (Objects.requireNonNull(viewModel.transactionRequest.get()).getCategoryId() != null){
                    for (int i = 0; i < categoryResponses.size(); i++) {
                        if (categoryResponses.get(i).getId().equals(
                                Objects.requireNonNull(viewModel.transactionRequest.get()).getCategoryId())) {
                            viewBinding.cbbTransactionCategory.setText(adapterCategory.getItem(i), false);
                            break;
                        }
                    }
                }
            }

        });
    }

    private void getListTags() {
        viewModel.tags.observe(this, tagResponses -> {
            if (tagResponses == null || tagResponses.isEmpty()) {
                viewModel.isHaveTag.set(false);
                return;
            }

            for (TagResponse tagResponse : tagResponses) {
                tagResponse.setName(decrypt(tagResponse.getName()));
                tagResponse.setColorCode(decrypt(tagResponse.getColorCode()));
            }

            mListTags = tagResponses;
            adapterTag = new TagColorAdapter(this, tagResponses);
            viewBinding.cbbTag.setAdapter(adapterTag);

            if (Boolean.FALSE.equals(viewModel.isCreated.get())){
                //Check if transaction group id is null or not
                if (Objects.requireNonNull(viewModel.transactionRequest.get()).getTagId() != null){
                    for (int i = 0; i < tagResponses.size(); i++) {
                        if (tagResponses.get(i).getId().equals(
                                Objects.requireNonNull(viewModel.transactionRequest.get()).getTagId())) {
                            viewBinding.layoutColor.setVisibility(View.VISIBLE);
                            viewBinding.cbbTag.setText(Objects.requireNonNull(adapterTag.getItem(i)).getName(), false);
                            viewBinding.layoutColor.setColorFilter(Color.parseColor(Objects.requireNonNull(adapterTag.getItem(i)).getColorCode()));
                            break;
                        }
                    }
                }
            }

        });
    }

    private void getListAccounts() {
        viewModel.accounts.observe(this, accountResponses -> {
            if (accountResponses == null || accountResponses.isEmpty()){
                viewModel.isHaveAccount.set(false);
                return;
            }
            mListAccounts = accountResponses;
            List<String> accountNames = new ArrayList<>();
            for (AccountResponse accountResponse : accountResponses) {
                accountNames.add(accountResponse.getFullName());
            }
            adapterAccount = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, accountNames);
            viewBinding.cbbAddedBy.setAdapter(adapterAccount);
            viewBinding.cbbApproveBy.setAdapter(adapterAccount);
            if (Boolean.TRUE.equals(viewModel.isCreated.get())){
                //Set current account
                for (int i = 0; i < accountNames.size(); i++) {
                    if (accountResponses.get(i).getId().equals(getAccount().getId())) {
                        viewBinding.cbbAddedBy.setText(adapterAccount.getItem(i), false);
                        break;
                    }
                }
            } else {
                //AddedBy always not null
                for (int i = 0; i < accountResponses.size(); i++) {
                    if (accountResponses.get(i).getId().equals(
                            Objects.requireNonNull(viewModel.transactionRequest.get()).getAddedBy())) {
                        viewBinding.cbbAddedBy.setText(adapterAccount.getItem(i), false);
                        break;
                    }
                }
                //Check if approveBy null or not
                if (Objects.requireNonNull(viewModel.transactionRequest.get()).getApprovedBy() != null) {
                    for (int i = 0; i < accountResponses.size(); i++) {
                        if (accountResponses.get(i).getId().equals(
                                Objects.requireNonNull(viewModel.transactionRequest.get()).getApprovedBy())) {
                            viewBinding.cbbApproveBy.setText(adapterAccount.getItem(i), false);
                            break;
                        }
                    }
                }
            }
        });
    }

    private boolean checkPermissionToCallApiGetListAccount() {
        if (Boolean.FALSE.equals(viewModel.isCreated.get())
                && !checkPermission(Constants.PERMISSION_TRANSACTION_UPDATE_FULL_AUTHENTICATION)){
            return false;
        }
        if (Boolean.TRUE.equals(viewModel.isCreated.get())
                && !checkPermission(Constants.PERMISSION_TRANSACTION_CREATE_FULL_AUTHENTICATION)){
            viewBinding.cbbAddedBy.setAdapter(adapterAccount);
            viewBinding.cbbApproveBy.setAdapter(adapterAccount);
            viewBinding.cbbAddedBy.setText(getAccount().getFullName());
            return false;
        }
        return true;
    }





    private void setupOnClickForAllCbb() {
        viewBinding.cbbTransactionGroup.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.cbbTransactionGroup.postDelayed(() ->
                    viewBinding.cbbTransactionGroup.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN);
        });
        viewBinding.cbbTransactionCategory.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.cbbTransactionCategory.postDelayed(
                    () -> viewBinding.cbbTransactionCategory.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN
            );
        });
        viewBinding.cbbTag.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.cbbTag.postDelayed(() ->
                    viewBinding.cbbTag.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN
            );
        });
        viewBinding.cbbAddedBy.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.cbbAddedBy.postDelayed(() ->
                    viewBinding.cbbAddedBy.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN
            );
        });
        viewBinding.cbbApproveBy.setOnClickListener(v -> {
            showKeyboard();
            viewBinding.cbbApproveBy.postDelayed(() ->
                    viewBinding.cbbApproveBy.showDropDown(), Constants.DELAY_SHOW_DROP_DOWN
            );
        });
    }

    public void pickTransactionDate(){
        if (viewBinding.pickTransactionDate.getText().toString().isEmpty()){
            Calendar calendar = Calendar.getInstance();
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONTH);
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            String dateMonthYearCurrent = day + "/" + (month + 1) + "/" + year;
            showDatePickerDialog(dateMonthYearCurrent + " 00:00:00");
        }
        else
            showDatePickerDialog(viewBinding.pickTransactionDate.getText().toString() + " 00:00:00");

    }

    private void showDatePickerDialog(String dateTime) {
        String date = DateUtils.getDayMonthYear(dateTime);
        int day = Integer.parseInt(date.split("/")[0]);
        int month = Integer.parseInt(date.split("/")[1]) - 1;
        int year = Integer.parseInt(date.split("/")[2]);
        //Pick current date as default
        DatePickerDialog dialog = new DatePickerDialog(this,
                (datePicker, year1, month1, day1) -> {
            @SuppressLint("DefaultLocale")
            String date1 = String.format("%02d/%02d/%04d", day1, month1 + 1, year1);
            viewBinding.pickTransactionDate.setText(date1);
            String dateUTC = DateUtils.convertFromDefaultToUTCApi(date1 + " 00:00:00");
            Objects.requireNonNull(viewModel.transactionRequest.get()).setTransactionDate(dateUTC);
        }, year, month, day); //Pass year, month and day to date picker

        dialog.getDatePicker().setMaxDate(System.currentTimeMillis());
        dialog.show(); //Show dialog
    }

    private void setupDocumentAdapter() {
        mDocumentAdapter = new DocumentAdapter( new ArrayList<>(), new DocumentAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int pos) {
                currentDocumentPosition = pos;
                showDialogChooseFile();
            }

            @Override
            public void onDeleteClick(View view, int pos) {
                deleteDocumentAt(pos);
            }
        });
        viewBinding.rcvDocuments.setAdapter(mDocumentAdapter);
        viewBinding.rcvDocuments.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));
    }

    @SuppressLint("NotifyDataSetChanged")
    public void deleteDocumentAt(int pos){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.document), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                mDocumentAdapter.getListDocument().remove(pos);
                mDocumentAdapter.notifyDataSetChanged();
            }
            @Override
            public void cancelDelete() {

            }
        });
        deleteDialog.show(this.getSupportFragmentManager(), Constants.DELETE_DIALOG);
    }

    private void openGallery() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("*/*");
        String[] mimeTypes = {
                "application/pdf",
                "image/*"};
        intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
        activityResultLauncher.launch(intent);
    }
    private final ActivityResultLauncher<Intent> activityResultLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    Uri selectedImageUri = result.getData().getData();
                    String filePath = FileUtils.getFileFromUri(selectedImageUri, this);
                    //Get file name and type
                    String filename = filePath.substring(filePath.lastIndexOf("/") + 1);
                    //Pass them to current document
                    currentDocument = new DocumentResponse();
                    currentDocument.setName(filename);
                    MultipartBody.Part imagePart = FileUtils.filePathToMultipartBodyPart(filePath, "file");
                    //Call API to upload image
                    viewModel.doUploadFile(imagePart);
                }
            });

    private void openCamera() {
        ImagePicker.with(TransactionCreateUpdateActivity.this)
                .cameraOnly()
                .cropSquare()
                .start();
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == ImagePicker.REQUEST_CODE) {
            if (resultCode == RESULT_OK && data != null) {
                Uri selectedImageUri = data.getData();
                currentDocument = new DocumentResponse();
                String filePath = RealPathUtil.getRealPath(this, selectedImageUri);
                String filename = filePath.substring(filePath.lastIndexOf("/") + 1);
                currentDocument.setName(filename);
                MultipartBody.Part imagePart = FileUtils.uriToMultipartBodyPart(selectedImageUri, "file", this);
                // Call API to upload image
                viewModel.doUploadFile(imagePart);
            }
        }
    }



    private void setupOnItemClickForAllCbb() {
        viewBinding.cbbTransactionKind.setOnItemClickListener((parent, view, position, id) -> {
            if (position == 0){
                Objects.requireNonNull(viewModel.transactionRequest.get()).setKind(1);
                viewModel.getAllCategoryByKind(1);
            } else {
                Objects.requireNonNull(viewModel.transactionRequest.get()).setKind(2);
                viewModel.getAllCategoryByKind(2);
            }
        });
        viewBinding.cbbTransactionGroup.setOnItemClickListener((adapterView, view, position, id) -> {
            Objects.requireNonNull(viewModel.transactionRequest.get()).
                    setTransactionGroupId(mListGroupTransactions.get(position).getId());
            hideKeyboard();
        });
        viewBinding.cbbTransactionCategory.setOnItemClickListener((adapterView, view, position, id) -> {
            Objects.requireNonNull(viewModel.transactionRequest.get()).
                    setCategoryId(mListCategories.get(position).getId());
            hideKeyboard();
        });
        viewBinding.cbbTag.setOnItemClickListener((adapterView, view, i, l) -> {
            Objects.requireNonNull(viewModel.transactionRequest.get()).
                    setTagId(mListTags.get(i).getId());
            viewBinding.layoutColor.setVisibility(View.VISIBLE);
            viewBinding.cbbTag.setText(mListTags.get(i).getName(), false);
            viewBinding.layoutColor.setColorFilter(Color.parseColor(mListTags.get(i).getColorCode()));
            hideKeyboard();
        });
        viewBinding.cbbAddedBy.setOnItemClickListener((adapterView, view, position, id) -> {
            Objects.requireNonNull(viewModel.transactionRequest.get()).
                    setAddedBy(mListAccounts.get(position).getId());
            hideKeyboard();
        });
        viewBinding.cbbApproveBy.setOnItemClickListener((adapterView, view, position, id) -> {
            Objects.requireNonNull(viewModel.transactionRequest.get()).
                    setApprovedBy(mListAccounts.get(position).getId());
            hideKeyboard();
        });
    }

    public void createOrUpdateTransaction() {
        //Debit
        if (viewBinding.cbCreateDebit.isChecked()){
            Objects.requireNonNull(viewModel.transactionRequest.get()).setIgnoreDebit(0);
        } else
            Objects.requireNonNull(viewModel.transactionRequest.get()).setIgnoreDebit(null);
        //Handle right category
        if (!viewBinding.cbbTransactionCategory.getText().toString().isEmpty()){
            for (CategoryResponse categoryResponse : mListCategories) {
                if (decrypt(categoryResponse.getName()).equals(viewBinding.cbbTransactionCategory.getText().toString())){
                    viewModel.isRightCategory.set(true);
                    break;
                }
            }
        }
        else{
            Objects.requireNonNull(viewModel.transactionRequest.get()).setCategoryId(null);
            viewModel.isRightCategory.set(true);
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
            Objects.requireNonNull(viewModel.transactionRequest.get()).setTagId(null);
            viewModel.isRightTag.set(true);
        }

        //Handle right group transaction
        if (!viewBinding.cbbTransactionGroup.getText().toString().isEmpty()){
            for (TransactionGroupResponse groupTransactionResponse : mListGroupTransactions) {
                if (decrypt(groupTransactionResponse.getName()).equals(viewBinding.cbbTransactionGroup.getText().toString())){
                    viewModel.isRightGroupTransaction.set(true);
                    break;
                }
            }
        } else {
            viewModel.showErrorMessage(getString(R.string.invalid_transaction_group));
            return;
        }

        //Handle right Account Added By (can be null)
        if (!viewBinding.cbbAddedBy.getText().toString().isEmpty()){
            for (AccountResponse accountResponse : mListAccounts ) {
                if (accountResponse.getFullName().equals(viewBinding.cbbAddedBy.getText().toString())){
                    viewModel.isRightAccountAddedBy.set(true);
                    break;
                }
            }
        }

        //Handle right Account Approved By
        //--Choose Right
        if (!viewBinding.cbbApproveBy.getText().toString().isEmpty()){
            for (AccountResponse accountResponse : mListAccounts) {
                if (accountResponse.getFullName().equals(viewBinding.cbbApproveBy.getText().toString())){
                    viewModel.isRightAccountApprovedBy.set(true);
                    break;
                }
            }
        }
        else{
            //approved -> Obliged to have approved by
            if (Boolean.FALSE.equals(viewModel.isCreated.get())
                    && Objects.requireNonNull(viewModel.transactionRequest.get()).getState() == 2){
                viewModel.showErrorMessage(getString(R.string.account_approved_empty));
                return;
            }
            //created -> not Obliged to have approved by
            Objects.requireNonNull(viewModel.transactionRequest.get()).setApprovedBy(null);
            viewModel.isRightAccountApprovedBy.set(true);
        }

        if (viewBinding.editTransactionMoney.getText().toString().isEmpty()){
            Objects.requireNonNull(viewModel.transactionRequest.get()).setMoney(null);
        }
        else {
            String unFormatMoney = NumberUtils.unFormatNumber(viewBinding.editTransactionMoney.getText().toString());
            Double money = Double.parseDouble(unFormatMoney);
            Objects.requireNonNull(viewModel.transactionRequest.get()).setMoney(money);
        }

        //Document
        if (!mDocumentAdapter.getListDocument().isEmpty()){
            //Parse json to transaction create
            Gson gson = new Gson();
            String json = gson.toJson( mDocumentAdapter.getListDocument());
            Objects.requireNonNull(viewModel.transactionRequest.get()).setDocument(json);
        } else {
            Objects.requireNonNull(viewModel.transactionRequest.get()).setDocument(null);
        }

        if (Boolean.TRUE.equals(viewModel.isCreated.get()))
            viewModel.createTransaction();
        else
            viewModel.updateTransaction();
    }

    private void addTextChangeEditTextMoney() {
        viewBinding.editTransactionMoney.addTextChangedListener(new TextWatcher() {
            private String current = "";
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {}

            @Override
            public void afterTextChanged(Editable s) {
                if (!s.toString().equals(current)) {
                    viewBinding.editTransactionMoney.removeTextChangedListener(this);
                    String cleanString = s.toString().replaceAll(",", "");
                    String formatted = NumberUtils.formatNumber(cleanString);
                    current = formatted;
                    viewBinding.editTransactionMoney.setText(formatted);
                    viewBinding.editTransactionMoney.setSelection(formatted.length());
                    viewBinding.editTransactionMoney.addTextChangedListener(this);
                }
            }
        });
    }
    private void setupCbbKind() {
        List<String> kindNames = new ArrayList<>();
        kindNames.add(getResources().getString(R.string.kind_1));
        kindNames.add(getResources().getString(R.string.kind_2));
        adapterKind = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, kindNames);
        viewBinding.cbbTransactionKind.setAdapter(adapterKind);
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == Constants.STORAGE_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openGallery();
            } else {
                Toast.makeText(this, R.string.not_permission_gallery, Toast.LENGTH_SHORT).show();
            }
        } else if (requestCode == Constants.CAMERA_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openCamera();
            } else {
                Toast.makeText(this, R.string.not_permission_camera, Toast.LENGTH_SHORT).show();
            }
        }
    }
    public void showDialogChooseFile() {
        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_file_picker);
        Window window = dialog.getWindow();
        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);
        RelativeLayout btnGallery = dialog.findViewById(R.id.btn_galery);
        RelativeLayout btnCamera = dialog.findViewById(R.id.btn_camera);
        btnGallery.setOnClickListener(v -> {
            // Gallery option clicked
            dialog.dismiss();
            // Check multiple permissions
            boolean hasStoragePermission = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
            boolean hasMediaImagesPermission = true; // Default true for older Android
            // For Android 13+ (API 33+)
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                hasMediaImagesPermission = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES) == PackageManager.PERMISSION_GRANTED;
            }

            if (!hasStoragePermission || !hasMediaImagesPermission) {
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                    // Android 13+
                    ActivityCompat.requestPermissions(this,
                            new String[]{
                                    Manifest.permission.READ_MEDIA_IMAGES,
                                    Manifest.permission.READ_MEDIA_VIDEO
                            }, Constants.STORAGE_REQUEST);
                } else {
                    // Android 12 and below
                    ActivityCompat.requestPermissions(this,
                            new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, Constants.STORAGE_REQUEST);
                }
            } else {
                openGallery();
            }
        });
        btnCamera.setOnClickListener(v -> {
            // Camera option clicked
            dialog.dismiss();
            if (ContextCompat.checkSelfPermission(TransactionCreateUpdateActivity.this, Manifest.permission.CAMERA)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(TransactionCreateUpdateActivity.this,
                        new String[]{Manifest.permission.CAMERA}, Constants.CAMERA_REQUEST);
            } else {
                openCamera();
            }
        });
        dialog.show();
    }

    @SuppressLint("NotifyDataSetChanged")
    private boolean getDataFromIntent() {
        Bundle bundle = getIntent().getExtras();
        if (bundle == null) {
            viewModel.showErrorMessage(getString(R.string.do_not_have_any_data));
            return false;
        }
        viewModel.showLoading();
        TransactionResponse transactionResponse = (TransactionResponse) bundle.getSerializable(Constants.TRANSACTION_RESPONSE);
        //Create request and decrypt data

        viewModel.transactionRequest.set(
                new TransactionCreateUpdateRequest(Objects.requireNonNull(transactionResponse), SecretKey.getInstance().getKey()));

        //Set Date
        if (transactionResponse.getTransactionDate() != null && !transactionResponse.getTransactionDate().isEmpty()){
            String transactionDate = DateUtils.convertFromUTCToDefaultApi(transactionResponse.getTransactionDate());
            String date = DateUtils.getDayMonthYear(transactionDate);
            viewBinding.pickTransactionDate.setText(date);
        }

        //Set document
        if (transactionResponse.getDocument() != null && !transactionResponse.getDocument().isEmpty())
        {
            Type listType = new TypeToken<List<DocumentResponse>>(){}.getType();
            Gson gson = new Gson();
            List<DocumentResponse> documents = gson.fromJson(transactionResponse.getDocument(), listType);
            mDocumentAdapter.setListDocument(documents);
            mDocumentAdapter.notifyDataSetChanged();
        }
        //Debit
        if (transactionResponse.getIgnoreDebit() !=null && transactionResponse.getIgnoreDebit() == 0){
            viewBinding.cbCreateDebit.setChecked(true);
        }
        setDataDefaultFromIntent();
        viewModel.hideLoading();
        return true;
    }

    private void setDataDefaultFromIntent() {
        //Default set for cbb before get data from intent
        //--Money
        if (Objects.requireNonNull(viewModel.transactionRequest.get()).getMoney() != null){
            viewBinding.editTransactionMoney.setText(NumberUtils.custom_money_not_currency(
                    Objects.requireNonNull(viewModel.transactionRequest.get()).getMoney()));
        }
        //--Kind
        if (Objects.requireNonNull(viewModel.transactionRequest.get()).getKind() == 1) {
            viewBinding.cbbTransactionKind.setText(adapterKind.getItem(0), false);
        } else {
            viewBinding.cbbTransactionKind.setText(adapterKind.getItem(1), false);
        }
        //--Category
        viewModel.getAllCategoryByKind(Objects.requireNonNull(viewModel.transactionRequest.get()).getKind());
    }

    @Override
    protected void onDestroy() {
        viewModel.groupTransactions.removeObservers(this);
        viewModel.categories.removeObservers(this);
        viewModel.accounts.removeObservers(this);
        viewModel.filePathDocuments.removeObservers(this);
        super.onDestroy();
    }
}
