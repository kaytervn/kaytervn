package vn.kayterandroid.foodappdemo.dao;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import vn.kayterandroid.foodappdemo.model.CartItem;

@Database(entities = {CartItem.class}, version = 1)
public abstract class CartItemDatabase extends RoomDatabase {
    private static final String DATABASE_NAME = "cartItem.db";
    private static CartItemDatabase instance;

    public static synchronized CartItemDatabase getInstance(Context context) {
        if (instance == null) {
            instance = Room.databaseBuilder(context.getApplicationContext(), CartItemDatabase.class, DATABASE_NAME)
                    .allowMainThreadQueries()
                    .fallbackToDestructiveMigrationOnDowngrade()
                    .build();
        }
        return instance;
    }

    public abstract CartItemDAO cartItemDAO();
}
