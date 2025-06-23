package com.finance.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

import androidx.recyclerview.widget.LinearLayoutManager;

import com.finance.R;
import com.finance.data.model.api.response.chat.MessageReaction;
import com.finance.data.model.api.response.chat.detail.ChatDetailResponse;
import com.finance.databinding.DialogListReactionBinding;
import com.finance.databinding.DialogMessageOptionBinding;
import com.finance.ui.chat.adapter.UserReactionAdapter;

import java.util.ArrayList;
import java.util.List;

public class ListReactionsDialog extends Dialog {
    DialogListReactionBinding binding;
    private List<MessageReaction> messages;
    UserReactionAdapter userReactionAdapter;

    public ListReactionsDialog(Context context, List<MessageReaction> messages) {
        super(context);
        this.messages = messages;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = DialogListReactionBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        Window window = getWindow();
        if (window != null) {
            window.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            window.setGravity(Gravity.BOTTOM);
            window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }

        setupViews();
    }

    private void setupViews() {
        userReactionAdapter = new UserReactionAdapter(messages.get(0).getAccountReactions());
        binding.setPositionSelected(messages.get(0).getKind());
        binding.listUsers.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.listUsers.setAdapter(userReactionAdapter);
        binding.emojiLike.setVisibility(View.GONE);
        binding.emojiLove.setVisibility(View.GONE);
        binding.emojiCry.setVisibility(View.GONE);
        binding.emojiHappy.setVisibility(View.GONE);
        binding.emojiSmile.setVisibility(View.GONE);

        for (MessageReaction reaction : messages) {
            switch (reaction.getKind()) {
                case 1:
                    binding.emojiLike.setVisibility(View.VISIBLE);
                    break;
                case 2:
                    binding.emojiLove.setVisibility(View.VISIBLE);
                    break;
                case 3:
                    binding.emojiCry.setVisibility(View.VISIBLE);
                    break;
                case 4:
                    binding.emojiHappy.setVisibility(View.VISIBLE);
                    break;
                case 5:
                    binding.emojiSmile.setVisibility(View.VISIBLE);
                    break;
            }
        }

        binding.emojiLike.setOnClickListener(v -> {
            binding.setPositionSelected(1);
            setAccountReactionsByKind(1);
        });
        binding.emojiLove.setOnClickListener(v -> {
            binding.setPositionSelected(2);
            setAccountReactionsByKind(2);
        });
        binding.emojiCry.setOnClickListener(v -> {
            binding.setPositionSelected(3);
            setAccountReactionsByKind(3);
        });
        binding.emojiHappy.setOnClickListener(v -> {
            binding.setPositionSelected(4);
            setAccountReactionsByKind(4);
        });
        binding.emojiSmile.setOnClickListener(v -> {
            binding.setPositionSelected(5);
            setAccountReactionsByKind(5);
        });
    }

    public void setAccountReactionsByKind (int kind) {
        MessageReaction currentReason = new MessageReaction();
        for (MessageReaction reaction : messages) {
            if (reaction.getKind() == kind) {
                currentReason = reaction;
                break;
            }
        }
        userReactionAdapter.updateUsers(currentReason.getAccountReactions());
    }
}

