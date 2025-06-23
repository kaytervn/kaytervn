package com.master.service;

import com.master.constant.MasterConstant;
import com.master.dto.account.AccountAdminDto;
import com.master.dto.customer.CustomerAdminDto;
import com.master.feign.dto.CacheKeyDto;
import com.master.model.Account;
import com.master.model.Group;
import com.master.model.Location;
import com.master.rabbit.RabbitService;
import com.master.rabbit.form.LockAccountRequest;
import com.master.rabbit.form.ProcessTenantForm;
import com.master.redis.RedisConstant;
import com.master.redis.CacheClientService;
import com.master.repository.AccountRepository;
import com.master.repository.LocationRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SessionService {
    @Autowired
    private CacheClientService cacheClientService;
    @Autowired
    private RabbitService rabbitService;
    @Value("${rabbitmq.queue.notification}")
    private String notificationQueue;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private AccountRepository accountRepository;

    public void mappingLastLoginForListAccounts(List<AccountAdminDto> accounts) {
        if (accounts == null || accounts.isEmpty()) {
            return;
        }
        Map<String, AccountAdminDto> keyToAccountMap = new HashMap<>(accounts.size());
        for (AccountAdminDto account : accounts) {
            Integer keyType = MasterConstant.USER_KIND_ADMIN.equals(account.getKind())
                    ? RedisConstant.KEY_ADMIN
                    : RedisConstant.KEY_CUSTOMER;
            String key = cacheClientService.getKeyString(keyType, account.getUsername(), null);
            keyToAccountMap.put(key, account);
        }
        List<CacheKeyDto> dtos = cacheClientService.getMultiKeys(new ArrayList<>(keyToAccountMap.keySet()));
        if (dtos == null || dtos.isEmpty()) {
            return;
        }
        Map<String, CacheKeyDto> cacheKeyMap = dtos.stream()
                .filter(dto -> dto.getKey() != null && dto.getTime() != null)
                .collect(Collectors.toMap(CacheKeyDto::getKey, dto -> dto));
        for (Map.Entry<String, AccountAdminDto> entry : keyToAccountMap.entrySet()) {
            CacheKeyDto cacheDto = cacheKeyMap.get(entry.getKey());
            if (cacheDto != null) {
                entry.getValue().setLastLogin(cacheDto.getTime());
            }
        }
    }

    public void mappingLastLoginForListCustomers(List<CustomerAdminDto> accounts) {
        if (accounts == null || accounts.isEmpty()) {
            return;
        }
        Map<String, CustomerAdminDto> keyToAccountMap = new HashMap<>(accounts.size());
        for (CustomerAdminDto account : accounts) {
            String keyPattern = cacheClientService.getKeyString(RedisConstant.KEY_CUSTOMER, account.getAccount().getUsername(), "*");
            List<CacheKeyDto> dtos = cacheClientService.getKeyCacheByPattern(keyPattern);
            keyToAccountMap.put(dtos.get(0).getKey(), account);
        }
        List<CacheKeyDto> dtos = cacheClientService.getMultiKeys(new ArrayList<>(keyToAccountMap.keySet()));
        if (dtos == null || dtos.isEmpty()) {
            return;
        }
        Map<String, CacheKeyDto> cacheKeyMap = dtos.stream()
                .filter(dto -> dto.getKey() != null && dto.getTime() != null)
                .collect(Collectors.toMap(CacheKeyDto::getKey, dto -> dto));
        for (Map.Entry<String, CustomerAdminDto> entry : keyToAccountMap.entrySet()) {
            CacheKeyDto cacheDto = cacheKeyMap.get(entry.getKey());
            if (cacheDto != null) {
                entry.getValue().getAccount().setLastLogin(cacheDto.getTime());
            }
        }
    }

    public void sendMessageLockAdmin(String username) {
        Integer keyType = RedisConstant.KEY_ADMIN;
        LockAccountRequest request = new LockAccountRequest();
        request.setApp(MasterConstant.APP_MASTER);
        request.setKeyType(keyType);
        request.setUsername(username);
        request.setUserKind(MasterConstant.USER_KIND_ADMIN);
        String key = cacheClientService.getKeyString(keyType, username, null);
        CacheKeyDto dto = cacheClientService.removeKey(key);
        if (dto != null) {
            ProcessTenantForm<LockAccountRequest> form = new ProcessTenantForm<>();
            form.setAppName(MasterConstant.BACKEND_APP);
            form.setQueueName(notificationQueue);
            form.setCmd(MasterConstant.CMD_LOCK_DEVICE);
            form.setData(request);
            rabbitService.handleSendMsg(form);
        }
    }

    public void sendMessageLockCustomer(String username) {
        Integer keyType = RedisConstant.KEY_CUSTOMER;
        String keyPattern = cacheClientService.getKeyString(keyType, username, "*");

        List<CacheKeyDto> dtos = cacheClientService.removeKeyByPattern(keyPattern);
        for (CacheKeyDto dto : dtos) {
            String[] keyParts = dto.getKey().split(":");
            if (keyParts.length <= 2 || StringUtils.isBlank(keyParts[1])) {
                continue;
            }
            String tenantName = keyParts[2];

            LockAccountRequest request = new LockAccountRequest();
            request.setApp(MasterConstant.APP_MASTER);
            request.setKeyType(keyType);
            request.setUsername(username);
            request.setUserKind(MasterConstant.USER_KIND_CUSTOMER);
            request.setTenantName(tenantName);

            ProcessTenantForm<LockAccountRequest> form = new ProcessTenantForm<>();
            form.setAppName(MasterConstant.BACKEND_APP);
            form.setQueueName(notificationQueue);
            form.setCmd(MasterConstant.CMD_LOCK_DEVICE);
            form.setData(request);
            rabbitService.handleSendMsg(form);
        }
    }

    public void sendMessageLockCustomer(String username, String tenantName) {
        Integer keyType = RedisConstant.KEY_CUSTOMER;
        LockAccountRequest request = new LockAccountRequest();
        request.setApp(MasterConstant.APP_MASTER);
        request.setKeyType(keyType);
        request.setUsername(username);
        request.setUserKind(MasterConstant.USER_KIND_CUSTOMER);
        request.setTenantName(tenantName);
        String key = cacheClientService.getKeyString(keyType, username, tenantName);
        CacheKeyDto dto = cacheClientService.removeKey(key);
        if (dto != null) {
            ProcessTenantForm<LockAccountRequest> form = new ProcessTenantForm<>();
            form.setAppName(MasterConstant.BACKEND_APP);
            form.setQueueName(notificationQueue);
            form.setCmd(MasterConstant.CMD_LOCK_DEVICE);
            form.setData(request);
            rabbitService.handleSendMsg(form);
        }
    }

    public void sendMessageLockEmployee(Integer keyType, String username, String tenantName) {
        LockAccountRequest request = new LockAccountRequest();
        request.setApp(MasterConstant.APP_MASTER);
        request.setKeyType(keyType);
        request.setUsername(username);
        request.setUserKind(MasterConstant.USER_KIND_EMPLOYEE);
        request.setTenantName(tenantName);
        String key = cacheClientService.getKeyString(keyType, username, tenantName);
        CacheKeyDto dto = cacheClientService.removeKey(key);
        if (dto != null) {
            ProcessTenantForm<LockAccountRequest> form = new ProcessTenantForm<>();
            form.setAppName(MasterConstant.BACKEND_APP);
            form.setQueueName(notificationQueue);
            form.setCmd(MasterConstant.CMD_LOCK_DEVICE);
            form.setData(request);
            rabbitService.handleSendMsg(form);
        }
    }

    public void sendMessageLockAccountsByTenantId(Integer keyType, String tenantName) {
        String keyPattern = CacheClientService.PREFIX_KEY_EMPLOYEE + tenantName + ":*";
        if (RedisConstant.KEY_MOBILE.equals(keyType)) {
            keyPattern = CacheClientService.PREFIX_KEY_MOBILE + tenantName + ":*";
        }
        List<CacheKeyDto> dtos = cacheClientService.removeKeyByPattern(keyPattern);
        for (CacheKeyDto dto : dtos) {
            String[] keyParts = dto.getKey().split(":");
            if (keyParts.length <= 2 || StringUtils.isBlank(keyParts[1])) {
                continue;
            }
            String username = keyParts[2];

            LockAccountRequest request = new LockAccountRequest();
            request.setApp(MasterConstant.APP_MASTER);
            request.setKeyType(keyType);
            request.setUsername(username);
            request.setUserKind(MasterConstant.USER_KIND_EMPLOYEE);
            request.setTenantName(tenantName);

            ProcessTenantForm<LockAccountRequest> form = new ProcessTenantForm<>();
            form.setAppName(MasterConstant.BACKEND_APP);
            form.setQueueName(notificationQueue);
            form.setCmd(MasterConstant.CMD_LOCK_DEVICE);
            form.setData(request);
            rabbitService.handleSendMsg(form);
        }
    }

    public void sendMessageLockLocation(Location location) {
        Account account = location.getCustomer().getAccount();
        String tenantName = location.getTenantId();
        sendMessageLockCustomer(account.getUsername(), tenantName);
        sendMessageLockAccountsByTenantId(RedisConstant.KEY_EMPLOYEE, tenantName);
        sendMessageLockAccountsByTenantId(RedisConstant.KEY_MOBILE, tenantName);
    }

    public void sendMessageLockAccountByGroup(Group group) {
        if (MasterConstant.USER_KIND_EMPLOYEE.equals(group.getKind())) {
            List<String> tenantNames = locationRepository.findAllDistinctTenantId();
            tenantNames.forEach(tenant -> {
                sendMessageLockAccountsByTenantId(RedisConstant.KEY_EMPLOYEE, tenant);
                sendMessageLockAccountsByTenantId(RedisConstant.KEY_MOBILE, tenant);
            });
        } else {
            List<Account> accounts = accountRepository.findAllByGroupId(group.getId());
            accounts.forEach(account -> {
                String username = account.getUsername();
                if (MasterConstant.USER_KIND_CUSTOMER.equals(account.getKind())) {
                    sendMessageLockCustomer(username);
                } else {
                    sendMessageLockAdmin(username);
                }
            });
        }
    }
}
