package noti.socket.onesignal;

import feign.Body;
import feign.Headers;
import feign.Param;
import feign.RequestLine;

import java.util.Map;

interface OneSignalClient {
    @RequestLine("POST /notifications?c=push")
    @Headers({
            "Authorization: {apiKey}",
            "Content-Type: application/json",
            "Accept: application/json"
    })
    @Body("%7B\"app_id\":\"{appId}\",\"contents\":{contents},\"include_player_ids\":{includedPlayerIds},\"data\":{data}%7D")
    Map<String, Object> sendNotification(@Param("appId") String appId, @Param("contents") String contents, @Param("includedPlayerIds") String includedPlayerIds, @Param("data") String data, @Param("apiKey") String apiKey);
}