package com.tenant.service;

import com.tenant.cache.CacheClientService;
import com.tenant.cache.CacheConstant;
import com.tenant.constant.FinanceConstant;
import com.tenant.constant.SecurityConstant;
import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.account.SubKeyWrapperDto;
import com.tenant.jwt.FinanceJwt;
import com.tenant.service.impl.UserServiceImpl;
import com.tenant.utils.RSAUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentMap;

@Service
public class KeyService {
    @Autowired
    private UserServiceImpl userService;
    private final ConcurrentMap<String, String> concurrentMap;
    @Value("${aes.secret-key.key-information}")
    private String keyInformationSecretKey;
    @Value("${aes.secret-key.finance}")
    private String financeSecretKey;
    @Value("${aes.secret-key.decrypt-password}")
    private String encryptPasswordSecretKey;
    @Autowired
    private CacheClientService cacheClientService;

    public KeyService(@Qualifier("applicationConfig") ConcurrentMap<String, String> concurrentMap) {
        this.concurrentMap = concurrentMap;
    }

    public long getCurrentUser() {
        FinanceJwt financeJwt = userService.getAddInfoFromToken();
        return financeJwt.getAccountId();
    }

    public String getFinanceSecretKey() {
        return concurrentMap.get(FinanceConstant.FINANCE_SECRET_KEY);
    }

    public String getKeyInformationSecretKey() {
        return concurrentMap.get(FinanceConstant.KEY_INFORMATION_SECRET_KEY);
    }

    public String getDecryptPasswordSecretKey() {
        return concurrentMap.get(FinanceConstant.DECRYPT_PASSWORD_SECRET_KEY);
    }

    public String getUserSecretKey() {
        try {
            FinanceJwt financeJwt = userService.getAddInfoFromToken();
            return financeJwt.getSecretKey();
        } catch (Exception ignored) {
            return null;
        }
    }

    public String getUserPublicKey() {
        try {
            Map<String, Object> attributes = userService.getAttributesFromToken();
            String grantType = String.valueOf(attributes.get("grant_type"));
            String username = String.valueOf(attributes.get("username"));
            String tenantName = String.valueOf(attributes.get("tenant_name"));
            String key;
            if (SecurityConstant.GRANT_TYPE_EMPLOYEE.equals(grantType)) {
                key = cacheClientService.getKeyString(CacheConstant.KEY_EMPLOYEE, username, tenantName);
            } else if (SecurityConstant.GRANT_TYPE_MOBILE.equals(grantType)) {
                key = cacheClientService.getKeyString(CacheConstant.KEY_MOBILE, username, tenantName);
            } else if (SecurityConstant.GRANT_TYPE_CUSTOMER.equals(grantType)) {
                key = cacheClientService.getKeyString(CacheConstant.KEY_CUSTOMER, username, tenantName);
            } else {
                return null;
            }
            return cacheClientService.getPublicKey(key);
        } catch (Exception ignored) {
            return null;
        }
    }

    public void clearConcurrentMap() {
        concurrentMap.clear();
    }

    public KeyWrapperDto getFinanceKeyWrapper() {
        return new KeyWrapperDto(getFinanceSecretKey(), getUserSecretKey());
    }

    public KeyWrapperDto getKeyInformationKeyWrapper() {
        return new KeyWrapperDto(getKeyInformationSecretKey(), getUserSecretKey());
    }

    public SubKeyWrapperDto getFinanceSubKeyWrapper() {
        return new SubKeyWrapperDto(getFinanceSecretKey(), getUserSecretKey());
    }

    public SubKeyWrapperDto getKeyInformationSubKeyWrapper() {
        return new SubKeyWrapperDto(getKeyInformationSecretKey(), getUserSecretKey());
    }

    public void setMasterKey(String privateKey) {
        String decryptFinanceSecretKey = RSAUtils.decrypt(privateKey, financeSecretKey);
        String decryptKeyInformationSecretKey = RSAUtils.decrypt(privateKey, keyInformationSecretKey);
        String decryptPasswordSecretKey = RSAUtils.decrypt(privateKey, encryptPasswordSecretKey);
        concurrentMap.put(FinanceConstant.PRIVATE_KEY, privateKey);
        concurrentMap.put(FinanceConstant.FINANCE_SECRET_KEY, decryptFinanceSecretKey);
        concurrentMap.put(FinanceConstant.KEY_INFORMATION_SECRET_KEY, decryptKeyInformationSecretKey);
        concurrentMap.put(FinanceConstant.DECRYPT_PASSWORD_SECRET_KEY, decryptPasswordSecretKey);
    }

    public KeyWrapperDto getUserKeyWrapper() {
        return new KeyWrapperDto(getUserSecretKey(), getFinanceSecretKey());
    }
}
