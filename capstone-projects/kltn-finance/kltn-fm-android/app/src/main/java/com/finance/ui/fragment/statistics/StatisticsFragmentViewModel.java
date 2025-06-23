package com.finance.ui.fragment.statistics;


import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.data.Repository;
import com.finance.data.model.api.ResponseListObj;
import com.finance.data.model.api.ResponseStatus;
import com.finance.data.model.api.ResponseWrapper;
import com.finance.data.model.api.request.payment_period.PaymentPeriodApproveRequest;
import com.finance.data.model.api.request.payment_period.PaymentPeriodRecalculateRequest;
import com.finance.data.model.api.response.statistics.StatisticsResponse;
import com.finance.ui.base.BaseFragmentViewModel;

import java.util.List;

import io.reactivex.rxjava3.core.Observable;

public class StatisticsFragmentViewModel extends BaseFragmentViewModel {


    public ObservableField<Integer> pageNumber = new ObservableField<>(0);

    public ObservableField<Integer> totalElement = new ObservableField<>();
    public MutableLiveData<List<StatisticsResponse>> statistics= new MutableLiveData<>();
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);

    public StatisticsFragmentViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);

    }

    public Observable<ResponseWrapper<ResponseListObj<StatisticsResponse>>> getPaymentPeriod(){
        return repository.getApiService().getPaymentPeriodList(pageNumber.get(), null,2);
    }

    public Observable<ResponseStatus> approvePayment(Long id){
        return repository.getApiService().approvePaymentPeriod(new PaymentPeriodApproveRequest(id));
    }

    public Observable<ResponseStatus> recalculatePayment(Long id){
        return repository.getApiService().recalculatePaymentPeriod(new PaymentPeriodRecalculateRequest(id));
    }
}
