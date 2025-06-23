package com.finance.ui.category.details;


import android.os.Bundle;
import android.widget.ArrayAdapter;
import androidx.annotation.Nullable;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.databinding.ActivityCategoryDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import java.util.ArrayList;
import java.util.List;
import eu.davidea.flexibleadapter.databinding.BR;

public class CategoryDetailsActivity extends BaseActivity<ActivityCategoryDetailBinding, CategoryDetailsViewModel> {


    ArrayAdapter<String> adapterKind;

    @Override
    public int getLayoutId() {
        return R.layout.activity_category_detail;
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
        viewModel.id.set(getIntent().getLongExtra(Constants.CATEGORY_ID,0));
        viewModel.isCreate.set(getIntent().getBooleanExtra(Constants.IS_CREATE,false));
        setAdapterKind();
        getListCategories();
        Long categoryId = viewModel.id.get();
        if (categoryId != null && categoryId != 0) {
            viewModel.getCategoryDetails(categoryId);
        }
    }

    private void getListCategories() {
        viewModel.cateResponse.observe(this, cateResponse -> {
            viewModel.name.set(decrypt(cateResponse.getName()));
            viewModel.description.set(decrypt(cateResponse.getDescription()));
            viewModel.kind.set(cateResponse.getKind());
            Integer kind = viewModel.kind.get();
            if(kind != null && kind == 1){
                viewBinding.cbbKind.setText(adapterKind.getItem(0), false);
            }else {
                viewBinding.cbbKind.setText(adapterKind.getItem(1), false);
            }
        });
    }

    private void setAdapterKind(){
        List<String> kindNames = new ArrayList<>();
        kindNames.add(getString(R.string.collect));
        kindNames.add(getString(R.string.pay));
        adapterKind = new ArrayAdapter<>(this, R.layout.layout_drop_down_item, kindNames);
        viewBinding.cbbKind.setAdapter(adapterKind);
        if(Boolean.TRUE.equals(viewModel.isCreate.get())){
            viewBinding.cbbKind.setText(adapterKind.getItem(0), false);
            viewModel.kind.set(1);
        }else {
            viewModel.kind.set(1);
        }

        viewBinding.cbbKind.setOnItemClickListener(
            (adapterView, view, position, l) -> {
                if (position == 0){
                    viewModel.kind.set(1);
                } else {
                    viewModel.kind.set(2);
                }
        });
    }


}
