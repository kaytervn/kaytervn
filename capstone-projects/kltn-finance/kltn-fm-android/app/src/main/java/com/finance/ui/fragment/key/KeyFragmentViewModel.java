package com.finance.ui.fragment.key;


import androidx.databinding.ObservableField;

import com.finance.MVVMApplication;

import com.finance.data.Repository;
import com.finance.data.model.api.ResponseListObj;
import com.finance.data.model.api.ResponseStatus;
import com.finance.data.model.api.ResponseWrapper;
import com.finance.data.model.api.response.key.KeyResponse;
import com.finance.ui.base.BaseFragmentViewModel;
import java.util.List;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.disposables.CompositeDisposable;

public class KeyFragmentViewModel extends BaseFragmentViewModel {
    public ObservableField<Integer> pageNumber = new ObservableField<>(0);
    public ObservableField<Integer> pageSize = new ObservableField<>(20);
    public ObservableField<Integer> totalElement = new ObservableField<>();
    public ObservableField<Integer> positionUC = new ObservableField<>();
    public ObservableField<Boolean> isCreate = new ObservableField<>(false);
    public ObservableField<Long> keyGroupId = new ObservableField<>(0L);

    public ObservableField<Long> organizationId = new ObservableField<>(0L);
    public ObservableField<Long> tagId = new ObservableField<>(0L);

    public ObservableField<Integer> kind = new ObservableField<>(0);
    public ObservableField<Boolean> isShowFilter = new ObservableField<>(false);
    public ObservableField<String> textName = new ObservableField<>();
    public ObservableField<List<KeyResponse>> keyList = new ObservableField<>();
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);
    public ObservableField<Boolean> isSearch = new ObservableField<>(false);
    public ObservableField<String> isSearchEmpty = new ObservableField<>("");

    public void isShowSearch() {
        isSearch.set(Boolean.FALSE.equals(isSearch.get()));
    }
    public KeyFragmentViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }
    public void deleteTextSearch(){
        textName.set("");
    }

    public CompositeDisposable getCompositeDisposable(){
        return compositeDisposable;
    }
    public Observable<ResponseWrapper<ResponseListObj<KeyResponse>>> getKeys(){
        return repository.getApiService().getKeyInformation(pageNumber.get(), pageSize.get(), kind.get(), keyGroupId.get(), organizationId.get(), tagId.get(), 0);
    }

    public Observable<ResponseStatus> deleteKey(Long id){
        return repository.getApiService().deleteKey(id);
    }

}
