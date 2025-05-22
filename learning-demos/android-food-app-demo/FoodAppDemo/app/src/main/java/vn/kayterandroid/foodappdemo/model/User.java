package vn.kayterandroid.foodappdemo.model;

import com.google.gson.annotations.SerializedName;

public class User {
    @SerializedName("id")
    String id;

    @SerializedName("image")
    String image;

    @SerializedName("name")
    String name;

    @SerializedName("email")
    String email;

    @SerializedName("password")
    String password;

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public User(String image, String name, String email, String password) {
        this.image = image;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public User(String id, String image, String name, String email, String password) {
        this.id = id;
        this.image = image;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
