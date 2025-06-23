package com.finance.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

import com.finance.databinding.DialogConfirmBinding;

import java.util.Objects;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ConfirmDialog extends DialogFragment implements View.OnClickListener{

    private String title;
    Dialog dialog;

    private ConfirmDialogListener listener;
    public interface ConfirmDialogListener{
        void confirm();
    }

    @Override
    public void onClick(View view) {
//        listener.onCLick();
    }


    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
        dialog = super.onCreateDialog(savedInstanceState);
        DialogConfirmBinding binding = DialogConfirmBinding.inflate(requireActivity().getLayoutInflater());
        binding.setDialog(this);
        binding.setTitle(title);
        binding.executePendingBindings();
        binding.btnCancel.setOnClickListener(view -> dialog.dismiss());
        binding.btnConfirm.setOnClickListener(view -> listener.confirm());
        dialog.setContentView(binding.getRoot());
        Objects.requireNonNull(dialog.getWindow()).setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().setLayout(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);

        dialog.setCanceledOnTouchOutside(true);

        return dialog;
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (listener == null) {
            try {
                // Instantiate the mListener so we can send events to the host
                listener = (ConfirmDialogListener) context;
            } catch (ClassCastException e) {
                // The activity doesn't implement the interface, throw exception
                throw new ClassCastException(context
                        + " must implement listener");
            }
        }

    }
}
