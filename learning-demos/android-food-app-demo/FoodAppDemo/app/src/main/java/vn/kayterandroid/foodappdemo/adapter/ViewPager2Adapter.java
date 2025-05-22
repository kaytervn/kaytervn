package vn.kayterandroid.foodappdemo.adapter;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Lifecycle;
import androidx.viewpager2.adapter.FragmentStateAdapter;

import vn.kayterandroid.foodappdemo.CartActivity;
import vn.kayterandroid.foodappdemo.DashboardActivity;
import vn.kayterandroid.foodappdemo.ProfileActivity;

public class ViewPager2Adapter extends FragmentStateAdapter {

    public ViewPager2Adapter(@NonNull FragmentManager fragmentManager, @NonNull Lifecycle lifecycle) {
        super(fragmentManager, lifecycle);
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position) {
            case 0:
                return new DashboardActivity();
            case 1:
                return new CartActivity();
            case 2:
                return new ProfileActivity();
            default:
                return new DashboardActivity();
        }
    }

    @Override
    public int getItemCount() {
        return 3;
    }
}
