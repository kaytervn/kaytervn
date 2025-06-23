package com.finance.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.ObservableField;
import androidx.fragment.app.DialogFragment;

import com.finance.R;
import com.finance.databinding.DialogInputKeyBinding;

import java.util.Objects;

import lombok.Getter;
import lombok.Setter;

public class InputKeyDialog extends DialogFragment implements View.OnClickListener {

    @Getter
    @Setter
    private Dialog dialog;
    public ObservableField<String> privateKey = new ObservableField<>();
    public ObservableField<String> secretKey = new ObservableField<>();
    @Setter
    private InputKeyListener listener = null;
    public interface InputKeyListener{
        void confirm(String privateKey, String secretKey);
        void cancel();
    }

    @Override
    public void onClick(View view) {
        if (view.getId() == R.id.btnPassConfirm) {
            listener.confirm(privateKey.get(), secretKey.get());
        }
    }

    public InputKeyDialog(){}

    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
        dialog = super.onCreateDialog(savedInstanceState);
        DialogInputKeyBinding binding = DialogInputKeyBinding.inflate(requireActivity().getLayoutInflater());
        dialog.setContentView(binding.getRoot());
        Objects.requireNonNull(dialog.getWindow()).setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().setLayout(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        dialog.getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
//        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);

        binding.setKey(this);
        binding.executePendingBindings();

        dialog.setCanceledOnTouchOutside(false);
        return dialog;
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (listener == null) {
            try {
                // Instantiate the mListener so we can send events to the host
                listener = (InputKeyListener) context;
            } catch (ClassCastException e) {
                // The activity doesn't implement the interface, throw exception
                throw new ClassCastException(getActivity()
                        + " must implement InputKeyListener");
            }
        }

    }


    public void confirmInputKey(){
        listener.confirm(privateKey.get(), secretKey.get());
    }
    public void cancelInputKey(){
        dialog.dismiss();
        listener.cancel();
    }

    private void hideKeyboard() {
        InputMethodManager imm = (InputMethodManager) requireActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm != null && requireActivity().getCurrentFocus() != null) {
            imm.hideSoftInputFromWindow(Objects.requireNonNull(requireActivity().getCurrentFocus()).getWindowToken(), 0);
        }
    }

    @Override
    public void onDismiss(@NonNull DialogInterface dialog) {
        super.onDismiss(dialog);
        hideKeyboard();
    }
}
