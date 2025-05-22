package vn.kayterandroid.bt12_viewproductdetail.model;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "cartItems")
public class CartItem {
    @PrimaryKey(autoGenerate = true)
    @NonNull
    int id;
    String image;
    String title;
    int price;
    int quantity;

    public CartItem(String image, String title, int price, int quantity) {
        this.image = image;
        this.title = title;
        this.price = price;
        this.quantity = quantity;
    }

    @NonNull
    public int getId() {
        return id;
    }

    public void setId(@NonNull int id) {
        this.id = id;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getSubTotal() {
        return price * quantity;
    }
}
