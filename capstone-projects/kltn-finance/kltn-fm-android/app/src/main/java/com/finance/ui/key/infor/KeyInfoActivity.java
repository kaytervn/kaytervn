package com.finance.ui.key.infor;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.databinding.Observable;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.ApiModelUtils;
import com.finance.ui.document.DocumentActivity;
import com.finance.ui.document.adapter.DocumentNotDeleteAdapter;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.finance.data.model.api.response.key.GoogleKey;
import com.finance.data.model.api.response.key.KeyResponse;
import com.finance.data.model.api.response.key.ServerKey;
import com.finance.databinding.ActivityKeyInfoBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.dialog.InputKeyDialog;
import com.finance.ui.image.ImageActivity;
import com.finance.ui.key.details.KeyDetailsActivity;
import com.finance.utils.AESUtils;
import com.finance.utils.BindingUtils;
import com.finance.utils.FileUtils;
import com.finance.utils.PdfDownloaderUtils;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;
import timber.log.Timber;

public class KeyInfoActivity extends BaseActivity<ActivityKeyInfoBinding, KeyInfoViewModel>
        implements InputKeyDialog.InputKeyListener {
    Long id;
    private ActivityResultLauncher<Intent> activityResultLauncher;
    @Override
    public int getLayoutId() {
        return R.layout.activity_key_info;
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
        id = getIntent().getLongExtra(Constants.KEY_ID,0);
        getKeyDetail();
        setupIconUpdate();
        viewModel.validKey.observe(this, valid ->{
            if(checkSecretKeyValid()){
                viewModel.getKeyDetails(id);
                viewModel.isValidKey.set(true);
            }else {
                showInputKey();
                viewModel.isValidKey.set(false);
            }
        });

        activityResultLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        viewModel.getKeyDetails(id);
                    }
                });

    }

    private void getKeyDetail() {
        viewModel.keyResponse.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                setupDocument();
                if (Objects.requireNonNull(viewModel.keyResponse.get()).getTag() != null
                        && Objects.requireNonNull(viewModel.keyResponse.get()).getTag().getColorCode() != null) {
                    int color = Color.parseColor(decrypt(Objects.requireNonNull(viewModel.keyResponse.get()).getTag().getColorCode()));
                    viewBinding.colorTag.setColorFilter(color);
                }
                if(Objects.requireNonNull(viewModel.keyResponse.get()).getAdditionalInformation() != null
                        && !Objects.requireNonNull(viewModel.keyResponse.get()).getAdditionalInformation().isEmpty() ) {
                    if (Objects.requireNonNull(viewModel.keyResponse.get()).getKind() == 2) {
                        viewModel.ggKey.set(ApiModelUtils.fromJson(
                                decrypt(Objects.requireNonNull(viewModel.keyResponse.get()).getAdditionalInformation())
                                    , GoogleKey.class));
                    } else if (Objects.requireNonNull(viewModel.keyResponse.get()).getKind() == 1) {
                        viewModel.serverKey.set(ApiModelUtils.fromJson(
                                decrypt(Objects.requireNonNull(viewModel.keyResponse.get()).getAdditionalInformation())
                                    , ServerKey.class));
                    }
                }
            }
        });
    }
    @SuppressLint("NotifyDataSetChanged")
    private void setupDocument() {
        if (Objects.requireNonNull(viewModel.keyResponse.get()).getDocument() != null) {
            Objects.requireNonNull(viewModel.keyResponse.get()).setDocument(
                    AESUtils.decrypt(SecretKey.getInstance().getKey(),
                            Objects.requireNonNull(viewModel.keyResponse.get()).getDocument(), false));
            viewModel.isHaveDocument.set(true);
            Type listType = new TypeToken<List<DocumentResponse>>(){}.getType();
            Gson gson = new Gson();
            //Parse JSON string into list of objects
            List<DocumentResponse> mListDocumentResponses;
            mListDocumentResponses = gson.fromJson(
                    Objects.requireNonNull(viewModel.keyResponse.get()).getDocument(), listType);
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
        intent.putExtra(Constants.DOCUMENT, Objects.requireNonNull(viewModel.keyResponse.get()).getDocument());
        startActivity(intent);
    }
    private void setupIconUpdate() {
        viewBinding.layoutHeader.imgOther.setImageDrawable(
                ContextCompat.getDrawable(this, R.drawable.ic_update));
        if (checkPermission(Constants.PERMISSION_KEY_INFO_UPDATE))
            viewBinding.layoutHeader.layoutOther.setVisibility(View.VISIBLE);
        else
            viewBinding.layoutHeader.layoutOther.setVisibility(View.GONE);
        viewBinding.layoutHeader.layoutOther.setOnClickListener(view -> navigateToUpdate());
    }

    public void navigateToUpdate(){
        Intent intent = new Intent(this, KeyDetailsActivity.class);
        intent.putExtra(Constants.KEY_ID, Objects.requireNonNull(viewModel.keyResponse.get()).getId());
        activityResultLauncher.launch(intent);
    }

    public void copy(String textToCopy){
        if (!textToCopy.isEmpty()) {
            ClipboardManager clipboard = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            ClipData clip = ClipData.newPlainText(getString(R.string.copy_text), textToCopy);
            clipboard.setPrimaryClip(clip);
        } else {
            Toast.makeText(this, getString(R.string.please_enter_text_to_copy), Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void confirm(String privateKey, String secretKey) {
        getMyKey(privateKey);
    }

    @Override
    public void cancel() {
        finish();
    }

    private void getMyKey(String privateKey){
        viewModel.showLoading();

        viewModel.compositeDisposable.add(viewModel.getMyKey()
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(response -> {
                            if(response.isResult()) {
                                try {
                                    saveSecretKey(privateKey,response.getData().getSecretKey());
                                    viewModel.getKeyDetails(id);
                                }catch (Throwable throwable){
                                    viewModel.showErrorMessage(getString(R.string.private_key_is_not_exactly));
                                }
                            }
                            viewModel.hideLoading();
                        },error->{
                            viewModel.showErrorMessage(getString(R.string.newtwork_error));
                            Timber.d(error);
                            viewModel.hideLoading();
                        })
        );
    }

    @Override
    public void onBackPressed() {
//        super.onBackPressed();
        Intent intent = new Intent();
        intent.putExtra(Constants.KEY,ApiModelUtils.GSON.toJson(viewModel.keyResponse.get(), KeyResponse.class));
        setResult(Activity.RESULT_OK, intent);
        finish();
    }
}
