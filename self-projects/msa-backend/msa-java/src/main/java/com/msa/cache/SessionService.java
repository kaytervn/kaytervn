package com.msa.cache;

import com.msa.cache.dto.SessionDto;
import com.msa.constant.AppConstant;
import com.msa.constant.SecurityConstant;
import com.msa.socket.SocketService;
import com.msa.socket.dto.LockDeviceRequest;
import com.msa.socket.dto.MessageDto;
import com.msa.storage.master.model.User;
import com.msa.storage.master.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class SessionService {
    private static final String PREFIX_KEY_ADMIN = "adm:";
    private static final String PREFIX_KEY_USER = "usr:";
    @Autowired
    @Lazy
    private SocketService socketService;
    @Autowired
    private UserRepository userRepository;

    public String getKeyString(Integer userKind, String username) {
        if (SecurityConstant.USER_KIND_ADMIN.equals(userKind)) {
            return PREFIX_KEY_ADMIN + userKind + ":" + username;
        } else {
            return PREFIX_KEY_USER + userKind + ":" + username;
        }
    }

    public void putKey(String key, String session) {
        SessionDto value = new SessionDto(session);
        CacheManager.getCache().put(key, value);
    }

    public SessionDto getKey(String key) {
        return CacheManager.getCache().get(key);
    }

    public void removeKey(String key) {
        CacheManager.getCache().remove(key);
    }

    public boolean isValidSession(String key, String session) {
        try {
            SessionDto value = getKey(key);
            return value != null && session.equals(value.getSession());
        } catch (Exception e) {
            return false;
        }
    }

    public void putPublicKey(String key, String publicKey) {
        try {
            SessionDto existing = getKey(key);
            if (existing == null) return;
            existing.setPublicKey(publicKey);
            CacheManager.getCache().putWithoutTTLUpdate(key, existing);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    public void updateLastLogin(String username) {
        User user = userRepository.findFirstByUsername(username).orElse(null);
        if (user != null) {
            user.setLastLogin(new Date());
            userRepository.save(user);
        }
    }

    @Async
    public void sendMessageLockUser(Integer userKind, String username) {
        String key = getKeyString(userKind, username);
        SessionDto dto = getKey(key);
        if (dto == null) {
            return;
        }
        LockDeviceRequest request = new LockDeviceRequest();
        request.setUsername(username);
        request.setUserKind(userKind);
        MessageDto message = new MessageDto();
        message.setCmd(AppConstant.CMD_LOCK_DEVICE);
        message.setData(request);
        removeKey(key);
        socketService.handleLockDevice(message);
    }

    public void sendMessageLockUsersByGroupId(Long groupId) {
        List<User> users = userRepository.findAllByGroupId(groupId);
        users.forEach(user -> sendMessageLockUser(user.getKind(), user.getUsername()));
    }
}
