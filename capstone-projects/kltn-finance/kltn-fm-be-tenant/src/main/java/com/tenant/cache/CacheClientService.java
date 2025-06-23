package com.tenant.cache;

import com.tenant.cache.dto.CacheKeyDto;
import com.tenant.cache.dto.CheckSessionDto;
import com.tenant.cache.dto.GetMultiKeyForm;
import com.tenant.cache.dto.PutPublicKeyForm;
import com.tenant.constant.SecurityConstant;
import com.tenant.multitenancy.feign.FeignCacheService;
import com.tenant.storage.tenant.model.Account;
import com.tenant.storage.tenant.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class CacheClientService {
    private static final String PREFIX_KEY_ADMIN = "adm:";
    private static final String PREFIX_KEY_CUSTOMER = "cus:";
    public static final String PREFIX_KEY_EMPLOYEE = "emp:";
    public static final String PREFIX_KEY_MOBILE = "mob:";
    @Autowired
    private SessionService sessionService;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private FeignCacheService feignCacheService;
    @Value("${cache.api-key}")
    private String cacheApiKey;

    public String getKeyString(Integer keyType, String username, String tenantName) {
        if (CacheConstant.KEY_ADMIN.equals(keyType)) {
            return PREFIX_KEY_ADMIN + username;
        } else if (CacheConstant.KEY_CUSTOMER.equals(keyType)) {
            return PREFIX_KEY_CUSTOMER + username + ":" + tenantName;
        } else if (CacheConstant.KEY_EMPLOYEE.equals(keyType)) {
            return PREFIX_KEY_EMPLOYEE + tenantName + ":" + username;
        } else {
            return PREFIX_KEY_MOBILE + tenantName + ":" + username;
        }
    }

    public void sendMessageLockAccount(Integer keyType, String username) {
        Account account = accountRepository.findFirstByUsername(username).orElse(null);
        if (account != null) {
            account.setLastLogin(new Date());
            accountRepository.save(account);
        }
        sessionService.sendMessageLockAccount(keyType, username);
    }

    public void putKeyCache(String key, String sessionId) {
        CacheKeyDto form = new CacheKeyDto();
        form.setKey(key);
        form.setSession(sessionId);
        form.setTime(new Date());
        feignCacheService.putKey(cacheApiKey, form);
    }

    public CacheKeyDto getKeyCache(String key) {
        return feignCacheService.getKey(cacheApiKey, key).getData();
    }

    public CacheKeyDto removeKey(String key) {
        return feignCacheService.removeKey(cacheApiKey, key).getData();
    }

    public List<CacheKeyDto> getKeyCacheByPattern(String pattern) {
        return feignCacheService.getKeyByPattern(cacheApiKey, pattern).getData();
    }

    public List<CacheKeyDto> removeKeyByPattern(String pattern) {
        return feignCacheService.removeKeyByPattern(cacheApiKey, pattern).getData();
    }

    public List<CacheKeyDto> getMultiKeys(List<String> keys) {
        GetMultiKeyForm form = new GetMultiKeyForm();
        form.setKeys(keys);
        return feignCacheService.getMultiKeys(cacheApiKey, form).getData();
    }

    public Boolean checkSession(String key, String sessionId) {
        CheckSessionDto dto = new CheckSessionDto();
        dto.setKey(key);
        dto.setSession(sessionId);
        return feignCacheService.checkSession(cacheApiKey, dto).getData().getIsValid();
    }

    public void putPublicKey(String key, String publicKey) {
        PutPublicKeyForm form = new PutPublicKeyForm();
        form.setKey(key);
        form.setPublicKey(publicKey);
        feignCacheService.putPublicKey(cacheApiKey, form);
    }

    public String getPublicKey(String key) {
        return feignCacheService.getPublicKey(cacheApiKey, key).getData().getPublicKey();
    }
}
