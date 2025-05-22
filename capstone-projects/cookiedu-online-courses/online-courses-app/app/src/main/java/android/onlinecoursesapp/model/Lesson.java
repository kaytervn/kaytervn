package android.onlinecoursesapp.model;

import com.google.gson.annotations.SerializedName;

public class Lesson {
    @SerializedName("_id")
    private String _id;
    @SerializedName("courseId")
    private String courseId;
    @SerializedName("title")
    private String title;
    @SerializedName("description")
    private String description;

    public Lesson(String _id, String courseId, String title, String description) {
        this._id = _id;
        this.courseId = courseId;
        this.title = title;
        this.description = description;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Lesson(String courseId) {
        this.courseId = courseId;
    }
}
