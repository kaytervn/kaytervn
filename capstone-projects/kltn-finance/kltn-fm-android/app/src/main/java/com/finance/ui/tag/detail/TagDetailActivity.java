package com.finance.ui.tag.detail;

import android.graphics.Color;
import android.os.Bundle;
import android.widget.ArrayAdapter;

import androidx.annotation.Nullable;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.databinding.ActivityTagDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import yuku.ambilwarna.AmbilWarnaDialog;

public class TagDetailActivity extends BaseActivity<ActivityTagDetailBinding, TagDetailViewModel> {

    private ArrayAdapter<String> adapterTagKind;

    @Override
    public int getLayoutId() {
        return R.layout.activity_tag_detail;
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

        Objects.requireNonNull(viewModel.tag.get()).setId(getIntent().getLongExtra(Constants.TAG_ID,0));
        viewModel.position.set(getIntent().getIntExtra(Constants.POSITION,0));
        viewModel.isCreate.set(getIntent().getBooleanExtra(Constants.IS_CREATE,false));

        if (Boolean.FALSE.equals(viewModel.isCreate.get())){
            viewModel.getTagDetails(Objects.requireNonNull(viewModel.tag.get()).getId());
        }
        setupCbbTagKind();
        //Get organization detail from API
        getTagDetail();
    }

    private void getTagDetail() {
        viewModel.tagResponse.observe(this, tagResponse -> {
            if (tagResponse == null ||tagResponse.getId() == null){
                return;
            }
            String name = decrypt(tagResponse.getName());
            String colorCode = decrypt(tagResponse.getColorCode());
            Objects.requireNonNull(viewModel.tag.get()).setName(name);
            Objects.requireNonNull(viewModel.tag.get()).setColorCode(colorCode);
            Objects.requireNonNull(viewModel.tag.get()).setKind(tagResponse.getKind());
            viewModel.tag.notifyChange();
            //Set default
            viewBinding.cbbTagKind.setText(adapterTagKind.getItem(tagResponse.getKind()-1),false);
            viewBinding.layoutColor.setBackgroundColor(Color.parseColor(colorCode));
        });
    }

    public void doDone(){
        if(Boolean.TRUE.equals(viewModel.isCreate.get())){
            viewModel.createTag();
        }else {
            viewModel.updateTag();
        }
        hideKeyboard();
    }

    private void setupCbbTagKind() {
        List<String> tagKinds = new ArrayList<>();
        tagKinds.add(getString(R.string.transaction));
        tagKinds.add(getString(R.string.service));
        tagKinds.add(getString(R.string.key));
        tagKinds.add(getString(R.string.note));
        adapterTagKind = new ArrayAdapter<>(this, R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, tagKinds);
        viewBinding.cbbTagKind.setAdapter(adapterTagKind);
        viewBinding.cbbTagKind.setOnItemClickListener((parent, view, position, id) -> {
            Objects.requireNonNull(viewModel.tag.get()).setKind(position+1);
        });
    }

    public void openColorPicker(){
        String colorCode = Objects.requireNonNull(viewModel.tag.get()).getColorCode() == null
                ? "#FFFFFF"
                : Objects.requireNonNull(viewModel.tag.get()).getColorCode();
        int color = Color.parseColor(colorCode);
        AmbilWarnaDialog ambilWarnaDialog = new AmbilWarnaDialog(this, color, new AmbilWarnaDialog.OnAmbilWarnaListener() {
            @Override
            public void onCancel(AmbilWarnaDialog dialog) {

            }

            @Override
            public void onOk(AmbilWarnaDialog dialog, int color) {
                viewBinding.layoutColor.setBackgroundColor(color);
                String hexColor = String.format("#%06X", (0xFFFFFF & color));
                Objects.requireNonNull(viewModel.tag.get()).setColorCode(hexColor);
            }
        });
        ambilWarnaDialog.show();
    }

}
