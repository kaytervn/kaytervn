package com.finance.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;

import com.finance.R;
import com.finance.data.SecretKey;
import com.finance.data.model.api.response.chat.detail.ChatDetailResponse;
import com.finance.utils.AESUtils;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

public class EditMessageDialog extends Dialog {
    private ChatDetailResponse message;
    private int position;
    private OnEditMessageListener listener;
    private EditText editMessageContent;

    public interface OnEditMessageListener {
        void onMessageEdited(String newContent, ChatDetailResponse message, int position);
        void onMessageUploaded(ChatDetailResponse message, int position);
    }

    public EditMessageDialog(Context context, ChatDetailResponse message, int position, OnEditMessageListener listener) {
        super(context);
        this.message = message;
        this.position = position;
        this.listener = listener;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dialog_edit_message);

        setupWindow();
        setupViews();
    }

    private void setupWindow() {
        Window window = getWindow();
        if (window != null) {
            window.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            window.setGravity(Gravity.CENTER);
            window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            // Animation
            window.getAttributes().windowAnimations = R.style.DialogAnimation;
        }
    }

    private void setupViews() {
        editMessageContent = findViewById(R.id.edit_message_content);
        Button btnCancel = findViewById(R.id.btn_cancel);
        Button btnSave = findViewById(R.id.btn_save_edit);

        // Set current message content
        String currentContent =  message.getContent();
        editMessageContent.setText(currentContent);
        editMessageContent.setSelection(currentContent.length());

        btnCancel.setOnClickListener(v -> dismiss());

        btnSave.setOnClickListener(v -> {
            String newContent = editMessageContent.getText().toString().trim();
            if (!newContent.isEmpty()) {
                if (listener != null) {
                    listener.onMessageEdited(newContent, message, position);
                }
                dismiss();
            } else {
                editMessageContent.setError("Nội dung không được để trống");
            }
        });
    }
}
