package com.finance.ui.image;

import androidx.databinding.ObservableField;

import com.finance.MVVMApplication;
import com.finance.data.Repository;
import com.finance.ui.base.BaseViewModel;

import java.util.Objects;

public class ImageViewModel extends BaseViewModel {
    public ObservableField<Boolean> showHeader = new ObservableField<>(true);
    public void isShowHeader() {
        this.showHeader.set(!Objects.requireNonNull(showHeader.get()));
    }
    public ImageViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }
}
