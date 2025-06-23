package noti.socket.cache;

import feign.Body;
import feign.Headers;
import feign.Param;
import feign.RequestLine;

import java.util.List;
import java.util.Map;

interface CacheFeignClient {
    @RequestLine("POST /v1/cache/put-key")
    @Headers({
            "x-api-key: {apiKey}",
            "Content-Type: application/json",
            "Accept: application/json"
    })
    @Body("%7B\"key\":\"{key}\",\"session\":\"{session}\",\"time\":\"{time}\"%7D")
    Map<String, Object> putKey(
            @Param("apiKey") String apiKey,
            @Param("key") String key,
            @Param("session") String session,
            @Param("time") String time
    );

    @RequestLine("GET /v1/cache/get-key/{key}")
    @Headers({
            "x-api-key: {apiKey}",
            "Accept: application/json"
    })
    Map<String, Object> getKey(@Param("apiKey") String apiKey, @Param("key") String key);

    @RequestLine("DELETE /v1/cache/remove-key/{key}")
    @Headers({
            "x-api-key: {apiKey}",
            "Accept: application/json"
    })
    Map<String, Object> removeKey(@Param("apiKey") String apiKey, @Param("key") String key);

    @RequestLine("POST /v1/cache/check-session")
    @Headers({
            "x-api-key: {apiKey}",
            "Content-Type: application/json",
            "Accept: application/json"
    })
    @Body("%7B\"key\":\"{key}\",\"session\":\"{session}\"%7D")
    Map<String, Object> checkSession(
            @Param("apiKey") String apiKey,
            @Param("key") String key,
            @Param("session") String session
    );

    @RequestLine("GET /v1/cache/get-key-by-pattern/{pattern}")
    @Headers({
            "x-api-key: {apiKey}",
            "Accept: application/json"
    })
    List<Map<String, Object>> getKeyByPattern(@Param("apiKey") String apiKey, @Param("pattern") String pattern);

    @RequestLine("DELETE /v1/cache/remove-key-by-pattern/{pattern}")
    @Headers({
            "x-api-key: {apiKey}",
            "Accept: application/json"
    })
    List<Map<String, Object>> removeKeyByPattern(@Param("apiKey") String apiKey, @Param("pattern") String pattern);

    @RequestLine("POST /v1/cache/get-multi-key")
    @Headers({
            "x-api-key: {apiKey}",
            "Content-Type: application/json",
            "Accept: application/json"
    })
    @Body("%7B\"keys\":{keys}%7D")
    List<Map<String, Object>> getMultiKeys(@Param("apiKey") String apiKey, @Param("keys") String keys);
}