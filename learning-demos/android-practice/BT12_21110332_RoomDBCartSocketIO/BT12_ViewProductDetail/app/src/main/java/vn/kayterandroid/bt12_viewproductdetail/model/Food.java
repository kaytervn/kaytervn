package vn.kayterandroid.bt12_viewproductdetail.model;

import com.google.gson.annotations.SerializedName;

public class Food {
    @SerializedName("id")
    String id;
    @SerializedName("image")
    String image;

    @SerializedName("title")
    String title;

    @SerializedName("price")
    String price;

    @SerializedName("description")
    String description;

    public Food() {
    }

    public Food(String id, String image, String title, String price, String description) {
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

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
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
