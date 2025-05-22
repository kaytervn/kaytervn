package vn.kayterandroid.foodappdemo.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import java.util.List;

import vn.kayterandroid.foodappdemo.model.CartItem;

@Dao
public interface CartItemDAO {
    @Query("Select * from cartItems WHERE userId = :userId")
    List<CartItem> getAll(String userId);

    @Query("SELECT * FROM cartItems WHERE LOWER(title) LIKE '%' || LOWER(:title) || '%'")
    List<CartItem> findByTitle(String title);

    @Query("Select * from cartItems WHERE userId = :userId AND foodId = :foodId")
    CartItem getCartItem(String userId, String foodId);

    @Insert
    void addCartItem(CartItem cartItem);

    @Update
    void updateCartItem(CartItem cartItem);

    @Delete
    void deleteCartItem(CartItem cartItem);

    @Query("SELECT COUNT(*) FROM cartItems WHERE userId = :userId AND foodId = :foodId")
    int checkCartItemExistence(String userId, String foodId);
}
