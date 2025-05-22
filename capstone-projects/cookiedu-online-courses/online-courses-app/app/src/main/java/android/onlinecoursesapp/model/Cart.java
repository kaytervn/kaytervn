package android.onlinecoursesapp.model;

import com.google.gson.annotations.SerializedName;

public class Cart {
    @SerializedName("id")
    String id;
    @SerializedName("userId")
    String userId;

    public Cart(String id, String userId) {
        this.id = id;
        this.userId = userId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
