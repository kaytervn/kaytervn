package com.finance.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.text.method.PasswordTransformationMethod;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.databinding.Observable;
import androidx.databinding.ObservableField;
import androidx.fragment.app.DialogFragment;

import com.finance.databinding.DialogRequestKeyBinding;

import java.util.Objects;

import lombok.Setter;

public class DownLoadDialog extends DialogFragment {

    public ObservableField<Boolean> isShowPassword = new ObservableField<>(false);
    public ObservableField<String> password = new ObservableField<>();

    @Setter
    private Listener listener;
    Dialog dialog;
    public DownLoadDialog(){
    }

    public interface Listener{
        void confirm();
        void cancel();
    }
    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
        dialog = super.onCreateDialog(savedInstanceState);
        DialogRequestKeyBinding binding = DialogRequestKeyBinding.inflate(requireActivity().getLayoutInflater());
       // Create layout parameters with margin
        ConstraintLayout.LayoutParams params = new ConstraintLayout.LayoutParams(
                ConstraintLayout.LayoutParams.MATCH_PARENT,
                ConstraintLayout.LayoutParams.WRAP_CONTENT
        );
        params.setMarginStart((int) getResources().getDimension(com.intuit.sdp.R.dimen._12sdp));
        params.setMarginEnd((int) getResources().getDimension(com.intuit.sdp.R.dimen._12sdp));
        // Set the layout parameters to the root view

        // Set the content view
        dialog.setContentView(binding.getRoot(), params);
        Objects.requireNonNull(dialog.getWindow()).setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().setLayout(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        dialog.setCanceledOnTouchOutside(true);
        binding.setDialog(this);
        binding.executePendingBindings();

        isShowPassword.addOnPropertyChangedCallback(new Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(Observable sender, int propertyId) {
                int pos = binding.editPassword.getSelectionStart();
                if(Boolean.FALSE.equals(isShowPassword.get())){
                    binding.editPassword.setTransformationMethod(PasswordTransformationMethod.getInstance());
                }else {
                    binding.editPassword.setTransformationMethod(null);
                }
                binding.editPassword.setSelection(pos);
            }
        });

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
        dialog.dismiss();
        listener.cancel();
    }

    public void isShowPassword () {
        isShowPassword.set(Boolean.FALSE.equals(isShowPassword.get()));

    }

    public void confirm(){
        listener.confirm();
    }
}
