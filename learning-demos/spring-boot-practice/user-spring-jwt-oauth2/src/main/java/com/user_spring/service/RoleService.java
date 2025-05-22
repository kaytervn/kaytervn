package com.user_spring.service;

import com.user_spring.dto.request.RoleRequest;
import com.user_spring.dto.response.RoleResponse;
import com.user_spring.entity.Role;
import com.user_spring.exception.AppException;
import com.user_spring.exception.message.ErrorMessage;
import com.user_spring.mapper.RoleMapper;
import com.user_spring.repository.PermissionRepository;
import com.user_spring.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;
    PermissionRepository permissionRepository;

    public RoleResponse createRole(RoleRequest request) {
        Role role = roleMapper.toRole(request);
        var permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));
        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    public List<RoleResponse> getRoles() {
        return roleMapper.toRoleResponseList(roleRepository.findAll());
    }

    public void deleteRole(String name) {
        Role role = roleRepository.findById(name.toUpperCase())
                .orElseThrow(() -> new AppException(Role.class, ErrorMessage.ENTITY_NOT_FOUND));
        roleRepository.deleteById(role.getName());
    }
}
