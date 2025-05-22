package android.onlinecoursesapp.utils;
import android.onlinecoursesapp.model.MyCourse;
import android.onlinecoursesapp.model.Review;
import android.onlinecoursesapp.model.ReviewData;
import android.onlinecoursesapp.model.ReviewResult;

import android.onlinecoursesapp.model.CartItem;
import android.onlinecoursesapp.model.CheckoutRequest;
import android.onlinecoursesapp.model.Course;
import android.onlinecoursesapp.model.Document;
import android.onlinecoursesapp.model.Lesson;
import android.onlinecoursesapp.model.User;

import okhttp3.MultipartBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.Path;

public interface APIService {
    @POST("users/login-app-user")
    Call<ResponseBody> login(@Body User user);

    @POST("users/register-app-user")
    Call<ResponseBody> register(@Body User user);

    @PUT("users/change-app-user-name")
    Call<ResponseBody> changeUserName(@Header("Authorization") String token, @Body User user);

    @PUT("users/change-password-app-user")
    Call<ResponseBody> changeUserPassword(@Header("Authorization") String token, @Body User.ChangePassword user);

    @GET("carts/getCart")
    Call<ResponseBody> getCart(@Header("Authorization") String authorization);

    @GET("users/")
    Call<ResponseBody> getUser(@Header("Authorization") String authorization);

    @GET("courses/get_course/{id}")
    Call<ResponseBody> getCourseIntro(@Path("id") String id);
    @POST("lessons/get-course-lessons")
    Call<ResponseBody> getCourseLessons(@Body Lesson lesson);
    @POST("documents/get-lesson-documents")
    Call<ResponseBody> getLessonDocuments(@Body Document document);
    @POST("courses/search-courses")
    Call<ResponseBody> searchCourses(@Body Course.SearchCourses searchCourses);
    @GET("courses/get_course/{id}")
    Call<ResponseBody> getCourse(@Path("id") String courseId);
    @DELETE("carts/removeFromCart/{cartId}/{courseId}")
    Call<ResponseBody> removeFromCart(@Path("cartId") String cartId, @Path("courseId") String courseId);

    @POST("carts/addToCart")
    Call<ResponseBody> addToCart(@Header("Authorization") String authorization, @Body CartItem cartItemRequest);

    @Multipart
    @PUT("users/update-profile-picture")
    Call<ResponseBody> updateUserProfilePicture(@Header("Authorization") String token, @Part MultipartBody.Part image);

    @GET("invoices/my_course")
    Call<MyCourse> getMyCourses(@Header("Authorization") String token);
    @GET("invoices/my_course")
    Call<ResponseBody> getMyCourses_rep_bo(@Header("Authorization") String token);

    @GET("reviews/get-my-review-for-course/{courseId}")
    Call<Review> getMyReviewForCourse(@Header("Authorization") String token, @Path("courseId") String courseId);

    @POST("reviews/create_review/{courseId}")
    Call<ReviewResult> createReview(@Header("Authorization") String token, @Path("courseId") String temp, @Body ReviewData reviewData);

    @POST("invoices/checkout")
    Call<ResponseBody> performCheckout(@Header("Authorization") String authToken, @Body CheckoutRequest checkoutRequest);
}
