package com.finance.data.prefs;

import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.data.model.api.response.account.Permission;

import java.util.List;

public interface PreferencesService {
    String KEY_BEARER_TOKEN="KEY_BEARER_TOKEN";
    String KEY_TENANT_NAME="KEY_TENANT_NAME";
    String ACCOUNT="ACCOUNT";

    String getToken();
    void setToken(String token);
    void removeKey(String key);
    void setAccount(AccountResponse accountResponse);
    AccountResponse getAccount();
    void setTenantName(String tenantName);
    String getTenantName();
}
