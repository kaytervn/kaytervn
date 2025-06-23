package com.finance.data.model.api;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;

import java.lang.reflect.Type;

import timber.log.Timber;

public class ApiModelUtils {
    public static Gson GSON = new GsonBuilder()
            .registerTypeAdapter(Double.class, (JsonSerializer<Double>) (src, typeOfSrc, context) -> {
                if (src == src.longValue()) {
                    return new JsonPrimitive(src.longValue());
                }
                return new JsonPrimitive(src);
            })
            //.setPrettyPrinting()
            .enableComplexMapKeySerialization()
            .create();

    public static <T> T fromJson(String json, Class<T> classOfT) {
        if (json == null || json.isEmpty() || !isJSONValid(json)) {
            return null;
        } else {
            T target = null;
            try {
                target = GSON.fromJson(json, classOfT);
            } catch (Exception e) {
                Timber.d(e);
            }
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

//    public static String toJson(BaseResponse objects) {
//        return GSON.toJson(objects);
//    }
//
//    public static String toJson(BaseRequest objects) {
//        return GSON.toJson(objects);
//    }

    public <T> T getDataObject(String data, Class<T> classOfT) {
        if (data == null) {
            return null;
        } else {
            T target = GSON.fromJson(GSON.toJsonTree(data), classOfT);
            return target;
        }
    }

    public <T> T getDataObject(String data, Type type) {
        if (data == null) {
            return null;
        } else {
            T target = GSON.fromJson(GSON.toJsonTree(data), type);
            return target;
        }
    }
}
