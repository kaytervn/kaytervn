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
import android.widget.Toast;

import androidx.databinding.Observable;
import androidx.databinding.ObservableField;

import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.request.chat.ChatRoomUpdateRequest;
import com.finance.data.model.api.response.chat.ChatRoomResponse;
import com.finance.data.model.api.response.chat.SettingChat;
import com.finance.data.model.api.response.chat.detail.ChatDetailResponse;
import com.finance.databinding.DialogUpdateGroupBinding;
import com.finance.utils.BindingUtils;

import es.dmoral.toasty.Toasty;

public class UpdateGroupInfoDialog extends Dialog {
    DialogUpdateGroupBinding binding;
    ChatRoomResponse chatRoomResponse;
    ObservableField<String> avatarPath;
    private UpdateGroupInfoListener listener;


    public interface UpdateGroupInfoListener {
        void onUpdateGroupInfo(ChatRoomUpdateRequest request);
        void onSelectGroupImage();
    }

    public UpdateGroupInfoDialog(Context context, ChatRoomResponse chatRoomResponse, ObservableField<String> avatarPath, UpdateGroupInfoListener listener) {
        super(context);
        this.chatRoomResponse = chatRoomResponse;
        this.avatarPath = avatarPath;
        this.listener = listener;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = DialogUpdateGroupBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        Window window = getWindow();
        if (window != null) {
            window.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            window.setGravity(Gravity.CENTER);
            window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }

        setupViews();

        avatarPath.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                if (!TextUtils.isEmpty(avatarPath.get())) {
                    BindingUtils.setImageUrl(binding.imgGroupAvatar, avatarPath.get());
                }
            }
        });
    }

    private void setupViews() {
        // Set giá trị hiện tại
        if (!TextUtils.isEmpty(chatRoomResponse.getName())) {
            binding.edtGroupName.setText(chatRoomResponse.getName());
        }

        BindingUtils.setImageUrl(binding.imgGroupAvatar, chatRoomResponse.getAvatar());

        binding.switchAllowSendMessages.setChecked(chatRoomResponse.getSettingChat().getMemberPermissions().isAllowSendMessage());
        binding.switchAllowUpdateInfo.setChecked(chatRoomResponse.getSettingChat().getMemberPermissions().isAllowUpdateChatRoom());
        binding.switchAllowAddMembers.setChecked(chatRoomResponse.getSettingChat().getMemberPermissions().isAllowInviteMembers());

        binding.btnClose.setOnClickListener(v -> dismiss());

        binding.imgGroupAvatar.setOnClickListener(v -> {
            if (listener != null) {
                listener.onSelectGroupImage();
            }
        });

        binding.btnCancel.setOnClickListener(v -> dismiss());

        binding.btnUpdate.setOnClickListener(v -> {
            String groupName = binding.edtGroupName.getText().toString().trim();

            if (TextUtils.isEmpty(groupName)) {
                Toasty.error(getContext(), "Vui lòng nhập tên nhóm", Toast.LENGTH_SHORT).show();
                return;
            }

            if (listener != null) {
                ChatRoomUpdateRequest chatRoomUpdateRequest = new ChatRoomUpdateRequest();
                chatRoomUpdateRequest.setId(chatRoomResponse.getId());
                chatRoomUpdateRequest.setName(groupName);
                SettingChat settings = chatRoomResponse.getSettingChat();
                settings.getMemberPermissions().setAllowUpdateChatRoom(binding.switchAllowUpdateInfo.isChecked());
                settings.getMemberPermissions().setAllowSendMessage(binding.switchAllowSendMessages.isChecked());
                settings.getMemberPermissions().setAllowInviteMembers(binding.switchAllowAddMembers.isChecked());
                chatRoomUpdateRequest.setSettings(ApiModelUtils.GSON.toJson(settings));
                listener.onUpdateGroupInfo(chatRoomUpdateRequest);
            }
            dismiss();
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
