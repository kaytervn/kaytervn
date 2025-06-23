package com.finance.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

import com.finance.databinding.DialogYesNoBinding;

import java.util.Objects;

import lombok.Getter;
import lombok.Setter;

public class YesNoDialog extends DialogFragment {
    @Getter
    @Setter
    private String title;
    @Getter
    @Setter
    private String textCancel;
    @Getter
    @Setter
    private String textConfirm;
    @Setter
    private Listener listener;
    Dialog dialog;
    public YesNoDialog(String title, String textCancel, String textConfirm){
        this.title = title;
        this.textCancel = textCancel;
        this.textConfirm = textConfirm;
    }
    public YesNoDialog(String title, String textCancel, String textConfirm, Listener listener){
        this.title = title;
        this.textCancel = textCancel;
        this.textConfirm = textConfirm;
        this.listener = listener;
    }

    public interface Listener{
        void confirmYN();
        void cancelYN();
    }
    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
        dialog = super.onCreateDialog(savedInstanceState);
        DialogYesNoBinding binding = DialogYesNoBinding.inflate(requireActivity().getLayoutInflater());
        dialog.setContentView(binding.getRoot());
        Objects.requireNonNull(dialog.getWindow()).setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().setLayout(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        dialog.setCanceledOnTouchOutside(true);
        binding.setDialog(this);
        binding.executePendingBindings();
        return dialog;
    }

    @Override
    public void onAttach(@NonNull Context context) {

        super.onAttach(context);
        if (listener == null) {
            try {
                // Instantiate the mListener so we can send events to the host
                listener = (Listener) context;
            } catch (ClassCastException e) {
                // The activity doesn't implement the interface, throw exception
                throw new ClassCastException(context
                        + " must implement listener");
            }
        }

    }

    public void cancel(){
        listener.cancelYN();
        dialog.dismiss();
    }

    public void confirm(){
        listener.confirmYN();
        dialog.dismiss();
    }
}
