package com.finance.ui.debit;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.Editable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextWatcher;
import android.text.style.StyleSpan;
import android.view.View;
import androidx.annotation.Nullable;
import androidx.databinding.Observable;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.debit.DebitResponse;
import com.finance.databinding.ActivityDebitBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.debit.adapter.DebitResponseAdapter;
import com.finance.ui.debit.detail.DebitDetailActivity;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.dialog.YesNoDialog;


import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class DebitActivity extends BaseActivity<ActivityDebitBinding, DebitViewModel>
{
    private DebitResponseAdapter adapter;
    private List<DebitResponse> debits;

    @Override
    public int getLayoutId() {
        return R.layout.activity_debit;
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
        //Get month, year from intent
        getDataFromIntent();
        checkPrivateKey();
        //Get data from call api
        getListDebits();
        setupSearchByName();
        setupSwipeFreshLayout();
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getListDebits() {
        viewModel.debits.observe(this, debitResponses -> {
            if (debitResponses == null || debitResponses.isEmpty()){
                viewModel.totalDebit.set(0.0);
                viewModel.totalElements.set(0);
                adapter.setListDebitResponse(new ArrayList<>());
                adapter.notifyDataSetChanged();
                return;
            }

            for (DebitResponse debitResponse : debitResponses){
                debitResponse.setName(decrypt(debitResponse.getName()));
            }
            debits = debitResponses;
            adapter.setListDebitResponse(debitResponses);
            if (Objects.requireNonNull(viewModel.kind.get()) == 0){
                calculateTotal(debitResponses);
            }
            adapter.notifyDataSetChanged();
        });
    }


    private void setupSearchByName() {
        viewBinding.edtSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                List<DebitResponse> debitResponseFilters = new ArrayList<>();
                String editSearch = viewBinding.edtSearch.getText().toString();
                viewModel.isSearchEmpty.set(editSearch);

                if (debits == null || debits.isEmpty()){
                    return;
                }

                for (DebitResponse debitResponse : debits){
                    if (debitResponse.getName().toLowerCase().contains(editSearch.toLowerCase())){
                        debitResponseFilters.add(debitResponse);
                    }
                }
                adapter.setListDebitResponse(debitResponseFilters);
                adapter.notifyDataSetChanged();

                viewModel.totalElements.set(debitResponseFilters.size());
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        viewModel.isSearch.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                if (Boolean.TRUE.equals(viewModel.isSearch.get())){
                    viewBinding.rcvDebits.stopScroll();
                    viewBinding.rcvDebits.scrollToPosition(0);
                    viewBinding.edtSearch.requestFocus();
                    showKeyboard();
                }
            }
        });
        //Set hint italic
        SpannableString spannableHint = new SpannableString(viewBinding.edtSearch.getHint());
        spannableHint.setSpan(new StyleSpan(Typeface.ITALIC), 0, viewBinding.edtSearch.getHint().length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        viewBinding.edtSearch.setHint(spannableHint);
    }

    @SuppressLint("NotifyDataSetChanged")
    private void setupSwipeFreshLayout() {
        viewBinding.swipeLayout.setEnabled(true);
        viewBinding.swipeLayout.setOnRefreshListener(() -> {
            viewBinding.edtSearch.setText("");
            if (checkSecretKeyValid()){
                viewModel.getMyDebits();
                viewBinding.rcvDebits.scrollToPosition(0);
                adapter.notifyDataSetChanged();
                viewBinding.swipeLayout.setRefreshing(false);
            } else
            {
                if (adapter != null){
                    adapter.setListDebitResponse(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                viewBinding.swipeLayout.setRefreshing(false);
            }
        });
    }

    private void getDataFromIntent() {
        String monthYear = getIntent().getStringExtra(Constants.MONTH_YEAR);
        if (monthYear != null) {
            viewModel.monthYear.set(monthYear);
        }
    }


    private void setupAdapter() {
        adapter = new DebitResponseAdapter(new ArrayList<>(), new DebitResponseAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int pos) {
                if (checkPermission(Constants.PERMISSION_DEBIT_GET)){
                    DebitResponse DebitResponse = adapter.getListDebitResponse().get(pos);
                    Intent intent = new Intent(view.getContext(), DebitDetailActivity.class);
                    intent.putExtra(Constants.DEBIT_ID, DebitResponse.getId());
                    startActivity(intent);
                }
            }
            @Override
            public void onApproveClick(View view, int pos) {
                approveAt(pos);
            }


            @Override
            public void onDeleteClick(View view, int pos) {
                deleteAt(pos);

            }
        });
        viewBinding.rcvDebits.setAdapter(adapter);
        viewBinding.rcvDebits.setLayoutManager(new LinearLayoutManager(
                this,
                LinearLayoutManager.VERTICAL,
                false)
        );
    }

    public void deleteAt(int pos){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.debit), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                viewModel.deleteDebitAt(adapter.getListDebitResponse().get(pos).getId(), new BaseCallBack() {
                    @Override
                    public void doError(Throwable throwable) {
                        viewModel.showErrorMessage(throwable.getMessage());
                    }

                    @SuppressLint("NotifyDataSetChanged")
                    @Override
                    public void doSuccess() {
                        String decrypted = decrypt(adapter.getListDebitResponse().get(pos).getMoney());
                        Double money = Double.valueOf(decrypted);
                        viewModel.totalDebit.set(
                                Objects.requireNonNull(viewModel.totalDebit.get()) - money);
                        adapter.getListDebitResponse().remove(pos);
                        viewModel.totalElements.set(adapter.getListDebitResponse().size());
                        adapter.notifyDataSetChanged();
                    }
                });
            }

            @Override
            public void cancelDelete() {

            }
        });
        deleteDialog.show(this.getSupportFragmentManager(), Constants.DELETE_DIALOG);

    }

    private void approveAt(int pos){
        //Approve
        YesNoDialog approveDialog =
                new YesNoDialog(getString(R.string.aprrove_debit), getString(R.string.cancel), getString(R.string.confirm),
                        new YesNoDialog.Listener() {
                            @Override
                            public void confirmYN() {
                                viewModel.approveDebitAt(adapter.getListDebitResponse().get(pos).getId(), new BaseCallBack() {
                                    @Override
                                    public void doError(Throwable throwable) {
                                        viewModel.showErrorMessage(throwable.getMessage());
                                    }

                                    @SuppressLint("NotifyDataSetChanged")
                                    @Override
                                    public void doSuccess() {
                                        adapter.getListDebitResponse().get(pos).setState(4);
                                        adapter.notifyDataSetChanged();
                                    }
                                });
                            }

                            @Override
                            public void cancelYN() {

                            }
                        });
        approveDialog.show(this.getSupportFragmentManager(), Constants.YES_NO_DIALOG_FRAGMENT);

    }

    @SuppressLint("NotifyDataSetChanged")
    private void checkPrivateKey() {
        viewModel.validKey.observe(this,valid->{
            if(valid){
                viewModel.isValidKey.set(true);
                //Default data
                setupAdapter();
                adapter.setSecretKey(SecretKey.getInstance().getKey());
                adapter.setListDebitResponse(new ArrayList<>());
                adapter.notifyDataSetChanged();
                viewModel.getMyDebits();
            }else {
                viewModel.isValidKey.set(false);
                if (adapter != null){
                    adapter.setListDebitResponse(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                showInputKey();
            }
        });

    }

    public void deleteEditSearch(){
        viewBinding.edtSearch.setText("");
    }


    public void calculateTotal(List<DebitResponse> DebitResponses){
        viewModel.totalDebit.set(0.0);
        for (DebitResponse DebitResponse : DebitResponses){
            viewModel.totalDebit.set(
                    Objects.requireNonNull(viewModel.totalDebit.get()) + Double.parseDouble(decrypt(DebitResponse.getMoney())));
        }
    }


    @Override
    public void onBackPressed() {
        if (Boolean.TRUE.equals(viewModel.isSearch.get())){
            viewModel.isShowSearch();
            deleteEditSearch();
            hideKeyboard();
        } else {
            super.onBackPressed();
        }
    }
}
