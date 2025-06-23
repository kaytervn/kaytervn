package com.tenant.cache;

import com.tenant.cache.dto.CacheKeyDto;
import com.tenant.constant.FinanceConstant;
import com.tenant.constant.SecurityConstant;
import com.tenant.dto.account.AccountAdminDto;
import com.tenant.multitenancy.tenant.TenantDBContext;
import com.tenant.rabbit.RabbitService;
import com.tenant.rabbit.form.LockAccountRequest;
import com.tenant.rabbit.form.ProcessTenantForm;
import com.tenant.storage.tenant.model.Account;
import com.tenant.storage.tenant.model.Group;
import com.tenant.storage.tenant.repository.AccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

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
    private AccountRepository accountRepository;

    public void mappingLastLoginForListAccounts(List<AccountAdminDto> accounts) {
        if (accounts == null || accounts.isEmpty()) {
            return;
        }

        Map<String, AccountAdminDto> keyToAccountMap = new HashMap<>(accounts.size() * 2);
        Map<Long, Date> accountIdToLatestLogin = new HashMap<>();

        for (AccountAdminDto account : accounts) {
            String keyEmp = cacheClientService.getKeyString(CacheConstant.KEY_EMPLOYEE, account.getUsername(), TenantDBContext.getCurrentTenant());
            String keyMob = cacheClientService.getKeyString(CacheConstant.KEY_MOBILE, account.getUsername(), TenantDBContext.getCurrentTenant());

            keyToAccountMap.put(keyEmp, account);
            keyToAccountMap.put(keyMob, account);

            accountIdToLatestLogin.put(account.getId(), account.getLastLogin());
        }

        List<CacheKeyDto> dtos = cacheClientService.getMultiKeys(new ArrayList<>(keyToAccountMap.keySet()));
        if (dtos == null || dtos.isEmpty()) {
            return;
        }

        for (CacheKeyDto cacheDto : dtos) {
            if (cacheDto.getKey() == null || cacheDto.getTime() == null) {
                continue;
            }

            AccountAdminDto account = keyToAccountMap.get(cacheDto.getKey());
            if (account == null) {
                continue;
            }

            Long accountId = account.getId();
            Date latestLogin = accountIdToLatestLogin.get(accountId);
            if (latestLogin == null || cacheDto.getTime().after(latestLogin)) {
                accountIdToLatestLogin.put(accountId, cacheDto.getTime());
            }
        }

        for (AccountAdminDto account : accounts) {
            Date updatedLogin = accountIdToLatestLogin.get(account.getId());
            if (updatedLogin != null) {
                account.setLastLogin(updatedLogin);
            }
        }
    }

    public Date getLastLoginByAccount(Account account) {
        if (account == null) {
            return null;
        }

        String keyEmp = cacheClientService.getKeyString(CacheConstant.KEY_EMPLOYEE, account.getUsername(), TenantDBContext.getCurrentTenant());
        String keyMob = cacheClientService.getKeyString(CacheConstant.KEY_MOBILE, account.getUsername(), TenantDBContext.getCurrentTenant());

        List<CacheKeyDto> dtos = cacheClientService.getMultiKeys(List.of(keyEmp, keyMob));
        Date latestLogin = account.getLastLogin();

        if (dtos != null && !dtos.isEmpty()) {
            for (CacheKeyDto dto : dtos) {
                if (dto != null && dto.getTime() != null) {
                    if (latestLogin == null || dto.getTime().after(latestLogin)) {
                        latestLogin = dto.getTime();
                    }
                }
            }
        }

        return latestLogin;
    }

    public void sendMessageLockAccount(Integer keyType, String username) {
        String tenantName = TenantDBContext.getCurrentTenant();
        LockAccountRequest request = new LockAccountRequest();
        request.setApp(FinanceConstant.APP_MASTER);
        request.setKeyType(keyType);
        request.setUsername(username);
        request.setUserKind(SecurityConstant.USER_KIND_EMPLOYEE);
        request.setTenantName(tenantName);

        String key = cacheClientService.getKeyString(keyType, username, tenantName);
        CacheKeyDto dto = cacheClientService.removeKey(key);
        if (dto != null) {
            ProcessTenantForm<LockAccountRequest> form = new ProcessTenantForm<>();
            form.setAppName(FinanceConstant.BACKEND_APP);
            form.setQueueName(notificationQueue);
            form.setCmd(FinanceConstant.CMD_LOCK_DEVICE);
            form.setData(request);
            rabbitService.handleSendMsg(form);
        }
    }

    public void sendMessageLockAccountByGroup(Group group) {
        List<Account> accounts = accountRepository.findAllByGroupId(group.getId());
        accounts.forEach(account -> {
            sendMessageLockAccount(CacheConstant.KEY_EMPLOYEE, account.getUsername());
            sendMessageLockAccount(CacheConstant.KEY_MOBILE, account.getUsername());
        });
    }
}

