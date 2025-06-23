package com.master.redis;

import com.master.constant.MasterConstant;
import com.master.feign.dto.CacheKeyDto;
import com.master.feign.dto.CheckSessionDto;
import com.master.feign.dto.GetMultiKeyForm;
import com.master.feign.service.FeignCacheService;
import com.master.model.Account;
import com.master.redis.dto.PutPublicKeyForm;
import com.master.repository.AccountRepository;
import com.master.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

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
        if (RedisConstant.KEY_ADMIN.equals(keyType)) {
            return PREFIX_KEY_ADMIN + username;
        } else if (RedisConstant.KEY_CUSTOMER.equals(keyType)) {
            return PREFIX_KEY_CUSTOMER + username + ":" + tenantName;
        } else if (RedisConstant.KEY_EMPLOYEE.equals(keyType)) {
            return PREFIX_KEY_EMPLOYEE + tenantName + ":" + username;
        } else {
            return PREFIX_KEY_MOBILE + tenantName + ":" + username;
        }
    }

    public void sendMessageLockAccount(Integer keyType, String username, Integer userKind, String tenantName) {
        Account account = accountRepository.findFirstByUsernameAndKind(username, userKind).orElse(null);
        if (account != null) {
            account.setLastLogin(new Date());
            accountRepository.save(account);
        }
        if (MasterConstant.USER_KIND_ADMIN.equals(userKind)) {
            sessionService.sendMessageLockAdmin(username);
        } else if (MasterConstant.USER_KIND_CUSTOMER.equals(userKind)) {
            sessionService.sendMessageLockCustomer(username);
        } else {
            sessionService.sendMessageLockEmployee(keyType, username, tenantName);
        }
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
