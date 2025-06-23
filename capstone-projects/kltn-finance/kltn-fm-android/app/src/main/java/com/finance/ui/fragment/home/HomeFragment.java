package com.finance.ui.fragment.home;

import static android.app.Activity.RESULT_OK;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextWatcher;
import android.text.style.StyleSpan;
import android.util.DisplayMetrics;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.databinding.Observable;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.request.transaction.TransactionRejectRequest;
import com.finance.data.model.api.response.transaction.TransactionResponse;
import com.finance.databinding.FragmentHomeBinding;
import com.finance.di.component.FragmentComponent;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.base.BaseFragment;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.dialog.YesNoDialog;
import com.finance.ui.fragment.home.adapter.TransactionResponseAdapter;
import com.finance.ui.transaction.create_or_update.TransactionCreateUpdateActivity;
import com.finance.ui.transaction.detail.TransactionDetailActivity;
import com.finance.utils.AESUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import timber.log.Timber;

public class HomeFragment extends BaseFragment<FragmentHomeBinding, HomeFragmentViewModel>
        implements View.OnTouchListener
{
    private TransactionResponseAdapter adapter;
    private List<TransactionResponse> transactionResponses;
    private float xAxis, yAxis,initialX,initialY;
    int lastAction;

    //Set up for update profile
    private final ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityResultLauncher();
    private Double updateMoney = 0.0;
    private Integer updateKind = 0;

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    protected int getLayoutId() {
        return R.layout.fragment_home;
    }

     @SuppressLint({"NotifyDataSetChanged", "ClickableViewAccessibility"})
     @Override
     protected void performDataBinding() {

         //Check private key, set adapter, set secret key, call api get list transaction
         setupAdapter();
         checkPrivateKey();
         //Get data from api
         getListTransactionResponses();
         setupSwipeFreshLayout();
         setupEditSearch();
         binding.btnAdd.setOnTouchListener(this);

     }

     @SuppressLint("NotifyDataSetChanged")
     private void getListTransactionResponses() {
         viewModel.transactions.observe(getViewLifecycleOwner(), transactions -> {
             if (transactions == null || transactions.isEmpty()){
                 adapter.setListTransactionResponse(new ArrayList<>());
                 viewModel.totalElements.set(0);
                 viewModel.totalIncome.set(0.0);
                 viewModel.totalExpenditure.set(0.0);
                 adapter.notifyDataSetChanged();
             }
             //Get data Success
             else {
                 // Start time
                 long startTime = System.currentTimeMillis();
                 //Decrypt name (for best performance in search local)
                 for (int i = 0; i < transactions.size(); i++)
                     transactions.get(i).setName(decrypt(transactions.get(i).getName())); //100ms

                 viewModel.totalElements.set(transactions.size());
                 if (Objects.requireNonNull(viewModel.kind.get()) == 0)
                    calculateTotal(transactions); //300ms
                 transactionResponses = transactions;
                 adapter.setListTransactionResponse(transactions);
                 adapter.notifyDataSetChanged();
                 viewModel.hideLoading();
                 // End time
                 long endTime = System.currentTimeMillis(); // Or System.nanoTime() for more precision
                 // Calculate the elapsed time
                 long elapsedTime = endTime - startTime;
                 Timber.tag("TimeListTransaction").e("%sms", elapsedTime);
             }
         });

     }

     private void setupEditSearch() {
         binding.edtSearch.addTextChangedListener(new TextWatcher() {
             @Override
             public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

             }

             @SuppressLint("NotifyDataSetChanged")
             @Override
             public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                 List<TransactionResponse> TransactionResponseFilters = new ArrayList<>();
                 String editSearch = binding.edtSearch.getText().toString();
                 viewModel.isSearchEmpty.set(editSearch);
                 if (transactionResponses == null || transactionResponses.isEmpty()){
                     return;
                 }
                 for (TransactionResponse transactionResponse : transactionResponses){
                     if (transactionResponse.getName().toLowerCase().contains(editSearch.toLowerCase())){
                         TransactionResponseFilters.add(transactionResponse);
                     }
                 }
                 adapter.setListTransactionResponse(TransactionResponseFilters);
                 adapter.notifyDataSetChanged();

                 viewModel.totalElements.set(TransactionResponseFilters.size());

             }

             @Override
             public void afterTextChanged(Editable editable) {

             }
         });

         viewModel.isSearch.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
             @Override
             public void onPropertyChanged(Observable sender, int propertyId) {
                 if (Boolean.TRUE.equals(viewModel.isSearch.get())){
                     binding.rcvTransaction.stopScroll();
                     binding.rcvTransaction.scrollToPosition(0);
                 }
             }
         });

         SpannableString spannableHint = new SpannableString(binding.edtSearch.getHint());
         spannableHint.setSpan(new StyleSpan(Typeface.ITALIC), 0, binding.edtSearch.getHint().length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
         binding.edtSearch.setHint(spannableHint);
     }

     public void getTransByKind(int kind){
         viewModel.kind.set(kind);
         binding.rcvTransaction.stopScroll();
         binding.rcvTransaction.scrollToPosition(0);
         viewModel.getMyTransactions(kind);
         binding.edtSearch.setText("");
     }

    public void getAllTrans(){
        viewModel.kind.set(0);
        binding.rcvTransaction.stopScroll();
        binding.rcvTransaction.scrollToPosition(0);
        viewModel.getMyTransactions(null);
        binding.edtSearch.setText("");
    }

     @SuppressLint("NotifyDataSetChanged")
     private void checkPrivateKey() {
            viewModel.validKey.observe(getViewLifecycleOwner(), valid->{
                 if(valid){
                     viewModel.isValidKey.set(true);
                     //Default data
                     setupAdapter();
                     adapter.setSecretKey(SecretKey.getInstance().getKey());
                     adapter.setListTransactionResponse(new ArrayList<>());
                     adapter.notifyDataSetChanged();
                     viewModel.getMyTransactions(null);
                 }else {
                     viewModel.isValidKey.set(false);

                     if (adapter != null){
                             adapter.setListTransactionResponse(new ArrayList<>());
                             adapter.notifyDataSetChanged();
                     }
                 }
            });
     }

     @NonNull
     private ActivityResultLauncher<Intent> getIntentActivityResultLauncher() {
         return
             registerForActivityResult(
                     new ActivityResultContracts.StartActivityForResult(),
                     activityResult -> {
                         int result = activityResult.getResultCode();
                         Intent data = activityResult.getData();
                         if (result == RESULT_OK){
                             Bundle bundle = Objects.requireNonNull(data).getExtras();
                             if (bundle != null){
                                 int position = bundle.getInt(Constants.POSITION);
                                 TransactionResponse transactionResponse = (TransactionResponse) bundle.getSerializable(Constants.TRANSACTION_RESPONSE);

                                 String decrypted = decrypt(Objects.requireNonNull(transactionResponse).getMoney());
                                 Double money = Double.valueOf(decrypted);

                                 //Update total income and total expenditure
                                 recalculateTotalIncomeAndTotalExpenditure(transactionResponse, money);

                                 adapter.getListTransactionResponse().get(position).setTransactionResponse(transactionResponse);
                                 adapter.getListTransactionResponse().get(position).setName(decrypt(transactionResponse.getName()));
                                 adapter.notifyItemChanged(position);
                             }
                         }
                         //from create
                        else if (result == Constants.RESULT_CREATE){
                            viewModel.getMyTransactions(null);
                        }
                     }
             );
     }

     private void recalculateTotalIncomeAndTotalExpenditure(TransactionResponse transactionResponse, Double money) {
         if (updateKind == 1){
             if (transactionResponse.getKind() == 1) {
                 viewModel.totalIncome.set(Objects.requireNonNull(viewModel.totalIncome.get()) - updateMoney);
                 viewModel.totalIncome.set(Objects.requireNonNull(viewModel.totalIncome.get())  + money);
             } else {
                 viewModel.totalIncome.set(Objects.requireNonNull(viewModel.totalIncome.get())  - updateMoney);
                 viewModel.totalExpenditure.set(Objects.requireNonNull(viewModel.totalIncome.get())  + money);
             }
         }
         else {
            if (transactionResponse.getKind() == 1) {
                viewModel.totalExpenditure.set(Objects.requireNonNull(viewModel.totalExpenditure.get()) - updateMoney);
                viewModel.totalIncome.set(Objects.requireNonNull(viewModel.totalExpenditure.get())  + money);
            } else {
                viewModel.totalExpenditure.set(Objects.requireNonNull(viewModel.totalExpenditure.get())  - updateMoney);
                viewModel.totalExpenditure.set(Objects.requireNonNull(viewModel.totalExpenditure.get())  + money);
            }
         }
     }
    public void showKeyBoard2(){
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            binding.edtSearch.requestFocus();
            showKeyboard();
        }, 200);
    }
     private void setupAdapter() {
         adapter = new TransactionResponseAdapter(new ArrayList<>(), new TransactionResponseAdapter.OnItemClickListener() {
             @Override
             public void onItemClick(View view, int pos) {
                 if (checkPermission(Constants.PERMISSION_TRANSACTION_GET)){
                     TransactionResponse TransactionResponse = adapter.getListTransactionResponse().get(pos);
                     updateMoney = Double.valueOf(AESUtils.decrypt(SecretKey.getInstance().getKey(), TransactionResponse.getMoney(), false));
                     updateKind = TransactionResponse.getKind();
                     Intent intent = new Intent(getContext(), TransactionDetailActivity.class);
                     intent.putExtra(Constants.TRANSACTION_ID, TransactionResponse.getId());
                     intent.putExtra(Constants.POSITION, pos);
                     intent.putExtra(Constants.IS_CREATE, false);
                     activityResultLauncher.launch(intent);
                 }
             }

             @Override
             public void onApproveClick(View view, int pos) {
                 approveAt(pos);
             }

             @Override
             public void onRejectClick(View view, int pos) {
                 rejectAt(view.getContext(), pos);
             }

             @Override
             public void onItemClickDelete(View view, int pos) {
                 deleteAt(pos);

             }
         });
         binding.rcvTransaction.setAdapter(adapter);
         binding.rcvTransaction.setLayoutManager(new LinearLayoutManager(
                 getContext(),
                 LinearLayoutManager.VERTICAL,
                 false));
     }


     private void approveAt(int pos){
         YesNoDialog approveDialog =
                 new YesNoDialog(getString(R.string.question_approve_transaction), getString(R.string.cancel), getString(R.string.confirm),
                         new YesNoDialog.Listener() {
                             @Override
                             public void confirmYN() {
                                 viewModel.approveTransactionAt(adapter.getListTransactionResponse().get(pos).getId(), new BaseCallBack() {
                                     @Override
                                     public void doError(Throwable throwable) {
                                         viewModel.showErrorMessage(throwable.getMessage());
                                     }

                                     @SuppressLint("NotifyDataSetChanged")
                                     @Override
                                     public void doSuccess() {
                                         adapter.getListTransactionResponse().get(pos).setState(2);
                                         adapter.notifyItemChanged(pos);
                                     }
                                 });
                             }

                             @Override
                             public void cancelYN() {

                             }
                         });
         approveDialog.show(getChildFragmentManager(), Constants.YES_NO_DIALOG_FRAGMENT);
     }

     public void addNewTransaction() {
        Intent intent = new Intent(getActivity(), TransactionCreateUpdateActivity.class);
        intent.putExtra(Constants.IS_CREATE, true);
        activityResultLauncher.launch(intent);
     }

     @SuppressLint("NotifyDataSetChanged")
     private void setupSwipeFreshLayout() {
         binding.swipeLayout.setEnabled(true);
         binding.swipeLayout.setOnRefreshListener(() -> {
             binding.edtSearch.setText("");
             if (checkSecretKeyValid()){
                 if (Objects.requireNonNull(viewModel.kind.get()) == 0) {
                     viewModel.getMyTransactions(null);
                 } else
                    viewModel.getMyTransactions(viewModel.kind.get());
                 binding.rcvTransaction.scrollToPosition(0);
                 adapter.notifyDataSetChanged();
                 binding.swipeLayout.setRefreshing(false);
             } else
             {
                 if (adapter != null){
                     adapter.setListTransactionResponse(new ArrayList<>());
                     adapter.notifyDataSetChanged();
                 }
                 binding.swipeLayout.setRefreshing(false);
             }

         });
     }

     @SuppressLint("NotifyDataSetChanged")
     public void deleteAt(int pos){
         DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.transaction), new DeleteDialog.DeleteListener() {
             @Override
             public void confirmDelete() {
                 viewModel.deleteTransaction(adapter.getListTransactionResponse().get(pos).getId(), new BaseCallBack() {
                     @Override
                     public void doError(Throwable throwable) {
                         viewModel.showErrorMessage(throwable.getMessage());
                     }

                     @SuppressLint("NotifyDataSetChanged")
                     @Override
                     public void doSuccess() {
                         String decrypted = decrypt(adapter.getListTransactionResponse().get(pos).getMoney());
                         Double money = Double.valueOf(decrypted);
                         if (Objects.requireNonNull(viewModel.transactions.getValue())
                                 .get(pos).getKind() == 1){
                             viewModel.totalIncome.set(
                                     Objects.requireNonNull(viewModel.totalIncome.get()) - money);
                         } else {
                             viewModel.totalExpenditure.set(
                                     Objects.requireNonNull(viewModel.totalExpenditure.get()) - money);
                         }
                         adapter.getListTransactionResponse().remove(pos);
                         if (viewModel.transactions.getValue().isEmpty()){
                             viewModel.totalElements.set(0);
                         }
                         adapter.notifyItemRangeChanged(pos, adapter.getListTransactionResponse().size());
                     }
                 });
             }

             @Override
             public void cancelDelete() {

             }
         });
         deleteDialog.show(getChildFragmentManager(), Constants.DELETE_DIALOG);
     }

     public void rejectAt(Context context, int pos){
         // Show Dialog custom
         Dialog dialog = new Dialog(context);
         dialog.setContentView(R.layout.dialog_reject_transaction);
         Window window = dialog.getWindow();
         if (window == null) {
             return;
         }
         window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
         window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
         WindowManager.LayoutParams windowAttributes = window.getAttributes();
         windowAttributes.gravity  = android.view.Gravity.CENTER;
         window.setAttributes(windowAttributes);
         Button btnReject = dialog.findViewById(R.id.btn_reject);
         Button btnCancel = dialog.findViewById(R.id.btn_cancel);
         EditText edtReason = dialog.findViewById(R.id.edit_reason_reject);

         btnCancel.setOnClickListener(v -> dialog.dismiss());
         btnReject.setOnClickListener(v -> {
             //Reject transaction
             TransactionRejectRequest request = new TransactionRejectRequest();
             request.setId(adapter.getListTransactionResponse().get(pos).getId());
             request.setNote(edtReason.getText().toString());
             viewModel.rejectTransaction(request, new BaseCallBack() {
                 @Override
                 public void doError(Throwable throwable) {
                     viewModel.showErrorMessage(getString(R.string.can_not_reject));
                     dialog.dismiss();
                 }

                 @SuppressLint("NotifyDataSetChanged")
                 @Override
                 public void doSuccess() {
                     String decrypted = decrypt(adapter.getListTransactionResponse().get(pos).getMoney());
                     Double money = Double.valueOf(decrypted);
                     if (Objects.requireNonNull(adapter.getListTransactionResponse()).get(pos).getKind() == 1){
                         viewModel.totalIncome.set(
                                 Objects.requireNonNull(viewModel.totalIncome.get()) - money);
                     } else {
                         viewModel.totalExpenditure.set(
                                 Objects.requireNonNull(viewModel.totalExpenditure.get()) - money);
                     }
                     adapter.getListTransactionResponse().remove(pos);
                     if (adapter.getListTransactionResponse().isEmpty()){
                         viewModel.totalElements.set(0);
                     }
                     adapter.notifyItemRangeChanged(pos, adapter.getListTransactionResponse().size());
                     dialog.dismiss();
                 }
             });

         });
         dialog.show();
     }

     @Override
     protected void performDependencyInjection(FragmentComponent buildComponent) {
        buildComponent.inject(this);
     }

    @Override
     public boolean onTouch(View v, MotionEvent event) {
         switch (event.getActionMasked()) {
             case MotionEvent.ACTION_DOWN:
                 xAxis = v.getX() - event.getRawX();
                 yAxis = v.getY() - event.getRawY();
                 initialX = event.getRawX();
                 initialY = event.getRawY();
                 lastAction = MotionEvent.ACTION_DOWN;
                 break;

             case MotionEvent.ACTION_MOVE:
                 float newX = event.getRawX() + xAxis;
                 float newY = event.getRawY() + yAxis;

                 DisplayMetrics displayMetrics = new DisplayMetrics();
                 requireActivity().getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
                 int screenWidth = displayMetrics.widthPixels;
                 int screenHeight = displayMetrics.heightPixels-getResources().getDimensionPixelSize(R.dimen.bottom_navigation_height);

                 int viewWidth = v.getWidth();
                 int viewHeight = v.getHeight();

                 if (newX < 0) {
                     newX = 0;
                 } else if (newX + viewWidth > screenWidth) {
                     newX = screenWidth - viewWidth;
                 }

                 if (newY < 0) {
                     newY = 0;
                 } else if (newY + viewHeight > screenHeight) {
                     newY = screenHeight - viewHeight;
                 }

                 v.setX(newX);
                 v.setY(newY);
                 lastAction = MotionEvent.ACTION_MOVE;
                 break;

             case MotionEvent.ACTION_UP:
                 if (lastAction == MotionEvent.ACTION_DOWN) {
                     v.performClick();
                 } else {
                     float finalX = event.getRawX();
                     float finalY = event.getRawY();
                     float distance = (float) Math.sqrt(Math.pow(finalX - initialX, 2) + Math.pow(finalY - initialY, 2));
                     if (distance < Constants.CLICK_ACTION_THRESHOLD) {
                         v.performClick();
                     }
                 }
                 break;

             default:
                 return false;
         }
         return true;
     }
     @SuppressLint("NotifyDataSetChanged")
     public void checkSecretKey(){
        setSecretKeyListener();
         if(checkSecretKeyValid()){
             if(Boolean.FALSE.equals(viewModel.validKey.getValue())){
                 viewModel.validKey.setValue(true);
             }
         }else {
             viewModel.validKey.setValue(false);
             if (adapter != null){
                 adapter.setListTransactionResponse(new ArrayList<>());
                 adapter.notifyDataSetChanged();
             }
         }
    }
    public void deleteEditSearch(){
        binding.edtSearch.setText("");
    }

     public void calculateTotal(List<TransactionResponse> TransactionResponses){
         viewModel.totalIncome.set(0.0);
         viewModel.totalExpenditure.set(0.0);
         for (TransactionResponse TransactionResponse : TransactionResponses){
             if (TransactionResponse.getKind() == 1){
                 viewModel.totalIncome.set(
                         Objects.requireNonNull(viewModel.totalIncome.get())
                                 + Double.parseDouble(decrypt(TransactionResponse.getMoney())));
             }else {
                 viewModel.totalExpenditure.set(
                         Objects.requireNonNull(viewModel.totalExpenditure.get())
                                 + Double.parseDouble(decrypt(TransactionResponse.getMoney())));
             }
         }
     }

     public Boolean onBackPressed() {
         // Custom back press handling logic here
         // For example, Pop the fragment back stack
         if (Boolean.TRUE.equals(viewModel.isSearch.get())){
             deleteEditSearch();
             hideKeyboard();
             viewModel.isShowSearch();
             return true;
         }
         return false;

     }

     @Override
     public void onDestroyView() {
         super.onDestroyView();
         viewModel.transactions.removeObservers(this);
     }
 }