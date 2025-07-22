package com.msa.socket.dto;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import lombok.Data;

@Data
public class ABasicRequest {
    private static final Gson GSON = new GsonBuilder()
            .registerTypeAdapter(Double.class, (JsonSerializer<Double>) (src, type, context) ->
                    src == src.longValue() ? new JsonPrimitive(src.longValue()) : new JsonPrimitive(src)
            )
            .enableComplexMapKeySerialization()
            .create();

    public String toJson() {
        return GSON.toJson(this);
    }
}