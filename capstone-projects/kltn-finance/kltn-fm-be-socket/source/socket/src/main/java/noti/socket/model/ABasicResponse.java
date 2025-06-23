package noti.socket.model;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import lombok.Data;

@Data
public class ABasicResponse {
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


    public String toJson(){
        return GSON.toJson(this);
    }
}
