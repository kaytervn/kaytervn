package android.onlinecoursesapp.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

public class Course implements Serializable {
    @SerializedName("_id")
    private String id;

    @SerializedName("instructorName")
    String instructorName;

    @SerializedName("title")
    String title;

    @SerializedName("topic")
    String topic;

    @SerializedName("picture")
    String picture;

    @SerializedName("description")
    String description;

    @SerializedName("createdAt")
    String createdAt;

    @SerializedName("price")
    float price;

    public Course(String id, String instructorName, String title, String topic, String picture, String description, String createdAt, float price) {
        this.id = id;
        this.instructorName = instructorName;
        this.title = title;
        this.topic = topic;
        this.picture = picture;
        this.description = description;
        this.createdAt = createdAt;
        this.price = price;
    }

    public Course(String id, String instructorName, String title, String topic, String picture, float price) {
        this.id = id;
        this.instructorName = instructorName;
        this.title = title;
        this.topic = topic;
        this.picture = picture;
        this.price = price;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public static class SearchCourses {
        @SerializedName("keyword")
        String searchValue;
        @SerializedName("topic")
        String selectedTopic;
        @SerializedName("sort")
        String selectedSort;
        @SerializedName("page")
        int currentPage;

        public SearchCourses(String searchValue, String selectedTopic, String selectedSort, int currentPage) {
            this.searchValue = searchValue;
            this.selectedTopic = selectedTopic;
            this.selectedSort = selectedSort;
            this.currentPage = currentPage;
        }
    }
    public class Review {
        @SerializedName("_id")
        String id;
        @SerializedName("userId")
        String userId;
        @SerializedName("courseId")
        String courseId;
        @SerializedName("ratingStar")
        int ratingStar;
        @SerializedName("content")
        String content;
        @SerializedName("userName")
        String userName;
        @SerializedName("userPicture")
        String userPicture;

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

        public String getCourseId() {
            return courseId;
        }

        public void setCourseId(String courseId) {
            this.courseId = courseId;
        }

        public int getRatingStar() {
            return ratingStar;
        }

        public void setRatingStar(int ratingStar) {
            this.ratingStar = ratingStar;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getUserPicture() {
            return userPicture;
        }

        public void setUserPicture(String userPicture) {
            this.userPicture = userPicture;
        }
    }

    public class CourseDetailsResponse {
        @SerializedName("course")
        Course course;
        @SerializedName("reviews")
        List<Review> reviews;
        @SerializedName("averageStars")
        float averageStars;

        public Course getCourse() {
            return course;
        }

        public void setCourse(Course course) {
            this.course = course;
        }

        public List<Review> getReviews() {
            return reviews;
        }

        public void setReviews(List<Review> reviews) {
            this.reviews = reviews;
        }

        public float getAverageStars() {
            return averageStars;
        }

        public void setAverageStars(float averageStars) {
            this.averageStars = averageStars;
        }
    }


}



