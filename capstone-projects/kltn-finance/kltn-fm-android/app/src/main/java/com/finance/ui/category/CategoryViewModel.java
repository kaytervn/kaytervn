package com.finance.ui.category;

import androidx.databinding.ObservableField;
import com.finance.MVVMApplication;
import com.finance.data.Repository;
import com.finance.data.model.api.ResponseListObj;
import com.finance.data.model.api.ResponseStatus;
import com.finance.data.model.api.ResponseWrapper;
import com.finance.data.model.api.response.category.CateResponse;
import com.finance.ui.base.BaseViewModel;
import io.reactivex.rxjava3.core.Observable;


public class CategoryViewModel extends BaseViewModel {

    public ObservableField<Integer> pageNumber = new ObservableField<>(0);
    public ObservableField<Integer> pageSize = new ObservableField<>(20);
    public ObservableField<Integer> totalElement = new ObservableField<>();
    public ObservableField<Integer> kind = new ObservableField<>(1);
    public ObservableField<Integer> positionUC = new ObservableField<>(1);
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);
    public CategoryViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public Observable<ResponseWrapper<ResponseListObj<CateResponse>>> getCategories(){
        return repository.getApiService().getCategories(pageNumber.get(), pageSize.get(), kind.get());
    }

    public Observable<ResponseStatus> deleteCategory(Long id){
        return repository.getApiService().deleteCategory(id);
    }

    public Observable<ResponseWrapper<CateResponse>> getCategory(Long id){
        return repository.getApiService().getCategoryDetails(id);
    }



}
