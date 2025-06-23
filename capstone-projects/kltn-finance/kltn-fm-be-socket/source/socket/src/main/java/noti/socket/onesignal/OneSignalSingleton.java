package noti.socket.onesignal;

import feign.Feign;
import feign.gson.GsonDecoder;
import feign.gson.GsonEncoder;
import noti.common.utils.ConfigurationService;

import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import noti.socket.constant.OneSignalConstant;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class OneSignalSingleton {
    private static final Logger LOG = LogManager.getLogger(OneSignalSingleton.class);
    private final ConfigurationService config = new ConfigurationService("configuration.properties");
    private final String MOBILE_APP_ID = config.getString("onesignal.mobile.app-id");
    private final String MOBILE_API_KEY = config.getString("onesignal.mobile.api-key");
    private final String VIEW_APP_ID = config.getString("onesignal.view.app-id");
    private final String VIEW_API_KEY = config.getString("onesignal.view.api-key");
    private final Boolean ONESIGNAL_ENABLED = Boolean.valueOf(config.getString("onesignal.enabled"));

    private static OneSignalSingleton instance;
    private final OneSignalClient oneSignalClient;

    private OneSignalSingleton() {
        String apiUrl = config.getString("onesignal.api-url");
        this.oneSignalClient = Feign.builder()
                .encoder(new GsonEncoder())
                .decoder(new GsonDecoder())
                .target(OneSignalClient.class, apiUrl);
    }

    public static synchronized OneSignalSingleton getInstance() {
        if (instance == null) {
            instance = new OneSignalSingleton();
        }
        return instance;
    }

    public void sendNotification(RequestPushNotification request) {
        if (!ONESIGNAL_ENABLED) {
            LOG.info(">>> [One Signal] Notifications are disabled");
            return;
        }

        if (StringUtils.isBlank(request.getAppName()) || StringUtils.isBlank(request.getPlayerId())) {
            LOG.info(">>> [One Signal] Cannot send notification for a blank app name or player ID");
            return;
        }

        PushNotificationForm<DataForm> form = new PushNotificationForm<>();
        form.setContents(new ContentsDto(request.getTitle()));
        form.setData(new DataForm(request.getContent()));
        form.setIncludedPlayerIds(List.of(request.getPlayerId()));

        String apiKey = "Key ";
        if (OneSignalConstant.APP_MOBILE.equals(request.getAppName())) {
            form.setAppId(MOBILE_APP_ID);
            apiKey += MOBILE_API_KEY;
        } else if (OneSignalConstant.APP_VIEW.equals(request.getAppName())) {
            form.setAppId(VIEW_APP_ID);
            apiKey += VIEW_API_KEY;
        } else {
            throw new IllegalArgumentException("Unsupported app name: " + request.getAppName());
        }

        try {
            LOG.info(">>> [One Signal] Sending notification: {}", form);
            Gson gson = new Gson();
            Map<String, Object> response = oneSignalClient.sendNotification(
                    form.getAppId(),
                    gson.toJson(form.getContents()),
                    gson.toJson(form.getIncludedPlayerIds()),
                    gson.toJson(form.getData()),
                    apiKey
            );
            LOG.info(">>> [One Signal] Response: {}", response);
        } catch (Exception e) {
            throw new RuntimeException("Error sending notification: " + e.getMessage(), e);
        }
    }
}
