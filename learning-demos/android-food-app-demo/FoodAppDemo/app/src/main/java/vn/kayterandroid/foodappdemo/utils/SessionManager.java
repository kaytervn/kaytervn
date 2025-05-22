package vn.kayterandroid.foodappdemo.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {
    private static final String PREF_NAME = "LoginPreference";
    private static final String KEY_ID = "id";
    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;
    private static SessionManager instance;

    private SessionManager(Context context) {
        sharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = sharedPreferences.edit();
    }

    public static synchronized SessionManager getInstance(Context context) {
        if (instance == null) {
            instance = new SessionManager(context.getApplicationContext());
        }
        return instance;
    }

    public void saveLoginUser(String id) {
        editor.putString(KEY_ID, id);
        editor.apply();
    }

    public String getId() {
        return sharedPreferences.getString(KEY_ID, "");
    }

    public void clearLoginUser() {
        editor.remove(KEY_ID);
        editor.apply();
    }
}