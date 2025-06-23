package com.finance.di.component;


import com.finance.di.module.FragmentModule;
import com.finance.di.scope.FragmentScope;
import com.finance.ui.fragment.account.AccountFragment;
import com.finance.ui.fragment.key.KeyFragment;
import com.finance.ui.fragment.home.HomeFragment;
import com.finance.ui.fragment.project.ProjectFragment;
import com.finance.ui.fragment.task.TaskFragment;
import com.finance.ui.fragment.statistics.StatisticsFragment;

import dagger.Component;

@FragmentScope
@Component(modules = {FragmentModule.class}, dependencies = AppComponent.class)
public interface FragmentComponent {
    void inject(AccountFragment accountFragment);
    void inject(HomeFragment homeFragment);
    void inject(StatisticsFragment activityFragment);
    void inject(KeyFragment favouriteFragment);
    void inject(TaskFragment fragment);
    void inject(ProjectFragment fragment);
}