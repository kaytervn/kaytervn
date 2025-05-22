package com.example.bt02_tuan10;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;

public interface APIService {
    @GET("categories.php")
    Call<List<Category>> getCategoryAll();
    @FormUrlEncoded
    @POST("getcategory.php")
    Call<List<Item>> getItemAll(@Field("idcategory") String value);

}
