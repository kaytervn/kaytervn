package vn.kayterandroid.bttuan10_21110332;

import android.os.Message;

import java.util.List;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;

public interface APIService {
    @FormUrlEncoded
    @POST("registrationapi.php?apicall=login")
    Call<ResponseBody> login(
            @Field("username") String username,
            @Field("password") String password
    );

    @Multipart
    @POST("updateimages.php")
    Call<ResponseBody> uploadImage(
            @Part("id") RequestBody id,
            @Part MultipartBody.Part image
    );
}
