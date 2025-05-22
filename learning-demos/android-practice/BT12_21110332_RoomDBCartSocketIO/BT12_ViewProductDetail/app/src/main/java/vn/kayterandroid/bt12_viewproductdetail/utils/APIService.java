package vn.kayterandroid.bt12_viewproductdetail.utils;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface APIService {
    @GET("foods/")
    Call<ResponseBody> getFoods();

    @GET("foods/{id}")
    Call<ResponseBody> getFood(@Path("id") String foodId);
}
