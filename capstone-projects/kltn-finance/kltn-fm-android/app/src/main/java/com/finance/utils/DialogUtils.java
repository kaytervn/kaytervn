package com.finance.utils;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;

import com.finance.R;


public class DialogUtils {

    private DialogUtils(){
        //do not init
    }

    public static AlertDialog dialogConfirm(Context context,
                                            String msg,
                                            String btnPositive,
                                            DialogInterface.OnClickListener positive,
                                            String btnNegative,
                                            DialogInterface.OnClickListener negative) {

        AlertDialog dialog = new AlertDialog.Builder(context)
                .setMessage(msg)
                .setPositiveButton(btnPositive, positive)
                .setNegativeButton(btnNegative, negative)
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show();
        TextView message = dialog.findViewById(android.R.id.message);
        if (message != null) {
            message.setTextSize(context.getResources().getDimension(com.intuit.ssp.R.dimen._7ssp));
        }
        Button buttonPositive = dialog.getButton(DialogInterface.BUTTON_POSITIVE);
        if (buttonPositive != null) {
            buttonPositive.setTextSize(context.getResources().getDimension(com.intuit.ssp.R.dimen._6ssp));
        }

        Button buttonN = dialog.getButton(DialogInterface.BUTTON_NEGATIVE);
        if (buttonN != null) {
            buttonN.setTextSize(context.getResources().getDimension(com.intuit.ssp.R.dimen._6ssp));
        }
        return dialog;
    }

    public static Dialog createDialogLoading(Context context, String msg) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);

        android.app.AlertDialog.Builder builder = new android.app.AlertDialog.Builder(context);

        View layout = inflater.inflate(R.layout.layout_progressbar, null);
        if(msg!=null) {
            TextView progressbarMsg = (TextView) layout.findViewById(R.id.progressbar_msg);
            progressbarMsg.setText(msg);
        }

        builder.setCancelable(false); // if you want user to wait for some process to finish,
        builder.setView(layout);
        return builder.create();
    }

    public static Dialog createDialogLoading2(Context context, String msg) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);

        Dialog dialog = new Dialog(context);
        View layout = inflater.inflate(R.layout.layout_progressbar, null);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        params.setMarginStart((int) context.getResources().getDimension(com.intuit.sdp.R.dimen._20sdp));
        params.setMarginEnd((int) context.getResources().getDimension(com.intuit.sdp.R.dimen._20sdp));
        dialog.addContentView(layout, params);
        Window window = dialog.getWindow();
        if (window == null) {
            return null;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));

        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;

        window.setAttributes(windowAttributes);

        TextView progressbarMsg = dialog.findViewById(R.id.progressbar_msg);
        progressbarMsg.setText(msg);

        dialog.setCancelable(false);
        return dialog;
    }
}
