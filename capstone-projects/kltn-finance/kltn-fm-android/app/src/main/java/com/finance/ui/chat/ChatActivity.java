package com.finance.ui.chat;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.Editable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextWatcher;
import android.text.style.StyleSpan;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.Observable;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.finance.BR;
import com.finance.R;
import com.finance.data.SecretKey;
import com.finance.data.model.api.request.chat.ChatRoomCreateGroupRequest;
import com.finance.data.model.api.request.chat.ChatRoomCreateRequest;
import com.finance.data.model.api.response.chat.AutoCompleteAccountResponse;
import com.finance.data.model.api.response.chat.ChatRoomResponse;
import com.finance.databinding.ActivityChatBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.chat.adapter.ChatRoomAdapter;
import com.finance.ui.chat.detail.ChatDetailActivity;
import com.finance.ui.dialog.CreateGroupInfoDialog;

import java.util.ArrayList;
import java.util.List;

public class ChatActivity extends BaseActivity<ActivityChatBinding, ChatViewModel> {
    ChatRoomAdapter chatRoomAdapter;
    private final ActivityResultLauncher<Intent> activityResultLauncher = getIntentActivityResultLauncher();

    @NonNull
    private ActivityResultLauncher<Intent> getIntentActivityResultLauncher() {
        return
                registerForActivityResult(
                        new ActivityResultContracts.StartActivityForResult(),
                        activityResult -> {
                            int result = activityResult.getResultCode();
                            if (result == RESULT_OK){
                                viewModel.getAllChatRooms();
                            }
                        }
                );
    }

    @Override
    public int getLayoutId() {
        return R.layout.activity_chat;
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
        setupSearch();
        setupSwipeFreshLayout();
        checkPrivateKey();
        viewModel.membersLiveData.observe(this, members -> {
            if (members != null && !members.isEmpty()) {
                viewModel.listMembers.clear();
                viewModel.listPeoples.clear();
                viewModel.listMembers.addAll(members);
                for (AutoCompleteAccountResponse member : members) {
                    viewModel.listPeoples.add(member.getFullName());
                }
            }
        });
    }

    @SuppressLint("NotifyDataSetChanged")
    private void checkPrivateKey() {
        viewModel.validKey.observe(this,valid->{
            if(valid){
                viewModel.isValidKey.set(true);
                //Default data
                setupAdapter();
                chatRoomAdapter.setChatList(new ArrayList<>());
                chatRoomAdapter.setSecretKey(SecretKey.getInstance().getKey());
                chatRoomAdapter.notifyDataSetChanged();
                viewModel.showLoading();
                viewModel.getAllChatRooms();
            }else {
                viewModel.isValidKey.set(false);
                if (chatRoomAdapter != null){
                    chatRoomAdapter.setChatList(new ArrayList<>());
                    chatRoomAdapter.notifyDataSetChanged();
                }
                showInputKey();
            }
        });
    }

    private void setupAdapter() {
        chatRoomAdapter = new ChatRoomAdapter(new ArrayList<>(), chat -> {
            // Handle click
            Intent intent = new Intent(this, ChatDetailActivity.class);
            ChatDetailActivity.CHAT_ROOM_ID = chat.getId();
            activityResultLauncher.launch(intent);
        });
        chatRoomAdapter.setSecretKey(SecretKey.getInstance().getKey());
        observeChatRoomList(chatRoomAdapter);
        viewBinding.rcvChat.setLayoutManager(new LinearLayoutManager(this));
        viewBinding.rcvChat.setAdapter(chatRoomAdapter);
    }

    @SuppressLint("NotifyDataSetChanged")
    private void observeChatRoomList(ChatRoomAdapter chatRoomAdapter) {
        viewModel.chatRoomLiveData.observe(this, chatRooms -> {
            if (chatRooms == null) {
                return;
            }
            viewModel.chatRoomList = chatRooms;
            chatRoomAdapter.setChatList(viewModel.chatRoomList);
            chatRoomAdapter.notifyDataSetChanged();
            viewModel.hideLoading();
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
                String editSearch = viewBinding.edtSearch.getText().toString();
                viewModel.isSearchEmpty.set(editSearch);
                List<ChatRoomResponse> filteredList = new ArrayList<>();
                for (ChatRoomResponse chat : viewModel.chatRoomList) {
                    if (chat.getName().toLowerCase().contains(editSearch.toLowerCase())) {
                        filteredList.add(chat);
                    }
                }
                chatRoomAdapter.setChatList(filteredList);
                chatRoomAdapter.notifyDataSetChanged();
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        viewModel.isSearch.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                if (Boolean.TRUE.equals(viewModel.isSearch.get())){
                    viewBinding.edtSearch.requestFocus();
                    showKeyboard();
                } else {
                    viewBinding.edtSearch.clearFocus();
                    hideKeyboard();
                    chatRoomAdapter.setChatList(viewModel.chatRoomList);
                    chatRoomAdapter.notifyDataSetChanged();
                }
            }
        });
        //Set hint italic
        SpannableString spannableHint = new SpannableString(viewBinding.edtSearch.getHint());
        spannableHint.setSpan(new StyleSpan(Typeface.ITALIC), 0, viewBinding.edtSearch.getHint().length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        viewBinding.edtSearch.setHint(spannableHint);
    }

    public void deleteEditSearch(){
        viewBinding.edtSearch.setText("");
    }

    @SuppressLint("NotifyDataSetChanged")
    private void setupSwipeFreshLayout() {
        viewBinding.swipeLayout.setEnabled(true);
        viewBinding.swipeLayout.setOnRefreshListener(() -> {
            if (checkSecretKeyValid()){
                viewModel.showLoading();
                viewModel.getAllChatRooms();
                viewBinding.swipeLayout.setRefreshing(false);
            } else
            {
                if (chatRoomAdapter != null){
                    chatRoomAdapter.setChatList(new ArrayList<>());
                    chatRoomAdapter.notifyDataSetChanged();
                }
                viewBinding.swipeLayout.setRefreshing(false);
                this.showInputKey();
            }
        });
    }

    private CreateGroupInfoDialog createChatDialog;
    public void createNewChatRoom() {
        createChatDialog = new CreateGroupInfoDialog(
                this,
                new ChatRoomResponse(),
                viewModel.avatarPath,
                viewModel.listMembers,
                viewModel.listPeoples,
                new CreateGroupInfoDialog.CreateGroupListener() {
                    @Override
                    public void onCreateChat(ChatRoomCreateRequest request) {
                        viewModel.createChat(request, createChatDialog);
                    }

                    @Override
                    public void onCreateGroupChat(ChatRoomCreateGroupRequest request) {
                        viewModel.createGroupChat(request, createChatDialog);
                    }

                    @Override
                    public void onSelectGroup(Integer isGroup) {
                        if (isGroup == 1) {
                            viewModel.getMembers(null);
                        } else {
                            viewModel.getMembers(1);
                        }
                    }

                    @Override
                    public void onSelectGroupImage() {
//                        viewModel.selectGroupImage();
                    }
                }
        );
        createChatDialog.show();
    }

    @Override
    public void onBackPressed() {
        if (Boolean.TRUE.equals(viewModel.isSearch.get())){
            hideKeyboard();
            viewModel.isShowSearch();
            deleteEditSearch();
        } else {
            super.onBackPressed();
        }
    }
}
