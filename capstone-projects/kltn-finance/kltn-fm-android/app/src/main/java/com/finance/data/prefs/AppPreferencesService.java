package com.finance.data.prefs;

import android.content.Context;
import android.content.SharedPreferences;

import com.finance.constant.Constants;
import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.data.model.api.response.account.Permission;
import com.finance.di.qualifier.PreferenceInfo;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

import javax.inject.Inject;

public class AppPreferencesService implements PreferencesService {

    private final SharedPreferences mPrefs;

    @Inject
    public AppPreferencesService(Context context, @PreferenceInfo String prefFileName, Gson gson) {
        mPrefs = context.getSharedPreferences(prefFileName, Context.MODE_PRIVATE);
    }

    @Override
    public String getToken() {
        return mPrefs.getString(KEY_BEARER_TOKEN, Constants.VALUE_BEARER_TOKEN_DEFAULT);
    }

    @Override
    public void setToken(String token) {
        mPrefs.edit().putString(KEY_BEARER_TOKEN, token).apply();
    }

    @Override
    public void removeKey(String key) {
        mPrefs.edit().remove(key).apply();
    }

    @Override
    public void setAccount(AccountResponse accountResponse) {
        mPrefs.edit().putString(ACCOUNT, ApiModelUtils.GSON.toJson(accountResponse)).apply();
    }

    @Override
    public AccountResponse getAccount() {
        Gson gson = new Gson();
        String json = mPrefs.getString(ACCOUNT, Constants.VALUE_ACCOUNT_DEFAULT);
        assert json != null;
        if (json.equals(Constants.VALUE_ACCOUNT_DEFAULT)) {
            return Constants.VALUE_ACCOUNT_RESPONSE_DEFAULT;
        }
        Type type = new TypeToken<AccountResponse>() {}.getType();
        return gson.fromJson(json, type);
    }

    @Override
    public void setTenantName(String tenantName) {
        mPrefs.edit().putString(KEY_TENANT_NAME, tenantName).apply();
    }

    @Override
    public String getTenantName() {
        return mPrefs.getString(KEY_TENANT_NAME, "");
    }
}
