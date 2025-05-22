package com.user_spring.controller;

import com.user_spring.dto.request.PermissionRequest;
import com.user_spring.dto.response.ApiResponse;
import com.user_spring.dto.response.PermissionResponse;
import com.user_spring.dto.response.UserResponse;
import com.user_spring.service.PermissionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/permissions")
@Tag(name = "Permission Controller")
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
    public ApiResponse<?> createPermission(@Valid @RequestBody PermissionRequest request) {
        PermissionResponse response = permissionService.createPermission(request);
        return ApiResponse.builder()
                .status(HttpStatus.CREATED.value())
                .message("Permission created successfully")
                .data(response)
                .build();
    }

    @GetMapping
    public ApiResponse<?> getPermissions() {
        return ApiResponse.builder()
                .status(HttpStatus.OK.value())
                .data(permissionService.getPermissions())
                .build();
    }

    @DeleteMapping("/{name}")
    public ApiResponse<?> deleteUser(@PathVariable("name") String id) {
        permissionService.deletePermission(id);
        return ApiResponse.<String>builder()
                .message("Permission deleted successfully")
                .status(HttpStatus.NO_CONTENT.value())
                .build();
    }
}
