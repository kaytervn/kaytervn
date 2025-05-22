package com.user_spring.service;

import com.user_spring.dto.request.PermissionRequest;
import com.user_spring.dto.response.PermissionResponse;
import com.user_spring.entity.Permission;
import com.user_spring.exception.AppException;
import com.user_spring.exception.message.ErrorMessage;
import com.user_spring.mapper.PermissionMapper;
import com.user_spring.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    public PermissionResponse createPermission(PermissionRequest request) {
        Permission permission = permissionMapper.toPermission(request);
        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    public List<PermissionResponse> getPermissions() {
        return permissionMapper.toPermissionResponseList(permissionRepository.findAll());
    }

    public void deletePermission(String name) {
        Permission permission = permissionRepository.findById(name.toUpperCase())
                .orElseThrow(() -> new AppException(Permission.class, ErrorMessage.ENTITY_NOT_FOUND));
        permissionRepository.deleteById(permission.getName());
    }
}
