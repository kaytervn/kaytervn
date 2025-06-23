package com.finance.ui.transaction.detail;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.finance.databinding.ActivityTransactionDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.document.DocumentActivity;
import com.finance.ui.transaction.create_or_update.TransactionCreateUpdateActivity;
import com.finance.utils.AESUtils;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class TransactionDetailActivity extends BaseActivity<ActivityTransactionDetailBinding, TransactionDetailViewModel>
{

    private int position;
    @Override
    public int getLayoutId() {
        return R.layout.activity_transaction_detail;
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

        long transactionId = getIntent().getLongExtra(Constants.TRANSACTION_ID, 0);
        position = getIntent().getIntExtra(Constants.POSITION, 0);
        if (transactionId != 0) {
            viewModel.getDetailTransaction(transactionId);
        }
        //Get detail transaction from API
        getDetailTransaction();
    }

    private void getDetailTransaction() {
        viewModel.tranLiveData.observe(this, transactionResponse -> {
            //Check if transaction is null
            if (transactionResponse == null || transactionResponse.getId() == null) {
                return;
            }
            viewModel.tran.set(transactionResponse);
            viewModel.tran.notifyChange();
            if (Objects.requireNonNull(viewModel.tran.get()).getTag() != null
                    && Objects.requireNonNull(viewModel.tran.get()).getTag().getColorCode() != null) {
                int color = Color.parseColor(decrypt(Objects.requireNonNull(viewModel.tran.get()).getTag().getColorCode()));
                viewBinding.colorTag.setColorFilter(color);
            }


            //Setup Document from json for transaction
            setupDocument();
            //Check State to show/hide update icon
            setupIconUpdate();

            //Check if transaction is updated
            if (Boolean.TRUE.equals(viewModel.isUpdated.get())){
                setResultFromUpdate();
            }
        });
    }

    private void setupIconUpdate() {
        if (Objects.requireNonNull(viewModel.tran.get()).getState() != 4
                && checkPermission(Constants.PERMISSION_TRANSACTION_UPDATE)) {
            viewBinding.layoutHeader.imgOther.setImageDrawable(
                    ContextCompat.getDrawable(this, R.drawable.ic_update));
            viewBinding.layoutHeader.layoutOther.setVisibility(View.VISIBLE);
            viewBinding.layoutHeader.layoutOther.setOnClickListener(
                    v -> navigateToTransactionUpdate()
            );
        } else {
            viewBinding.layoutHeader.layoutOther.setVisibility(View.GONE);
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    private void setupDocument() {
        if (Objects.requireNonNull(viewModel.tran.get()).getDocument() != null) {
            Objects.requireNonNull(viewModel.tran.get()).setDocument(
                    AESUtils.decrypt(SecretKey.getInstance().getKey(),
                            Objects.requireNonNull(viewModel.tran.get()).getDocument(), false));
            viewModel.isHaveDocument.set(true);
            Type listType = new TypeToken<List<DocumentResponse>>(){}.getType();
            Gson gson = new Gson();
            //Parse JSON string into list of objects
            List<DocumentResponse> mListDocumentResponses;
            mListDocumentResponses = gson.fromJson(
                    Objects.requireNonNull(viewModel.tran.get()).getDocument(), listType);
            if (mListDocumentResponses == null) {
                mListDocumentResponses = new ArrayList<>();
            }
            viewModel.totalDocuments.set(mListDocumentResponses.size());
        } else {
            viewModel.isHaveDocument.set(false);
        }
    }
    public void navigateToDocument() {
        Intent intent = new Intent(this, DocumentActivity.class);
        intent.putExtra(Constants.DOCUMENT, Objects.requireNonNull(viewModel.tran.get()).getDocument());
        startActivity(intent);
    }

    private void setResultFromUpdate() {
        Intent intent = new Intent();
        Bundle bundle = new Bundle();
        bundle.putInt(Constants.POSITION, position);
        bundle.putSerializable(Constants.TRANSACTION_RESPONSE, viewModel.tran.get());
        intent.putExtras(bundle);
        setResult(RESULT_OK, intent);
    }

    private void navigateToTransactionUpdate() {
        Intent intent = new Intent(application, TransactionCreateUpdateActivity.class);
        intent.putExtra(Constants.TRANSACTION_RESPONSE, viewModel.tran.get());
        intent.putExtra(Constants.IS_CREATE, false);
        Bundle bundle = new Bundle();
        bundle.putSerializable(Constants.TRANSACTION_RESPONSE, viewModel.tran.get());
        intent.putExtras(bundle);
        activityResultLauncher.launch(intent);
    }


//    public void downloadDocumentAt(int pos){
//        // Dialog custom
//        Dialog dialog = new Dialog(this);
//        dialog.setContentView(R.layout.dialog_download);
//        Window window = dialog.getWindow();
//        if (window == null) {
//            return;
//        }
//        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
//        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
//
//        WindowManager.LayoutParams windowAttributes = window.getAttributes();
//        windowAttributes.gravity  = android.view.Gravity.CENTER;
//        window.setAttributes(windowAttributes);
//
//        Button btnConfirm = dialog.findViewById(R.id.btn_confirm);
//        Button btnCancel = dialog.findViewById(R.id.btn_cancel);
//        TextView textView = dialog.findViewById(R.id.tv_title);
//        textView.setText(R.string.question_confirm_download_document);
//
//        btnCancel.setOnClickListener(v -> dialog.dismiss());
//
//        btnConfirm.setOnClickListener(v -> {
//
//            dialog.dismiss();
//        });
//        dialog.show();
//    }



    //Set up activityResultLauncher for update transaction
    ActivityResultLauncher<Intent> activityResultLauncher =
            registerForActivityResult(
                    new ActivityResultContracts.StartActivityForResult(),
                    activityResult -> {
                        int result = activityResult.getResultCode();
                        if (result == RESULT_OK){
                            viewModel.isUpdated.set(true);
                            viewModel.getDetailTransaction(Objects.requireNonNull(viewModel.tran.get()).getId());
                        }
                    }
            );


}
