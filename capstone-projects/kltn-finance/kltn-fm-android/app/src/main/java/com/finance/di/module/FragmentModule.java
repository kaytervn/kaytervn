package com.finance.di.module;


import android.content.Context;


import androidx.core.util.Supplier;
import androidx.lifecycle.ViewModelProvider;
import com.finance.MVVMApplication;
import com.finance.ViewModelProviderFactory;
import com.finance.data.Repository;
import com.finance.di.scope.FragmentScope;
import com.finance.ui.base.BaseFragment;
import com.finance.ui.fragment.account.AccountFragmentViewModel;
import com.finance.ui.fragment.key.KeyFragmentViewModel;
import com.finance.ui.fragment.home.HomeFragmentViewModel;
import com.finance.ui.fragment.project.ProjectFragmentViewModel;
import com.finance.ui.fragment.task.TaskFragmentViewModel;
import com.finance.ui.fragment.statistics.StatisticsFragmentViewModel;

import javax.inject.Named;

import dagger.Module;
import dagger.Provides;

@Module
public class FragmentModule {
    private final BaseFragment<?, ?> fragment;
    public FragmentModule(BaseFragment<?, ?> fragment) {
        this.fragment = fragment;
    }
    @Named("access_token")
    @Provides
    @FragmentScope
    String provideToken(Repository repository){
        return repository.getToken();
    }

    @Provides
    @FragmentScope
    HomeFragmentViewModel provideHomeFragmentViewModel(Repository repository, Context application) {
        Supplier<HomeFragmentViewModel> supplier = () -> new HomeFragmentViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<HomeFragmentViewModel> factory = new ViewModelProviderFactory<>(HomeFragmentViewModel.class, supplier);
        return new ViewModelProvider(fragment, factory).get(HomeFragmentViewModel.class);
    }
    @Provides
    @FragmentScope
    StatisticsFragmentViewModel provideActivityFragmentViewModel(Repository repository, Context application) {
        Supplier<StatisticsFragmentViewModel> supplier = () -> new StatisticsFragmentViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<StatisticsFragmentViewModel> factory = new ViewModelProviderFactory<>(StatisticsFragmentViewModel.class, supplier);
        return new ViewModelProvider(fragment, factory).get(StatisticsFragmentViewModel.class);
    }

    @Provides
    @FragmentScope
    KeyFragmentViewModel provideFavouriteFragmentViewModel(Repository repository, Context application) {
        Supplier<KeyFragmentViewModel> supplier = () -> new KeyFragmentViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<KeyFragmentViewModel> factory = new ViewModelProviderFactory<>(KeyFragmentViewModel.class, supplier);
        return new ViewModelProvider(fragment, factory).get(KeyFragmentViewModel.class);
    }

    @Provides
    @FragmentScope
    AccountFragmentViewModel provideAccountFragmentViewModel(Repository repository, Context application) {
        Supplier<AccountFragmentViewModel> supplier = () -> new AccountFragmentViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<AccountFragmentViewModel> factory = new ViewModelProviderFactory<>(AccountFragmentViewModel.class, supplier);
        return new ViewModelProvider(fragment, factory).get(AccountFragmentViewModel.class);
    }

    @Provides
    @FragmentScope
    TaskFragmentViewModel provideTaskFragmentViewModel(Repository repository, Context application) {
        Supplier<TaskFragmentViewModel> supplier = () -> new TaskFragmentViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<TaskFragmentViewModel> factory = new ViewModelProviderFactory<>(TaskFragmentViewModel.class, supplier);
        return new ViewModelProvider(fragment, factory).get(TaskFragmentViewModel.class);
    }
    @Provides
    @FragmentScope
    ProjectFragmentViewModel provideProjectFragmentViewModel(Repository repository, Context application) {
        Supplier<ProjectFragmentViewModel> supplier = () -> new ProjectFragmentViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ProjectFragmentViewModel> factory = new ViewModelProviderFactory<>(ProjectFragmentViewModel.class, supplier);
        return new ViewModelProvider(fragment, factory).get(ProjectFragmentViewModel.class);
    }


}
