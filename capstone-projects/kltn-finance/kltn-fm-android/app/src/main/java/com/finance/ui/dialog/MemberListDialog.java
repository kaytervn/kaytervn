package com.finance.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.Window;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.R;
import com.finance.data.model.api.response.chat.AutoCompleteAccountResponse;
import com.finance.data.model.api.response.chat.ChatRoomMemberResponse;
import com.finance.databinding.DialogMemberListBinding;
import com.finance.ui.chat.adapter.MemberListAdapter;

import java.util.ArrayList;
import java.util.List;

public class MemberListDialog extends Dialog implements MemberListAdapter.OnMemberActionListener {
    private MemberListAdapter adapter;
    private List<ChatRoomMemberResponse> members;
    private OnDialogActionListener dialogListener;
    DialogMemberListBinding binding;
    private Boolean isOwner = false;

    @Override
    public void onDeleteMember(Long id) {
        dialogListener.onMemberDeleted(id);
    }

    public interface OnDialogActionListener {
        void onAddMemberClicked();
        void onMemberDeleted(Long id);
    }

    public MemberListDialog(@NonNull Context context, List<ChatRoomMemberResponse> members, boolean isOwner, OnDialogActionListener dialogListener) {
        super(context, R.style.CustomDialogTheme);
        this.members = members != null ? members : new ArrayList<>();
        this.isOwner = isOwner;
        this.dialogListener = dialogListener;
    }

    public void setDialogActionListener(OnDialogActionListener listener) {
        this.dialogListener = listener;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        binding = DialogMemberListBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        setupRecyclerView();
        setupClickListeners();
    }


    private void setupRecyclerView() {
        adapter = new MemberListAdapter(members, isOwner, this);
        binding.rvMembers.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.rvMembers.setAdapter(adapter);
    }

    private void setupClickListeners() {
        binding.btnAddMember.setOnClickListener(v -> {
            if (dialogListener != null) {
                dialogListener.onAddMemberClicked();
            }
        });
        binding.tvClose.setOnClickListener(v -> dismiss());
    }

    public void addMember(ChatRoomMemberResponse member) {
        if (member != null && !members.contains(member)) {
            members.add(member);
            adapter.notifyDataSetChanged();
        }
    }
}
