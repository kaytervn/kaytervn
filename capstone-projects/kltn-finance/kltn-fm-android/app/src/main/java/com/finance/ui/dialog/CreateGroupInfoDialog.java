package com.finance.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import androidx.databinding.Observable;
import androidx.databinding.ObservableField;

import com.finance.R;
import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.request.chat.ChatRoomCreateGroupRequest;
import com.finance.data.model.api.request.chat.ChatRoomCreateRequest;
import com.finance.data.model.api.response.chat.AutoCompleteAccountResponse;
import com.finance.data.model.api.response.chat.ChatRoomResponse;
import com.finance.data.model.api.response.chat.MemberPermission;
import com.finance.data.model.api.response.chat.SettingChat;
import com.finance.databinding.DialogCreateChatBinding;
import com.finance.ui.chat.adapter.AddMembersAdapter;
import com.finance.ui.chat.adapter.CustomArrayAdapter;
import com.finance.utils.BindingUtils;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import es.dmoral.toasty.Toasty;
import lombok.Getter;

public class CreateGroupInfoDialog extends Dialog {
    DialogCreateChatBinding binding;
    ChatRoomResponse chatRoomResponse;
    ObservableField<String> avatarPath;
    private CreateGroupListener listener;

    private HashSet<AutoCompleteAccountResponse> selectedPeople = new HashSet<>();
    private AutoCompleteAccountResponse selectedPeopleCurrent;
    private List<AutoCompleteAccountResponse> originalPeople;
    private List<String> listPeoples;
    private ArrayAdapter<String> adapterKind;
    @Getter
    private CustomArrayAdapter adapterPeople;
    public ObservableField<Integer> isGroup = new ObservableField<>(0);
    private AddMembersAdapter addMembersAdapter;
    public interface CreateGroupListener {
        void onCreateChat(ChatRoomCreateRequest request);
        void onCreateGroupChat(ChatRoomCreateGroupRequest request);
        void onSelectGroup(Integer isGroup);
        void onSelectGroupImage();
    }

    public CreateGroupInfoDialog(Context context,
                                 ChatRoomResponse chatRoomResponse,
                                 ObservableField<String> avatarPath,
                                 List<AutoCompleteAccountResponse> listAccounts,
                                 List<String> listPeoples,
                                 CreateGroupListener listener) {
        super(context);
        this.chatRoomResponse = chatRoomResponse;
        this.avatarPath = avatarPath;
        this.originalPeople = listAccounts;
        this.listPeoples = listPeoples;
        this.listener = listener;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setupViews();
        setupCbbKind();
        setupOnItemClickListeners();
        setupAddMembersAdapter();

        adapterPeople = new CustomArrayAdapter(getContext(), R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, listPeoples);
        binding.cbbPeopleGroup.setAdapter(adapterPeople);
    }

    private void setupAddMembersAdapter() {
        addMembersAdapter = new AddMembersAdapter(getContext(), selectedPeople, new AddMembersAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(String name, int position) {

            }

            @Override
            public void onCancelClick(AutoCompleteAccountResponse item) {
                selectedPeople.remove(item);
                addMembersAdapter.updateList(selectedPeople);
            }
        });

        binding.recyclerViewMembers.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(getContext()));
        binding.recyclerViewMembers.setAdapter(addMembersAdapter);
    }


    private void setupViews() {
        binding = DialogCreateChatBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        binding.setD(this);
        Window window = getWindow();
        if (window != null) {
            window.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            window.setGravity(Gravity.CENTER);
            window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }
        avatarPath.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                if (!TextUtils.isEmpty(avatarPath.get())) {
                    BindingUtils.setImageUrl(binding.imgGroupAvatar, avatarPath.get());
                }
            }
        });
        // Set giá trị hiện tại
        if (!TextUtils.isEmpty(chatRoomResponse.getName())) {
            binding.edtGroupName.setText(chatRoomResponse.getName());
        }

        BindingUtils.setImageUrl(binding.imgGroupAvatar, chatRoomResponse.getAvatar());

        binding.switchAllowSendMessages.setChecked(true);
        binding.switchAllowUpdateInfo.setChecked(true);
        binding.switchAllowAddMembers.setChecked(true);

        binding.btnClose.setOnClickListener(v -> dismiss());

        binding.imgGroupAvatar.setOnClickListener(v -> {
            if (listener != null) {
                listener.onSelectGroupImage();
            }
        });

        binding.btnCancel.setOnClickListener(v -> dismiss());

        binding.btnCreate.setOnClickListener(v -> {
            String groupName = binding.edtGroupName.getText().toString().trim();
            if (isGroup.get() == 1) {
                if (TextUtils.isEmpty(groupName)) {
                    Toasty.error(getContext(), getContext().getResources().getString(R.string.error_group_name_empty), Toast.LENGTH_SHORT, true).show();
                    return;
                }
                if (selectedPeople.size() < 2) {
                    Toasty.error(getContext(), getContext().getResources().getString(R.string.error_max_member_group), Toast.LENGTH_SHORT, true).show();
                    return;
                }
                ChatRoomCreateGroupRequest request = new ChatRoomCreateGroupRequest();
                request.setName(groupName);
                request.setAvatar(avatarPath.get());
                List<Long> memberIds = new ArrayList<>();
                for (AutoCompleteAccountResponse person : selectedPeople) {
                    memberIds.add(person.getId());
                }
                request.setMemberIds(memberIds);
                SettingChat settingChat = new SettingChat();
                settingChat.setMemberPermissions(new MemberPermission());
                settingChat.getMemberPermissions().setAllowInviteMembers(binding.switchAllowAddMembers.isChecked());
                settingChat.getMemberPermissions().setAllowSendMessage(binding.switchAllowSendMessages.isChecked());
                settingChat.getMemberPermissions().setAllowUpdateChatRoom(binding.switchAllowUpdateInfo.isChecked());
                request.setSettings(ApiModelUtils.GSON.toJson(settingChat));
                listener.onCreateGroupChat(request);
            } else if (isGroup.get() == 2) {
                if (binding.cbbPeopleGroup.getText().toString().trim().isEmpty() || selectedPeopleCurrent == null) {
                    Toasty.error(getContext(), getContext().getResources().getString(R.string.error_select_people_group), Toast.LENGTH_SHORT, true).show();
                    return;
                }
                ChatRoomCreateRequest request = new ChatRoomCreateRequest();
                request.setAccountId(selectedPeopleCurrent.getId());
                listener.onCreateChat(request);
            }
            dismiss();
        });
    }



    private void setupCbbKind() {
        List<String> kindNames = new ArrayList<>();
        kindNames.add(getContext().getResources().getString(R.string.type_chat_1));
        kindNames.add(getContext().getResources().getString(R.string.type_chat_2));
        adapterKind = new ArrayAdapter<>(getContext(), R.layout.layout_drop_down_item_line, R.id.tv_drop_down_item, kindNames);
        binding.cbbTypeChat.setAdapter(adapterKind);
    }

    private void setupOnItemClickListeners() {
        binding.cbbTypeChat.setOnItemClickListener((parent, view, position, id) -> {
            // Clear selected people
            selectedPeople.clear();
            addMembersAdapter.updateList(selectedPeople);
            binding.cbbPeopleGroup.setText("");

            if (position == 0) {
                isGroup.set(1);
                listener.onSelectGroup(1);
            } else {
                isGroup.set(2);
                listener.onSelectGroup(2);
            }
        });
        binding.cbbPeopleGroup.setOnItemClickListener((adapterView, view, position, id) -> {
            selectedPeople.add(originalPeople.get(position));
            addMembersAdapter.updateList(selectedPeople);
            if (isGroup.get() == 2) {
                selectedPeopleCurrent = originalPeople.get(position);
            }
        });
    }


    @Override
    protected void onStop() {
        super.onStop();
        if (binding != null) {
            binding = null;
        }
    }
}
