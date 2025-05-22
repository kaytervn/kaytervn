package vn.kayterandroid.retrofit2_290324;

import java.util.List;
import java.util.Map;

import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FieldMap;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Url;

public interface APIService {
    @FormUrlEncoded
    @POST("registrationapi.php?apicall=login")
    Call<ResponseBody> login(
            @Field("username") String username,
            @Field("password") String password
    );
}
