package com.finance.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.databinding.ObservableField;
import androidx.fragment.app.DialogFragment;
import com.finance.databinding.DialogDeleteBinding;

import java.util.Objects;

import lombok.Setter;

public class DeleteDialog extends DialogFragment {
    public ObservableField<String> title = new ObservableField<>();

    @Setter
    private DeleteListener listener;
    Dialog dialog;
    public DeleteDialog(String title, DeleteListener listener) {
        this.title.set(title);
        this.listener = listener;
    }

    public interface DeleteListener {
        void confirmDelete();
        void cancelDelete();
    }
    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
        dialog = super.onCreateDialog(savedInstanceState);
        DialogDeleteBinding binding = DialogDeleteBinding.inflate(requireActivity().getLayoutInflater());
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

        return dialog;
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (listener == null) {
            try {
                // Instantiate the mListener so we can send events to the host
                listener = (DeleteListener) context;
            } catch (ClassCastException e) {
                // The activity doesn't implement the interface, throw exception
                throw new ClassCastException(context
                        + " must implement listener");
            }
        }
    }

    public void cancelDelete(){
        listener.cancelDelete();
        dialog.dismiss();
    }

    public void confirmDelete(){
        listener.confirmDelete();
        dialog.dismiss();
    }
}
