package com.msa.socket.dto;

import com.google.gson.*;
import lombok.Data;

import java.lang.reflect.Type;

@Data
public class MessageDto {
    private String cmd;
    private Object data;
    private String msg;
    private String token;
    private Integer responseCode;

    private static final Gson GSON = new GsonBuilder()
            .registerTypeAdapter(Double.class, (JsonSerializer<Double>) (src, typeOfSrc, context) -> src == src.longValue()
                    ? new JsonPrimitive(src.longValue())
                    : new JsonPrimitive(src))
            .enableComplexMapKeySerialization()
            .create();

    public <T> T getDataObject(Class<T> classOfT) {
        return data == null ? null : GSON.fromJson(GSON.toJsonTree(data), classOfT);
    }

    public <T> T getDataObject(Type type) {
        return data == null ? null : GSON.fromJson(GSON.toJsonTree(data), type);
    }

    public String toJson() {
        return GSON.toJson(this);
    }

    public static <T> T fromJson(String json, Class<T> classOfT) {
        if (json == null || json.isEmpty() || !isJsonValid(json)) return null;
        try {
            return GSON.fromJson(json, classOfT);
        } catch (JsonSyntaxException e) {
            return null;
        }
    }

    public static boolean isJsonValid(String json) {
        try {
            GSON.fromJson(json, Object.class);
            return true;
        } catch (JsonSyntaxException e) {
            return false;
        }
    }
}

