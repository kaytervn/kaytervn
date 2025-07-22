package com.msa.service.encryption;

import com.msa.cache.SessionService;
import com.msa.cache.dto.SessionDto;
import com.msa.dto.auth.KeyWrapperDto;
import com.msa.jwt.AppJwt;
import com.msa.service.impl.UserServiceImpl;
import com.msa.utils.AESUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EncryptionService {
    @Value("${app.server-key}")
    private String serverKey;
    @Value("${app.client-key}")
    private String clientKey;
    @Autowired
    private UserServiceImpl userService;
    @Autowired
    @Lazy
    private SessionService sessionService;

    public String clientDecrypt(String value) {
        return AESUtils.decrypt(clientKey, value);
    }

    public String clientEncrypt(String value) {
        return AESUtils.encrypt(clientKey, value);
    }

    public String serverDecrypt(String value) {
        return AESUtils.decrypt(serverKey, value);
    }

    public String serverEncrypt(String value) {
        return AESUtils.encrypt(serverKey, value);
    }

    public String userDecrypt(String value) {
        return AESUtils.decrypt(getUserSecretKey(), value);
    }

    public String userEncrypt(String value) {
        return AESUtils.encrypt(getUserSecretKey(), value);
    }

    public String getUserSecretKey() {
        try {
            AppJwt jwt = userService.getAddInfoFromToken();
            return jwt.getSecretKey();
        } catch (Exception ignored) {
            return null;
        }
    }

    public String getUserPublicKey() {
        try {
            AppJwt jwt = userService.getAddInfoFromToken();
            String key = sessionService.getKeyString(jwt.getUserKind(), jwt.getUsername());
            SessionDto dto = sessionService.getKey(key);
            return dto.getPublicKey();
        } catch (Exception ignored) {
            return null;
        }
    }

    public KeyWrapperDto getServerKeyWrapper() {
        return new KeyWrapperDto(serverKey, getUserSecretKey());
    }
}
