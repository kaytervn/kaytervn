package com.finance.data.remote;


import com.finance.data.model.api.ResponseWrapper;
import com.finance.data.model.api.response.account.AvatarPathResponse;

import io.reactivex.rxjava3.core.Observable;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Path;

public interface ApiMediaService {
    @Multipart
    @POST("v1/media/upload")
    Observable<ResponseWrapper<AvatarPathResponse>> uploadFile(@Part("type") RequestBody type, @Part MultipartBody.Part file);
    @GET("v1/media/download/{folder}/{fileName}")
        //Download file
    Observable<ResponseBody> downloadFile(
            @Path("folder") String folder,
            @Path("fileName") String filename);
}
