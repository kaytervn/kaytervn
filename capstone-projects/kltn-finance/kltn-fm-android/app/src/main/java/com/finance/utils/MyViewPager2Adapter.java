package com.finance.utils;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;

import com.finance.ui.fragment.account.AccountFragment;
import com.finance.ui.fragment.key.KeyFragment;
import com.finance.ui.fragment.home.HomeFragment;
import com.finance.ui.fragment.statistics.StatisticsFragment;


public class MyViewPager2Adapter extends FragmentStateAdapter {

    public MyViewPager2Adapter(@NonNull FragmentActivity fragmentActivity) {
        super(fragmentActivity);
    }

    @NonNull
    @Override
    public Fragment createFragment(int i) {
        switch (i) {
            case 1:
                return new StatisticsFragment();
            case 2:
                return new KeyFragment();
            case 3:
                return new AccountFragment();
            default:
                return new HomeFragment();
        }
    }

    @Override
    public int getItemCount() {
        return 4;
    }

}
