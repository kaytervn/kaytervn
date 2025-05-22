package vn.kayterandroid.bttuan10_21110332;

import com.google.gson.annotations.SerializedName;

public class User {
    @SerializedName("id")
    private String id;
    @SerializedName("username")
    private String username;
    @SerializedName("images")
    private String images;
    @SerializedName("email")
    private String email;
    @SerializedName("gender")
    private String gender;

    public User(String id, String username, String email, String gender, String images) {
        this.id = id;
        this.username = username;
        this.images = images;
        this.email = email;
        this.gender = gender;
    }

    public User() {
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getImages() {
        return images;
    }

    public void setImages(String images) {
        this.images = images;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
