package vn.kayterandroid.bt12_viewproductdetail.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import java.util.List;

import vn.kayterandroid.bt12_viewproductdetail.model.CartItem;

@Dao
public interface CartItemDAO {
    @Query("Select * from cartItems")
    List<CartItem> getAll();

    @Query("Select * from cartItems WHERE image = :image AND title = :title AND price = :price")
    CartItem getCartItem(String image, String title, int price);

    @Insert
    void addCartItem(CartItem cartItem);

    @Update
    void updateCartItem(CartItem cartItem);

    @Delete
    void deleteCartItem(CartItem cartItem);

    @Query("SELECT COUNT(*) FROM cartItems WHERE image = :image AND title = :title AND price = :price")
    int checkCartItemExistence(String image, String title, int price);
}
