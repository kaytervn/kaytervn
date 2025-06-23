package com.finance.di.module;

import android.app.Application;
import android.content.Context;

import com.finance.BuildConfig;
import com.finance.constant.Constants;
import com.finance.data.AppRepository;
import com.finance.data.Repository;
import com.finance.data.prefs.AppPreferencesService;
import com.finance.data.prefs.PreferencesService;
import com.finance.data.remote.ApiMediaService;
import com.finance.data.remote.ApiService;
import com.finance.data.remote.AuthInterceptor;
import com.finance.di.qualifier.ApiInfo;
import com.finance.di.qualifier.PreferenceInfo;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.concurrent.TimeUnit;

import javax.inject.Named;
import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;
import hu.akarnokd.rxjava3.retrofit.RxJava3CallAdapterFactory;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

@Module
public class AppModule {
    @Provides
    @Singleton
    Context provideContext(Application application) {
        return application;
    }
    @Provides
    @Singleton
    Gson provideGson() {
        return new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
    }


    @Provides
    @PreferenceInfo
    @Singleton
    String providePreferenceName() {
        return Constants.PREF_NAME;
    }

    @Provides
    @Singleton
    PreferencesService providePreferencesService(AppPreferencesService appPreferencesService) {
        return appPreferencesService;
    }

    @Provides
    @Singleton
    public Repository provideDataManager(AppRepository appRepository) {
        return appRepository;
    }


    @Provides
    @Singleton
    AuthInterceptor proviceAuthInterceptor(PreferencesService appPreferencesService, Application application){
        return new AuthInterceptor(appPreferencesService, application);
    }

    @Provides
    @Singleton
    public OkHttpClient getClient(AuthInterceptor authInterceptor) {
        HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
        if (BuildConfig.DEBUG) {
            loggingInterceptor.level(HttpLoggingInterceptor.Level.BODY);
        } else {
            loggingInterceptor.level(HttpLoggingInterceptor.Level.NONE);
        }
        return new OkHttpClient.Builder()
                .addInterceptor(loggingInterceptor)
                .addInterceptor(authInterceptor)
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)

                .build();
    }

    @Provides
    @ApiInfo
    @Singleton
    String provideBaseUrl() {
        return BuildConfig.TENANT_URL;
    }

    @Provides
    @Named("media")
    @Singleton
    String provideMediaUrl() {
        return BuildConfig.MEDIA_URL;
    }

    @Provides
    @Named("retrofitMedia")
    @Singleton
    public Retrofit retrofitMediaBuild(OkHttpClient client, @Named("media") String masterUrl) {
        return new Retrofit.Builder()
                .client(client)
                .baseUrl(masterUrl)
                .addConverterFactory(GsonConverterFactory.create())
                .addCallAdapterFactory(RxJava3CallAdapterFactory.create())
                .build();
    }
    @Provides
    @Singleton
    public Retrofit retrofitBuild(OkHttpClient client, @ApiInfo String url) {
        return new Retrofit.Builder()
                .client(client)
                .baseUrl(url)
                .addConverterFactory(GsonConverterFactory.create())
                .addCallAdapterFactory(RxJava3CallAdapterFactory.create())
                .build();
    }

    @Provides
    @Singleton
    public ApiService apiService(Retrofit retrofit) {
        return retrofit.create(ApiService.class);
    }

    @Provides
    @Singleton
    public ApiMediaService apiMasterService(@Named("retrofitMedia") Retrofit retrofit) {
        return retrofit.create(ApiMediaService.class);
    }


}
