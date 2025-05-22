package vn.kayterandroid.foodappdemo.model;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

@Entity(tableName = "cartItems")
public class CartItem {
    @PrimaryKey(autoGenerate = true)
    @NonNull
    int id;
    String userId;
    String foodId;
    String image;
    String title;
    float price;
    String description;
    int quantity;

    public CartItem(String userId, String foodId, String image, String title, float price, String description, int quantity) {
        this.userId = userId;
        this.foodId = foodId;
        this.image = image;
        this.title = title;
        this.price = price;
        this.description = description;
        this.quantity = quantity;
    }

    public float getSubTotal() {
        return Math.round(this.price * this.quantity * 100.0f) / 100.0f;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFoodId() {
        return foodId;
    }

    public void setFoodId(String foodId) {
        this.foodId = foodId;
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

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
