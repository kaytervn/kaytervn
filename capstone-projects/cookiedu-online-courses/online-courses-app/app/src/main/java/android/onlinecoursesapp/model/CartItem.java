package android.onlinecoursesapp.model;

import com.google.gson.annotations.SerializedName;


import com.google.gson.annotations.SerializedName;

public class CartItem {
    @SerializedName("_id")
    String id;

    @SerializedName("cartId")
    String cartId;

    @SerializedName("courseId")
    String courseId;

    public CartItem(String id, String cartId, String courseId) {
        this.id = id;
        this.cartId = cartId;
        this.courseId = courseId;
    }
    public CartItem(String cartId, String courseId) {
        this.cartId = cartId;
        this.courseId = courseId;
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCartId() {
        return cartId;
    }

    public void setCartId(String cartId) {
        this.cartId = cartId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }
}


