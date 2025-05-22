package vn.kayterandroid.retrofit2_290324;

import com.google.gson.annotations.SerializedName;

public class User {
    @SerializedName("id")
    private int id;
    @SerializedName("username")
    private String username;
    @SerializedName("images")
    private String images;
    @SerializedName("email")
    private String email;
    @SerializedName("gender")
    private String gender;

    public User(int id, String username, String email, String gender, String images) {
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

    public int getId() {
        return id;
    }

    public void setId(int id) {
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
