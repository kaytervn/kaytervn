package com.finance.data.remote;

import android.app.Application;
import android.content.Intent;
import android.util.Base64;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.finance.constant.Constants;
import com.finance.data.prefs.PreferencesService;
import com.finance.utils.LogService;

import org.jetbrains.annotations.NotNull;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
import timber.log.Timber;

public class AuthInterceptor implements Interceptor {

    private final PreferencesService appPreferences;
    private final Application application;

    public AuthInterceptor(PreferencesService appPreferences, Application application) {
        this.appPreferences = appPreferences;
        this.application = application;
    }

    @NotNull
    @Override
    public Response intercept(@NotNull Interceptor.Chain chain) throws IOException {

        chain.request().newBuilder();
        Request.Builder newRequest;

        String tenantName = appPreferences.getTenantName();
        boolean isHaveTenant = tenantName != null && !tenantName.isEmpty() && !tenantName.equals("NULL");


        String isIgnore = chain.request().header("IgnoreAuth");
        if (isIgnore != null && isIgnore.equals("1")) {
            newRequest = chain.request().newBuilder();
            newRequest.removeHeader("IgnoreAuth");
            if (isHaveTenant) {
                newRequest.addHeader("X-tenant", tenantName);
            }
            return chain.proceed(newRequest.build());
        }

        String isBasic = chain.request().header("BasicAuth");
        if (isBasic != null && isBasic.equals("1")) {
            String username = "abc_client";
            String password = "abc123";
            String base = username + ":" + password;
            newRequest = chain.request().newBuilder();
            newRequest.removeHeader("BasicAuth");
            newRequest.addHeader("Authorization", "Basic " + Base64.encodeToString(base.getBytes(), Base64.NO_WRAP));
            if (isHaveTenant) {
                newRequest.addHeader("X-tenant", tenantName);
            }
            return chain.proceed(newRequest.build());
        }
        newRequest = chain.request().newBuilder();
        String token = appPreferences.getToken();
        Timber.d(token);
        if (token !=null && !token.isEmpty()){
            newRequest.addHeader("Authorization", "Bearer " + token);
        }

        if (isHaveTenant) {
            newRequest.addHeader("X-tenant", tenantName);
        }

        Response origResponse = chain.proceed(newRequest.build());
        if (origResponse.code() == 403 || origResponse.code() == 401) {
            LogService.i("Error http =====================> code: "+origResponse.code());
//            appPreferences.removeKey(PreferencesService.KEY_BEARER_TOKEN);
            Intent intent = new Intent();
            intent.setAction(Constants.ACTION_EXPIRED_TOKEN);
            LocalBroadcastManager.getInstance(application.getApplicationContext()).sendBroadcast(intent);
        }

        return origResponse;
    }
}
