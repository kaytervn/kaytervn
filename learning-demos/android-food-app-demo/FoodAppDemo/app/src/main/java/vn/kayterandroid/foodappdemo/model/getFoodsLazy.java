package vn.kayterandroid.foodappdemo.model;

import com.google.gson.annotations.SerializedName;

public class getFoodsLazy {
    @SerializedName("page")
    int page;
    @SerializedName("limit")
    int limit;

    public getFoodsLazy(int page, int limit) {
        this.page = page;
        this.limit = limit;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }
}
