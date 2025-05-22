package android.onlinecoursesapp.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {
    private static final String PREF_NAME = "LoginPreference";
    private static final String KEY_TOKEN = "token";
    private static final String KEY_CART_ID = "cartId";
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

    public void saveLoginUser(String token, String cardId) {
        editor.putString(KEY_TOKEN, token);
        editor.putString(KEY_CART_ID, cardId);
        editor.apply();
    }

    public String getKeyToken() {
        return sharedPreferences.getString(KEY_TOKEN, "");
    }

    public String getKeyCartId() {
        return sharedPreferences.getString(KEY_CART_ID, "");
    }

    public void clearLoginUser() {
        editor.remove(KEY_TOKEN);
        editor.remove(KEY_CART_ID);
        editor.apply();
    }
}