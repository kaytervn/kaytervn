package com.example.bt_tuan09;

import android.content.Context;
import android.view.PixelCopy;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

public class VolleySingle {
    private static VolleySingle mInstance;
    private RequestQueue mRequestQueue;
    private static Context mCtx;

    private VolleySingle(Context context){
        mCtx = context;
        mRequestQueue = getRequestQueue();
    }
    public static synchronized VolleySingle getInstance(Context context){
        if(mInstance == null){
            mInstance = new VolleySingle(context);
        }
        return mInstance;
    }

    public RequestQueue getRequestQueue() {
        if(mRequestQueue == null){
            mRequestQueue = Volley.newRequestQueue(mCtx.getApplicationContext());
        }
        return mRequestQueue;
    }
    public <T> void addToRequestQueue(Request<T> req){
        getRequestQueue().add(req);
    }
}
