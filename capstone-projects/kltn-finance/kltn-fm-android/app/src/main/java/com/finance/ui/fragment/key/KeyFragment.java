package com.finance.ui.fragment.key;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
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
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.databinding.library.baseAdapters.BR;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.response.key.KeyResponse;
import com.finance.databinding.FragmentKeyBinding;
import com.finance.di.component.FragmentComponent;
import com.finance.ui.base.BaseFragment;
import com.finance.ui.key.filter.KeyFilterActivity;
import com.finance.ui.key.infor.KeyInfoActivity;
import com.finance.ui.fragment.key.adapter.KeyAdapter;
import com.finance.ui.key.details.KeyDetailsActivity;
import com.finance.utils.NetworkUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;
import timber.log.Timber;

public class KeyFragment extends BaseFragment<FragmentKeyBinding, KeyFragmentViewModel>
        implements View.OnTouchListener{

    KeyAdapter keyAdapter;
    private float xAxis, yAxis,initialX,initialY;
    int lastAction;

    MVVMApplication application;
    private final ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityForResult();

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    protected int getLayoutId() {
        return R.layout.fragment_key;
    }

    @SuppressLint("ClickableViewAccessibility")
    @Override
    protected void performDataBinding() {
        binding.setLifecycleOwner(getViewLifecycleOwner());
        application = (MVVMApplication) requireActivity().getApplication();

        keyAdapter = new KeyAdapter();
        setRcKeys();

        viewModel.validKey.observe(this, valid->{
            if(valid){
                getKey();
                viewModel.isValidKey.set(true);
            }else {
//                ((MainActivity) getActivity()).showInputKey();
                viewModel.isValidKey.set(false);
            }
        });

        binding.btnAdd.setOnTouchListener(this);


        binding.swipeLayout.setOnRefreshListener(() -> {
            refreshRc();
            binding.swipeLayout.setRefreshing(false);
        });

        setupEditSearch();

    }

    private ActivityResultLauncher<Intent> getIntentActivityForResult() {
        return registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == Activity.RESULT_OK) {
                    Intent data = result.getData();
                    if(data != null){
                        if(viewModel.positionUC.get() != null){
                            String key = Objects.requireNonNull(data.getExtras()).getString(Constants.KEY);
                            KeyResponse keyResponse = ApiModelUtils.fromJson(key, KeyResponse.class);
                            Objects.requireNonNull(keyResponse).setName(decrypt(keyResponse.getName()));
                            keyAdapter.updateItem(viewModel.positionUC.get(), keyResponse);
                            viewModel.positionUC.set(null);
                        }else {
                            viewModel.pageNumber.set(0);
                            getKey();
                        }
                    }
                }
                //From filter
                else  if(result.getResultCode() == Constants.FILTER){
                    Intent intent = result.getData();
                    if(intent != null){
                        Bundle bundle = intent.getExtras();
                        if(bundle != null){
                            if(bundle.getLong(Constants.KEY_GROUP_ID) != 0){
                                viewModel.keyGroupId.set(bundle.getLong(Constants.KEY_GROUP_ID));
                            }else {
                                viewModel.keyGroupId.set(null);
                            }
                            if(bundle.getLong(Constants.ORGANIZATION_ID) != 0){
                                viewModel.organizationId.set(bundle.getLong(Constants.ORGANIZATION_ID));
                            }else {
                                viewModel.organizationId.set(null);
                            }
                            if(bundle.getInt(Constants.KIND) != 0){
                                viewModel.kind.set(bundle.getInt(Constants.KIND));
                            }else {
                                viewModel.kind.set(null);
                            }

                            if (bundle.getLong(Constants.TAG_ID) != 0){
                                viewModel.tagId.set(bundle.getLong(Constants.TAG_ID));
                            }else {
                                viewModel.tagId.set(null);
                            }

                            Timber.tag("KeyFragment-s").e("tagid: %s", viewModel.tagId.get());
                            refreshRc();
                        }
                    }
                }
            });
    }

    private void setupEditSearch() {
        binding.edtSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                searchKey();
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                searchKey();
            }

            @Override
            public void afterTextChanged(Editable editable) {
                searchKey();
            }
        });

        SpannableString spannableHint = new SpannableString(binding.edtSearch.getHint());
        spannableHint.setSpan(new StyleSpan(Typeface.ITALIC), 0, binding.edtSearch.getHint().length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        binding.edtSearch.setHint(spannableHint);

        viewModel.isSearch.addOnPropertyChangedCallback(new androidx.databinding.Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(androidx.databinding.Observable sender, int propertyId) {
                if (Boolean.TRUE.equals(viewModel.isSearch.get())){
                    binding.rcKeys.stopScroll();
                    binding.rcKeys.scrollToPosition(0);
                    binding.edtSearch.requestFocus();
                    showKeyboard();
                }
            }
        });
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
                        navigateToDetails();
                    }
                }
                break;

            default:
                return false;
        }
        return true;
    }

    public void navigateToDetails(){
        Intent intent = new Intent(getActivity(), KeyDetailsActivity.class);
        intent.putExtra(Constants.IS_CREATE, true);
        activityResultLauncher.launch(intent);
        viewModel.isCreate.set(true);
        closeFilter();
    }

    private void getKey(){
        if (Objects.requireNonNull(viewModel.pageNumber.get()) == 0) {
            viewModel.showLoading();
        }

        if (viewModel.keyGroupId.get() != null && Objects.requireNonNull(viewModel.keyGroupId.get()) == 0L) {
            viewModel.keyGroupId.set(null);
        }
        if (viewModel.organizationId.get() != null && Objects.requireNonNull(viewModel.organizationId.get()) == 0L) {
            viewModel.organizationId.set(null);
        }
        if (viewModel.tagId.get() != null && Objects.requireNonNull(viewModel.tagId.get()) == 0L) {
            viewModel.tagId.set(null);
        }

        if (viewModel.kind.get() != null && Objects.requireNonNull(viewModel.kind.get()) == 0) {
            viewModel.kind.set(null);
        }

        viewModel.getCompositeDisposable().add(viewModel.getKeys()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    if(response.isResult()) {
                        viewModel.totalElement.set(response.getData().getTotalElements().intValue());
                        if(response.getData().getContent()!=null){
                            viewModel.keyList.set(response.getData().getContent());
                            if (Objects.requireNonNull(viewModel.pageNumber.get()) == 0) {
                                List<KeyResponse> keyResponses = response.getData().getContent();
                                for (int i = 0; i < keyResponses.size(); i++) {
                                    keyResponses.get(i).setName(decrypt(keyResponses.get(i).getName()));
                                }
                                keyAdapter.setKeys(keyResponses);
                            }else {
                                List<KeyResponse> keyResponses = response.getData().getContent();
                                for (int i = 0; i < keyResponses.size(); i++) {
                                    keyResponses.get(i).setName(decrypt(keyResponses.get(i).getName()));
                                }
                                keyAdapter.addList(keyResponses);
                            }
                        }else {
                            if (Objects.requireNonNull(viewModel.pageNumber.get()) == 0) {
                                keyAdapter.setKeys(new ArrayList<>());
                            }
                        }
                    }
                    viewModel.hideLoading();
                },error->{
                    viewModel.showErrorMessage(getString(R.string.newtwork_error));
                    Timber.d(error);
                    viewModel.hideLoading();
                })
        );
    }

    public void setRcKeys(){
        keyAdapter.setLock(!checkPermission(Constants.PERMISSION_KEY_INFO_DELETE));
        RecyclerView.LayoutManager layout = new LinearLayoutManager(getActivity(),LinearLayoutManager.VERTICAL, false);
        binding.rcKeys.setAdapter(keyAdapter);

        keyAdapter.setKeyListener(new KeyAdapter.KeyListener() {
            @Override
            public void itemClick(int position, KeyResponse key) {
                if(!checkPermission(Constants.PERMISSION_KEY_INFO_GET)){
                    return;
                }
                closeFilter();
                Intent intent = new Intent(getActivity(), KeyInfoActivity.class);
                intent.putExtra(Constants.KEY_ID, key.getId());
                viewModel.positionUC.set(position);
                activityResultLauncher.launch(intent);
            }

            @Override
            public void deleteKey(int position, KeyResponse Key) {
                closeFilter();
                showDialogConfirm(Key.getId(), position);
            }
        });

        binding.rcKeys.setLayoutManager(layout);
    }

    public void showDialogConfirm(Long id, int position){
        // Dialog custom
        Dialog dialog = new Dialog(requireActivity());
        dialog.setContentView(R.layout.dialog_confirm);
        Window window = dialog.getWindow();

        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));

        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);

        Button btnConfirm = dialog.findViewById(R.id.btn_confirm);
        Button btnCancel = dialog.findViewById(R.id.btn_cancel);
        TextView textView = dialog.findViewById(R.id.title);
        textView.setText(R.string.confirm_delete_key);
        btnCancel.setOnClickListener(v -> dialog.dismiss());

        btnConfirm.setOnClickListener(v -> {
            deleteKey(id, position);
            dialog.dismiss();
        });
        dialog.show();
    }

    public void deleteKey(Long id, int position){
        viewModel.showLoading();
        viewModel.getCompositeDisposable().add(viewModel.deleteKey(id)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                viewModel.hideLoading();
                                return ((MVVMApplication) requireActivity().getApplication()).showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            viewModel.hideLoading();
                            if (response.isResult()) {
                                keyAdapter.deleteItem(position);
                                viewModel.showSuccessMessage(getString(R.string.delete_key_success));
                            }else {
                                viewModel.showErrorMessage(response.getMessage());
                            }
                        }, throwable -> {
                            viewModel.hideLoading();
                            viewModel.showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    @Override
    public void onResume() {
        super.onResume();
        viewModel.positionUC.set(null);
    }

    public void checkSecretKey(){
        setSecretKeyListener();
        if(checkSecretKeyValid()){
            if(Boolean.FALSE.equals(viewModel.validKey.getValue())){
                viewModel.validKey.setValue(true);
            }
        }else {
            viewModel.validKey.setValue(false);
        }
    }

    private void refreshRc(){
        viewModel.deleteTextSearch();
        viewModel.pageNumber.set(0);
        getKey();
    }

    public void navigateToFilter(){
        Intent intent = new Intent(getActivity(), KeyFilterActivity.class);
        Bundle bundle = new Bundle();
        //Kind
        if (viewModel.kind.get() == null)
            bundle.putInt(Constants.KIND, 0);
        else
            bundle.putInt(Constants.KIND, Objects.requireNonNull(viewModel.kind.get()));
        //KeyGroup
        if (viewModel.keyGroupId.get() == null)
            bundle.putLong(Constants.KEY_GROUP_ID, 0L);
        else
            bundle.putLong(Constants.KEY_GROUP_ID, Objects.requireNonNull(viewModel.keyGroupId.get()));
        //Organization
        if (viewModel.organizationId.get() == null)
            bundle.putLong(Constants.ORGANIZATION_ID, 0L);
        else
            bundle.putLong(Constants.ORGANIZATION_ID, Objects.requireNonNull(viewModel.organizationId.get()));
        //Tag
        if (viewModel.tagId.get() == null)
            bundle.putLong(Constants.TAG_ID, 0L);
        else
            bundle.putLong(Constants.TAG_ID, Objects.requireNonNull(viewModel.tagId.get()));

        intent.putExtras(bundle);
        activityResultLauncher.launch(intent);
    }

    public void searchKey(){
        if(viewModel.keyList.get() == null || Objects.requireNonNull(viewModel.keyList.get()).isEmpty()){
            return;
        }
        List<KeyResponse> keyResponses = new ArrayList<>();
        if (viewModel.textName.get() == null || Objects.requireNonNull(viewModel.textName.get()).isEmpty()) {
            keyResponses = viewModel.keyList.get();
            viewModel.isSearchEmpty.set("");
        } else {
            String text = Objects.requireNonNull(viewModel.textName.get()).toLowerCase();
            for (KeyResponse item : Objects.requireNonNull(viewModel.keyList.get())) {
                if (item.getName().toLowerCase().contains(text)) {
                    keyResponses.add(item);
                }
            }
            viewModel.isSearchEmpty.set(viewModel.textName.get());
        }
        keyAdapter.setKeys(keyResponses);
        viewModel.totalElement.set(Objects.requireNonNull(keyResponses).size());

    }

    public void closeFilter(){
        hideKeyboard();
        if(Boolean.TRUE.equals(viewModel.isShowFilter.get())){
            showFilter();
        }
    }
    public void showFilter(){
        if(!checkPermission(Constants.PERMISSION_KEY_INFO_LIST) || Boolean.FALSE.equals(viewModel.isValidKey.get())){
            return;
        }
        viewModel.isShowFilter.set(Boolean.FALSE.equals(viewModel.isShowFilter.get()));
    }
    public void deleteEditSearch(){
        binding.edtSearch.setText("");
    }
    public Boolean onBackPressed() {
        // Your custom back press handling logic here
        // For example, you can pop the fragment back stack
        if (Boolean.TRUE.equals(viewModel.isSearch.get())){
            deleteEditSearch();
            hideKeyboard();
            viewModel.isShowSearch();
            return true;
        }
        return false;

    }
}