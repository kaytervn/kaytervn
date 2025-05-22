package android.onlinecoursesapp.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class ReviewData implements Serializable {
    @SerializedName("courseId")
    private String courseId;
    @SerializedName("reviewData")
    private Review reviewData;

    public ReviewData(String courseId, Review reviewData) {
        this.courseId = courseId;
        this.reviewData = reviewData;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public Review getReviewData() {
        return reviewData;
    }

    public void setReviewData(Review reviewData) {
        this.reviewData = reviewData;
    }
}
