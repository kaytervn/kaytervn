package com.finance.data;


import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.data.prefs.PreferencesService;
import com.finance.data.remote.ApiMediaService;
import com.finance.data.remote.ApiService;

public interface Repository {
    String getToken();
    void setToken(String token);
    AccountResponse getAccount();
    void setAccount(AccountResponse account);
    ApiService getApiService();
    ApiMediaService getApiMediaService();
    PreferencesService getSharedPreferences();
}
