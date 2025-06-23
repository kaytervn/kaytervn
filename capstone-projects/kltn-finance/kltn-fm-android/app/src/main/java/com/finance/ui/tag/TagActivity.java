package com.finance.ui.tag;

import static java.lang.Math.pow;
import static java.lang.Math.sqrt;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.Editable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextWatcher;
import android.text.style.StyleSpan;
import android.util.DisplayMetrics;
import android.view.MotionEvent;
import android.view.View;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.Observable;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.databinding.ActivityTagBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.base.BaseCallBack;
import com.finance.ui.dialog.DeleteDialog;
import com.finance.ui.tag.adapter.TagAdapter;
import com.finance.ui.tag.adapter.TagKindAdapter;
import com.finance.ui.tag.detail.TagDetailActivity;


import java.util.ArrayList;
import java.util.List;

import timber.log.Timber;

public class TagActivity extends BaseActivity<ActivityTagBinding, TagViewModel>
        implements  View.OnTouchListener
{
    private List<TagResponse> tags;
    List<String> tagKinds = new ArrayList<>();
    private Integer position;
    private TagAdapter adapter;
    private TagKindAdapter tagKindAdapter;
    private float xAxis, yAxis,initialX,initialY;
    int lastAction;
    ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityResultLauncher();

    @Override
    public int getLayoutId() {
        return R.layout.activity_tag;
    }

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    public void performDependencyInjection(ActivityComponent buildComponent) {
        buildComponent.inject(this);
    }

    @SuppressLint("ClickableViewAccessibility")
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        viewBinding.btnAdd.setOnTouchListener(this);
        checkPrivateKey();

        setupSwipeFreshLayout();
        setupSearch();
        //Get list services from API
        getTags();
        //Get service detail from update - API
        getTagDetails();

    }

    public void addNewTag() {
        Intent intent = new Intent(this, TagDetailActivity.class);
        intent.putExtra(Constants.IS_CREATE, true);
        activityResultLauncher.launch(intent);
    }

    @SuppressLint("NotifyDataSetChanged")
    private void checkPrivateKey() {
        viewModel.validKey.observe(this,valid->{
            if(valid){
                viewModel.isValidKey.set(true);
                //Default data
                setupAdapter();
                setupTagKindAdapter();
                adapter.setTagResponses(new ArrayList<>());
                adapter.setSecretKey(SecretKey.getInstance().getKey());
                adapter.notifyDataSetChanged();
                viewModel.getTags(Constants.TAG_KIND_TRANSACTION);
            }else {
                viewModel.isValidKey.set(false);
                if (adapter != null){
                    adapter.setTagResponses(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                showInputKey();
            }
        });
    }

    private void setupSearch() {
        viewBinding.edtSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                List<TagResponse> tagResponseFilters = new ArrayList<>();
                String editSearch = viewBinding.edtSearch.getText().toString();
                viewModel.isSearchEmpty.set(editSearch);

                if (tags == null || tags.isEmpty()){
                    return;
                }

                for (TagResponse tagResponse : tags){
                    if (tagResponse.getName().toLowerCase().contains(editSearch.toLowerCase())){
                        tagResponseFilters.add(tagResponse);
                    }
                }

                adapter.setTagResponses(tagResponseFilters);
                adapter.notifyDataSetChanged();
                viewModel.totalElements.set(tagResponseFilters.size());
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        viewModel.isSearch.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                if (Boolean.TRUE.equals(viewModel.isSearch.get())){
                    viewBinding.rcvTags.stopScroll();
                    viewBinding.rcvTags.scrollToPosition(0);
                    viewBinding.edtSearch.requestFocus();
                    showKeyboard();
                }
            }
        });
        SpannableString spannableHint = new SpannableString(viewBinding.edtSearch.getHint());
        spannableHint.setSpan(new StyleSpan(Typeface.ITALIC), 0, viewBinding.edtSearch.getHint().length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        viewBinding.edtSearch.setHint(spannableHint);
    }
    @SuppressLint("NotifyDataSetChanged")
    private void setupTagKindAdapter() {

        tagKinds.add(getString(R.string.transaction));
        tagKinds.add(getString(R.string.service));
        tagKinds.add(getString(R.string.key));
        tagKinds.add(getString(R.string.note));

        tagKindAdapter = new TagKindAdapter(tagKinds, new TagKindAdapter.TagKindListener() {
            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void itemClick(View view, int position) {
                selectKind(position+1);
            }
        });
        tagKindAdapter.setSelectedName(tagKinds.get(0));
        tagKindAdapter.notifyDataSetChanged();
        viewBinding.rcvKinds.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        viewBinding.rcvKinds.setAdapter(tagKindAdapter);
    }

    @SuppressLint("NotifyDataSetChanged")
    public void selectKind(int kind){
        viewModel.tagKind.set(kind);
        //here "kind" means position too
        tagKindAdapter.setSelectedName(tagKinds.get(kind-1));
        tagKindAdapter.notifyDataSetChanged();
        viewModel.getTags(viewModel.tagKind.get());
    }

    private void setupAdapter() {
        adapter = new TagAdapter(new ArrayList<>(), new TagAdapter.TagListener() {
            @Override
            public void onItemClick(int position, View view) {
                if (checkPermission(Constants.PERMISSION_TAG_GET)){
                    Intent intent = new Intent(view.getContext(), TagDetailActivity.class);
                    intent.putExtra(Constants.TAG_ID, adapter.getTagResponses().get(position).getId());
                    intent.putExtra(Constants.IS_CREATE, false);
                    intent.putExtra(Constants.POSITION, position);
                    activityResultLauncher.launch(intent);
                }
            }
            @Override
            public void onDeleteClick(int position, View view) {
                deleteAt(position);
            }

        });

        viewBinding.rcvTags.setLayoutManager(new LinearLayoutManager(this));
        viewBinding.rcvTags.setAdapter(adapter);
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
                                if (data != null){
                                    Bundle bundle = data.getExtras();
                                    if (bundle != null){
                                        selectKind(bundle.getInt(Constants.TAG_KIND));
                                    }
                                }
                            }
                            else if (result == Constants.RESULT_UPDATE){
                                if (data != null){
                                    Bundle bundle = data.getExtras();
                                    if (bundle != null){
                                        viewModel.getTagDetail(bundle.getLong(Constants.TAG_ID));
                                        position = bundle.getInt(Constants.POSITION);
                                    }
                                }
                            }
                        }
                );

    }

    public void deleteAt(int pos){
        DeleteDialog deleteDialog = new DeleteDialog(getString(R.string.service), new DeleteDialog.DeleteListener() {
            @Override
            public void confirmDelete() {
                viewModel.deleteTag(adapter.getTagResponses().get(pos).getId(), new BaseCallBack() {
                    @Override
                    public void doError(Throwable throwable) {
                        viewModel.showErrorMessage(throwable.getMessage());
                    }

                    @Override
                    public void doSuccess() {
                        adapter.getTagResponses().remove(pos);
                        if (adapter.getTagResponses().isEmpty()){
                            viewModel.totalElements.set(0);
                        }
                        adapter.notifyItemRangeChanged(pos, adapter.getTagResponses().size());
                    }
                });
            }

            @Override
            public void cancelDelete() {

            }
        });
        deleteDialog.show(this.getSupportFragmentManager(), Constants.DELETE_DIALOG);
    }

    @SuppressLint("NotifyDataSetChanged")
    private void setupSwipeFreshLayout() {
        viewBinding.swipeLayout.setEnabled(true);
        viewBinding.swipeLayout.setOnRefreshListener(() -> {
            viewBinding.edtSearch.setText("");
            if (checkSecretKeyValid()){
                //Check if sort by Date
                viewModel.getTags(viewModel.tagKind.get());
                viewBinding.swipeLayout.setRefreshing(false);
            } else
            {
                if (adapter != null){
                    adapter.setTagResponses(new ArrayList<>());
                    adapter.notifyDataSetChanged();
                }
                viewBinding.swipeLayout.setRefreshing(false);
                showInputKey();
            }
        });
    }

    public void deleteEditSearch(){
        viewBinding.edtSearch.setText("");
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
                getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
                int screenWidth = displayMetrics.widthPixels;
                int screenHeight = displayMetrics.heightPixels;
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
                    float distance = (float) sqrt(pow(finalX - initialX, 2) + pow(finalY - initialY, 2));
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
    private void getTags() {
        viewModel.tags.observe(this, tagResponses -> {
            Timber.tag("TagActivity-R").e("getTags: %s", tagResponses);
            if (tagResponses == null || tagResponses.isEmpty())
                return;
            for (TagResponse tagResponse : tagResponses){
                tagResponse.setName(decrypt(tagResponse.getName()));
            }
            tags = tagResponses;
            adapter.setTagResponses(tagResponses);
            viewBinding.rcvTags.scrollToPosition(0);
            adapter.notifyDataSetChanged();
        });
    }

    private void getTagDetails() {
        viewModel.tagLiveData.observe(this, tagResponse -> {
            // from update
            if (tagResponse == null || tagResponse.getId() == null){
                return;
            }
            tagResponse.setName(decrypt(tagResponse.getName()));
            adapter.getTagResponses().set(position, tagResponse);
            adapter.notifyItemChanged(position);
        });
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
