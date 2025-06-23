package com.finance.data.model.other;

import android.content.Context;

import es.dmoral.toasty.Toasty;
import lombok.Data;

@Data
public class ToastMessage {
    public static final int TYPE_NORMAL = 0;
    public static final int TYPE_SUCCESS = 1;
    public static final int TYPE_ERROR = 2;
    public static final int TYPE_WARNING = 3;

    private int type;
    private String message;

    public ToastMessage(int type, String message) {
        this.type = type;
        this.message = message;
    }

    public void showMessage(Context context){
        switch (type){
            case TYPE_NORMAL:
                Toasty.normal(context, message).show();
                break;
            case TYPE_SUCCESS:
                Toasty.success(context, message).show();
                break;
            case TYPE_WARNING:
                Toasty.warning(context,message).show();
                break;
            case TYPE_ERROR:
                Toasty.error(context,message).show();
                break;
            default:
                break;
        }
    }



}
