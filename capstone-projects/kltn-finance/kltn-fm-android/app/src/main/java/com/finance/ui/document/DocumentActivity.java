package com.finance.ui.document;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.ui.document.adapter.DocumentNotDeleteAdapter;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.finance.databinding.ActivityDocumentBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.image.ImageActivity;
import com.finance.utils.BindingUtils;
import com.finance.utils.FileUtils;
import com.finance.utils.PdfDownloaderUtils;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class DocumentActivity extends BaseActivity<ActivityDocumentBinding, DocumentViewModel> {
    private List<DocumentResponse> mListDocumentResponses = new ArrayList<>();
    private DocumentNotDeleteAdapter mDocumentAdapter;
    private String documentJson;
    @Override
    public int getLayoutId() {
        return R.layout.activity_document;
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
        documentJson = getIntent().getStringExtra(Constants.DOCUMENT);
        setupDocumentAdapter();
        setupDocument();
    }
    private void setupDocumentAdapter() {
        mDocumentAdapter = new DocumentNotDeleteAdapter(mListDocumentResponses, (view, pos) -> {
            DocumentResponse documentResponse = mListDocumentResponses.get(pos);
            if (FileUtils.getFileExtension(documentResponse.getUrl()).equals("pdf")) {
                viewModel.showLoading();
                PdfDownloaderUtils downloader = new PdfDownloaderUtils(view.getContext(), BindingUtils.getImageUrl(documentResponse.getUrl()));
                downloader.downloadPdf(documentResponse.getName());
                downloader.registerDownloadCompleteReceiver(new BroadcastReceiver() {
                    @Override
                    public void onReceive(Context context, Intent intent) {
                        downloader.download(context, intent);
                        viewModel.hideLoading();
                    }
                });
            } else {
                Intent intent = new Intent(application, ImageActivity.class);
                intent.putExtra(Constants.IMAGE_URL, documentResponse.getUrl());
                intent.putExtra(Constants.IMAGE_NAME, documentResponse.getName());
                startActivity(intent);
            }
        });
        viewBinding.rcvDocuments.setAdapter(mDocumentAdapter);
        viewBinding.rcvDocuments.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));
    }

    @SuppressLint("NotifyDataSetChanged")
    private void setupDocument() {
        if (documentJson != null) {
            Type listType = new TypeToken<List<DocumentResponse>>(){}.getType();
            Gson gson = new Gson();
            //Parse JSON string into list of objects
            mListDocumentResponses = gson.fromJson(documentJson, listType);
            mDocumentAdapter.setListDocument(mListDocumentResponses);
        } else {
            mListDocumentResponses.clear();
            mDocumentAdapter.setListDocument(mListDocumentResponses);
        }
        mDocumentAdapter.notifyDataSetChanged();
    }
}
