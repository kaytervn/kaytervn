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

import com.finance.R;
import com.finance.data.model.api.response.chat.MessageReaction;
import com.finance.data.model.api.response.chat.detail.ChatDetailResponse;
import com.finance.databinding.DialogMessageOptionBinding;

public class MessageOptionsDialog extends Dialog {
    DialogMessageOptionBinding binding;
    private ChatDetailResponse message;
    private int position;
    private MessageOptionsListener listener;
    public interface MessageOptionsListener {
        void onEmojiSelected(String emoji, ChatDetailResponse message, int position);
        void onEditMessage(ChatDetailResponse message, int position);
        void onRecallMessage(ChatDetailResponse message, int position);
    }

    public MessageOptionsDialog(Context context, ChatDetailResponse message, int position, MessageOptionsListener listener) {
        super(context);
        this.message = message;
        this.position = position;
        this.listener = listener;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = DialogMessageOptionBinding.inflate(getLayoutInflater());
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

        if (message != null && !message.getIsSender()) {
            binding.optionEdit.setVisibility(View.GONE);
            binding.optionRecall.setVisibility(View.GONE);
            binding.dividerEdit.setVisibility(View.GONE);
            binding.dividerRecall.setVisibility(View.GONE);
        }

        // Xử lý click emoji
        binding.emojiLike.setOnClickListener(v -> {
            if (listener != null) listener.onEmojiSelected(MessageReaction.EMOJI_KIND_1, message, position);
            dismiss();
        });

        binding.emojiLove.setOnClickListener(v -> {
            if (listener != null) listener.onEmojiSelected(MessageReaction.EMOJI_KIND_2, message, position);
            dismiss();
        });

        binding.emojiCry.setOnClickListener(v -> {
            if (listener != null) listener.onEmojiSelected(MessageReaction.EMOJI_KIND_3, message, position);
            dismiss();
        });

        binding.emojiHappy.setOnClickListener(v -> {
            if (listener != null) listener.onEmojiSelected(MessageReaction.EMOJI_KIND_4, message, position);
            dismiss();
        });

        binding.emojiSmile.setOnClickListener(v -> {
            if (listener != null) listener.onEmojiSelected(MessageReaction.EMOJI_KIND_5, message, position);
            dismiss();
        });

        // Xử lý click chỉnh sửa
        findViewById(R.id.option_edit).setOnClickListener(v -> {
            if (listener != null) listener.onEditMessage(message, position);
            dismiss();
        });

        // Xử lý click thu hồi
        findViewById(R.id.option_recall).setOnClickListener(v -> {
            if (listener != null) listener.onRecallMessage(message, position);
            dismiss();
        });
    }
}
