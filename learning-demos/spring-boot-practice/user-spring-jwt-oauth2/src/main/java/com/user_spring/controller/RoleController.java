package com.user_spring.controller;

import com.user_spring.dto.request.PermissionRequest;
import com.user_spring.dto.request.RoleRequest;
import com.user_spring.dto.response.ApiResponse;
import com.user_spring.dto.response.PermissionResponse;
import com.user_spring.dto.response.RoleResponse;
import com.user_spring.service.PermissionService;
import com.user_spring.service.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/roles")
@Tag(name = "Role Controller")
public class RoleController {
    RoleService roleService;

    @PostMapping
    public ApiResponse<?> createRole(@Valid @RequestBody RoleRequest request) {
        RoleResponse response = roleService.createRole(request);
        return ApiResponse.builder()
                .status(HttpStatus.CREATED.value())
                .message("Role created successfully")
                .data(response)
                .build();
    }

    @GetMapping
    public ApiResponse<?> getRoles() {
        return ApiResponse.builder()
                .status(HttpStatus.OK.value())
                .data(roleService.getRoles())
                .build();
    }

    @DeleteMapping("/{name}")
    public ApiResponse<?> deleteUser(@PathVariable("name") String id) {
        roleService.deleteRole(id);
        return ApiResponse.<String>builder()
                .message("Role deleted successfully")
                .status(HttpStatus.NO_CONTENT.value())
                .build();
    }
}
