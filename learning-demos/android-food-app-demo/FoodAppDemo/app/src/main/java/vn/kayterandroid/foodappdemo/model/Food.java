package vn.kayterandroid.foodappdemo.model;

import com.google.gson.annotations.SerializedName;

public class Food {
    @SerializedName("id")
    String id;
    @SerializedName("image")
    String image;

    @SerializedName("title")
    String title;

    @SerializedName("price")
    float price;

    @SerializedName("description")
    String description;

    public Food() {
    }

    public Food(String title) {
        this.title = title;
    }


    public Food(String id, String image, String title, float price, String description) {
        this.id = id;
        this.image = image;
        this.title = title;
        this.price = price;
        this.description = description;
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
