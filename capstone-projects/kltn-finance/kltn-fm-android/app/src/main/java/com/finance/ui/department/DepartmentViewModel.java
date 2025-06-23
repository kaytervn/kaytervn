package com.finance.ui.department;

import androidx.databinding.ObservableField;

import com.finance.MVVMApplication;
import com.finance.data.Repository;
import com.finance.data.model.api.ResponseListObj;
import com.finance.data.model.api.ResponseStatus;
import com.finance.data.model.api.ResponseWrapper;
import com.finance.data.model.api.response.department.DepartmentResponse;
import com.finance.ui.base.BaseViewModel;

import io.reactivex.rxjava3.core.Observable;

public class DepartmentViewModel extends BaseViewModel {
    public ObservableField<Integer> pageNumber = new ObservableField<>(0);
    public ObservableField<Integer> pageSize = new ObservableField<>(20);
    public ObservableField<Integer> totalElement = new ObservableField<>();
    public ObservableField<Integer> positionUC = new ObservableField<>();
    public DepartmentViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public Observable<ResponseWrapper<ResponseListObj<DepartmentResponse>>> getDepartments(){
        return repository.getApiService().getDepartments(pageNumber.get(), pageSize.get());
    }

    public Observable<ResponseStatus> deleteDepartment(Long id){
        return repository.getApiService().deleteDepartment(id);
    }
}
