package noti.common.json;

import com.google.gson.*;
import lombok.Data;

import java.io.Serializable;
import java.lang.reflect.Type;

@Data
public class Message implements Serializable {
    private String cmd = null;
    private String subCmd = null;
    private Integer platform = null;
    private String clientVersion;

    private Object data = null;
    private String msg = null;
    private String token;
    private Integer responseCode;

    private String app;
    private String channelId;

    static Gson GSON = new GsonBuilder()
            .registerTypeAdapter(Double.class, (JsonSerializer<Double>) (src, typeOfSrc, context) -> {
                if (src == src.longValue()) {
                    return new JsonPrimitive(src.longValue());
                }
                return new JsonPrimitive(src);
            })
            //.setPrettyPrinting()
            .enableComplexMapKeySerialization()
            .create();

    public <T> T getDataObject(Class<T> classOfT) {
        if (data == null) {
            return null;
        } else {
            T target = GSON.fromJson(GSON.toJsonTree(data), classOfT);
            return target;
        }
    }

    public static <T> T fromJson(String json, Class<T> classOfT) {
        if (json == null || "".equals(json) || !isJSONValid(json)) {
            return null;
        } else {
            T target = null;
            try {
                target = GSON.fromJson(json, classOfT);
            } catch (Exception e) {
                e.printStackTrace();
            }
            return target;
        }
    }

    public <T> T getDataObject(Type type) {
        if (data == null) {
            return null;
        } else {
            T target = GSON.fromJson(GSON.toJsonTree(data), type);
            return target;
        }
    }

    public static boolean isJSONValid(String jsonInString) {
        try {
            GSON.fromJson(jsonInString, Object.class);
            return true;
        } catch (com.google.gson.JsonSyntaxException ex) {
            return false;
        }
    }

    public String toJson() {

        return GSON.toJson(this);
    }

}

