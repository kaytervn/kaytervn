package android.onlinecoursesapp.model;

import com.google.gson.annotations.SerializedName;

public class Document {
    @SerializedName("_id")
    private String id;
    @SerializedName("lessonId")
    private String lessonId;
    @SerializedName("cloudinary")
    private String cloudinary;
    @SerializedName("title")
    private String title;
    @SerializedName("description")
    private String description;
    @SerializedName("content")
    private String content;

    public Document(String id, String lessonId, String cloudinary, String title, String description, String content) {
        this.id = id;
        this.lessonId = lessonId;
        this.cloudinary = cloudinary;
        this.title = title;
        this.description = description;
        this.content = content;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLessonId() {
        return lessonId;
    }

    public void setLessonId(String lessonId) {
        this.lessonId = lessonId;
    }

    public String getCloudinary() {
        return cloudinary;
    }

    public void setCloudinary(String cloudinary) {
        this.cloudinary = cloudinary;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Document(String lessonId) {
        this.lessonId = lessonId;
    }
}

