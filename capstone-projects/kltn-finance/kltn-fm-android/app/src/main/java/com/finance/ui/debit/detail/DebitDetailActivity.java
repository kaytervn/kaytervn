package com.finance.ui.debit.detail;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.ui.document.adapter.DocumentNotDeleteAdapter;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.finance.databinding.ActivityDebitDetailBinding;

import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.debit.update.DebitUpdateActivity;

import com.finance.utils.AESUtils;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class DebitDetailActivity extends BaseActivity<ActivityDebitDetailBinding, DebitDetailViewModel>
{
    //Document
    private List<DocumentResponse> mListDocumentResponses = new ArrayList<>();
    private DocumentNotDeleteAdapter mDocumentAdapter;

    private int position;
    @Override
    public int getLayoutId() {
        return R.layout.activity_debit_detail;
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

        //Get data from intent
        long id = getIntent().getLongExtra(Constants.DEBIT_ID, 0);
        position = getIntent().getIntExtra(Constants.POSITION, 0);
        if (id != 0) {
            viewModel.getDetailDebit(id);
        }
        setupDocumentAdapter();
        getDetailDebit();
    }


    private void setupIconUpdate() {
        if (Objects.requireNonNull(viewModel.debit.get()).getState() != 4
                && checkPermission(Constants.PERMISSION_DEBIT_UPDATE)) {
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

    private void navigateToTransactionUpdate() {
        Intent intent = new Intent(application, DebitUpdateActivity.class);
        Bundle bundle = new Bundle();
        bundle.putSerializable(Constants.DEBIT_RESPONSE, viewModel.debit.get());
        intent.putExtras(bundle);
        activityResultLauncher.launch(intent);
    }

    private void getDetailDebit() {
        viewModel.debitLiveData.observe(this, debitResponse -> {
            //Check if transaction is null
            if (debitResponse == null || debitResponse.getId() == null) {
                return;
            }
            viewModel.debit.set(debitResponse);

            if (Objects.requireNonNull(viewModel.debit.get()).getTag() != null
                    && Objects.requireNonNull(viewModel.debit.get()).getTag().getColorCode() != null) {
                int color = Color.parseColor(decrypt(Objects.requireNonNull(viewModel.debit.get()).getTag().getColorCode()));
                viewBinding.colorTag.setColorFilter(color);
            }

            viewModel.debit.notifyChange();
            //Setup Document from json for transaction
            setupDocument();
            //Check State to show/hide update icon
            setupIconUpdate();
            setupDocumentAdapter();

            //Check if transaction is updated
            if (Boolean.TRUE.equals(viewModel.isUpdated.get())){
                setResultFromUpdate();
            }
        });
    }

    @SuppressLint("NotifyDataSetChanged")
    private void setupDocument() {
        if (Objects.requireNonNull(viewModel.debit.get()).getDocument() != null) {
            Objects.requireNonNull(viewModel.debit.get()).setDocument(
                    AESUtils.decrypt(SecretKey.getInstance().getKey(),
                            Objects.requireNonNull(viewModel.debit.get()).getDocument(), false));
            viewModel.isHaveDocument.set(true);
            Type listType = new TypeToken<List<DocumentResponse>>(){}.getType();
            Gson gson = new Gson();
            //Parse JSON string into list of objects
            mListDocumentResponses = gson.fromJson(
                    Objects.requireNonNull(viewModel.debit.get()).getDocument(), listType);
            mDocumentAdapter.setListDocument(mListDocumentResponses);
        } else {
            viewModel.isHaveDocument.set(false);
            mListDocumentResponses.clear();
            mDocumentAdapter.setListDocument(mListDocumentResponses);
            mDocumentAdapter.notifyDataSetChanged();
        }
    }

    private void setupDocumentAdapter() {
        mDocumentAdapter = new DocumentNotDeleteAdapter(mListDocumentResponses, new DocumentNotDeleteAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int pos) {
            }

        });
        viewBinding.rcvDocuments.setAdapter(mDocumentAdapter);
        viewBinding.rcvDocuments.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));
    }

    public void downloadDocumentAt(int pos){
        // Dialog custom
        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_download);
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
        TextView textView = dialog.findViewById(R.id.title);
        textView.setText(R.string.question_confim_download_document);

        btnCancel.setOnClickListener(v -> dialog.dismiss());

        btnConfirm.setOnClickListener(v -> {
            DocumentResponse documentResponse = mListDocumentResponses.get(pos);
            viewModel.downloadFile(documentResponse.getUrl(), documentResponse.getName());
            dialog.dismiss();
        });
        dialog.show();
    }

    public void checkFilePermission(int position){
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q &&
                ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED &&
                ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions( new String[]{
                    Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.READ_EXTERNAL_STORAGE
            }, 100);
        }else {
            downloadDocumentAt(position);
        }
    }

    //Set up activityResultLauncher for update transaction
    ActivityResultLauncher<Intent> activityResultLauncher =
            registerForActivityResult(
                    new ActivityResultContracts.StartActivityForResult(),
                    activityResult -> {
                        int result = activityResult.getResultCode();
                        if (result == RESULT_OK){
                            viewModel.isUpdated.set(true);
                            viewModel.getDetailDebit(Objects.requireNonNull(viewModel.debit.get()).getId());
                        }
                    }
            );

    private void setResultFromUpdate() {
        Intent intent = new Intent();
        Bundle bundle = new Bundle();
        bundle.putInt(Constants.POSITION, position);
        bundle.putSerializable(Constants.DEBIT_RESPONSE, viewModel.debit.get());
        intent.putExtras(bundle);
        setResult(RESULT_OK, intent);
    }



}
