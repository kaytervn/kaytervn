package com.finance.di.component;


import android.app.Application;
import android.content.Context;

import com.finance.MVVMApplication;
import com.finance.data.Repository;
import com.finance.di.module.AppModule;

import javax.inject.Singleton;

import dagger.BindsInstance;
import dagger.Component;

@Singleton
@Component(modules = {AppModule.class})
public interface AppComponent {
    void inject(MVVMApplication app);
    Repository getRepository();
    Context getContext();
    @Component.Builder
    interface Builder {
        @BindsInstance
        Builder application(Application application);
        AppComponent build();
    }
}
