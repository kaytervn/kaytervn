package com.finance.ui.main;

import android.app.Dialog;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.databinding.ActivityMainBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.fragment.account.AccountFragment;
import com.finance.ui.fragment.home.HomeFragment;
import com.finance.ui.fragment.key.KeyFragment;
import com.finance.ui.fragment.project.ProjectFragment;
import com.finance.ui.fragment.statistics.StatisticsFragment;

import lombok.NonNull;

public class MainActivity extends BaseActivity<ActivityMainBinding, MainViewModel>
{
    public Fragment activeFragment = new Fragment();
    private AccountFragment accountFragment;
    private StatisticsFragment statisticFragment;
    private KeyFragment keyFragment;
    private HomeFragment homeFragment;
    private ProjectFragment projectFragment;

    @Override
    public int getLayoutId() {
        return R.layout.activity_main;
    }

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    public void performDependencyInjection(ActivityComponent buildComponent) {
        buildComponent.inject(this);
    }
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        handleNavigationItemSelected(viewBinding.bottomNavigation.getMenu().getItem(0));
        viewBinding.bottomNavigation.setOnNavigationItemSelectedListener(item -> {
            handleNavigationItemSelected(item);
            return true;
        });


        viewModel.validKey.observe(this, valid->{
            if(!valid){
                showInputKey();
            }else {
                if(activeFragment == homeFragment){
                    homeFragment.checkSecretKey();
                }else if(activeFragment == keyFragment){
                    keyFragment.checkSecretKey();
                }else if(activeFragment == statisticFragment){
                    statisticFragment.checkSecretKey();
                } else if(activeFragment == projectFragment) {
                    projectFragment.checkSecretKey();
                }
            }
        });
    }



    public void handleNavigationItemSelected(@NonNull MenuItem item){
        if (item.getItemId() == R.id.menu_home){
            switchToHomeFragment();
        }
        else if (item.getItemId() == R.id.menu_activity){
            switchToStatisticFragment();
        }
        else if (item.getItemId() == R.id.menu_favourite){
            switchToKeyFragment();
        }
        else if (item.getItemId() == R.id.menu_account){
            switchToAccountFragment();
        }else if (item.getItemId() == R.id.menu_notification){
            switchToProjectFragment();
        }
    }



    private void switchToAccountFragment() {
        if (accountFragment == null){
            accountFragment = new AccountFragment();
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.add(R.id.main_fragment, accountFragment, Constants.ACCOUNT_FRAGMENT).hide(activeFragment).commit();
        }
        else{
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.hide(activeFragment).show(accountFragment).commit();
        }
        activeFragment = accountFragment;
    }

    private void switchToKeyFragment() {
        if (keyFragment == null){
            keyFragment = new KeyFragment();
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.add(R.id.main_fragment, keyFragment, Constants.KEY_FRAGMENT).hide(activeFragment).commit();
        }
        else{
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.hide(activeFragment).show(keyFragment).commit();
            keyFragment.checkSecretKey();
        }
        showEnterKey();
        activeFragment = keyFragment;
    }

    private void switchToStatisticFragment() {
        if (statisticFragment == null){
            statisticFragment = new StatisticsFragment();
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.add(R.id.main_fragment, statisticFragment, Constants.STATISTIC_FRAGMENT).hide(activeFragment).commit();
        }
        else{
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.hide(activeFragment).show(statisticFragment).commit();
            statisticFragment.checkSecretKey();
        }
        showEnterKey();
        activeFragment = statisticFragment;
    }
    private void switchToProjectFragment() {
        if (projectFragment == null){
            projectFragment = new ProjectFragment();
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.add(R.id.main_fragment, projectFragment, Constants.PROJECT_FRAGMENT ).hide(activeFragment).commit();
        }
        else{
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.hide(activeFragment).show(projectFragment).commit();
            projectFragment.checkSecretKey();
        }
        showEnterKey();
        activeFragment = projectFragment;
    }
    private void switchToHomeFragment() {
        if (homeFragment == null){
            homeFragment = new HomeFragment();
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.add(R.id.main_fragment, homeFragment, Constants.HOME_FRAGMENT).hide(activeFragment).commit();
        }
        else{
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.hide(activeFragment).show(homeFragment).commit();
            showEnterKey();
            homeFragment.checkSecretKey();
        }
        activeFragment = homeFragment;
    }

    @Override
    public void onBackPressed() {
        Fragment transactionFragment = getSupportFragmentManager().findFragmentByTag(Constants.HOME_FRAGMENT);
        if (transactionFragment != null && transactionFragment.isVisible() && transactionFragment instanceof HomeFragment) {
            if (((HomeFragment) transactionFragment).onBackPressed()){
                return;
            }
        }
        Fragment keyFragment = getSupportFragmentManager().findFragmentByTag(Constants.KEY_FRAGMENT);
        if (keyFragment != null && keyFragment.isVisible() && keyFragment instanceof KeyFragment) {
            if (((KeyFragment) keyFragment).onBackPressed()){
                return;
            }
        }

        Fragment projectFragment = getSupportFragmentManager().findFragmentByTag(Constants.PROJECT_FRAGMENT);
        if (projectFragment != null && projectFragment.isVisible() && projectFragment instanceof ProjectFragment) {
            if (((ProjectFragment) projectFragment).onBackPressed()){
                return;
            }
        }

        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_back_home);
        Window window = dialog.getWindow();
        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));

        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);

        Button btnExit = dialog.findViewById(R.id.btn_exit);
        Button btnCancel = dialog.findViewById(R.id.btn_cancel);

        btnCancel.setOnClickListener(v -> dialog.dismiss());
        btnExit.setOnClickListener(v -> {
            dialog.dismiss();
            super.onBackPressed();
        });

        dialog.show();

    }
    public void showEnterKey(){
        if(!checkSecretKeyValid()){
            showInputKey();
        }
    }

}
