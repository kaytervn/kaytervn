package com.example.demo.controller;

import com.example.demo.configuration.locale.MessageUtil;
import com.example.demo.dto.request.PermissionRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.PermissionResponse;
import com.example.demo.service.PermissionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

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
                .timestamp(new Date())
                .status(HttpStatus.CREATED.value())
                .reasonPhrase(HttpStatus.CREATED.getReasonPhrase())
                .message(MessageUtil.getMessage("permission.success.create"))
                .data(response)
                .build();
    }

    @GetMapping
    public ApiResponse<?> getPermissions() {
        return ApiResponse.builder()
                .timestamp(new Date())
                .status(HttpStatus.OK.value())
                .reasonPhrase(HttpStatus.OK.getReasonPhrase())
                .data(permissionService.getPermissions())
                .build();
    }

    @DeleteMapping("/{name}")
    public ApiResponse<?> deletePermission(@PathVariable("name") String id) {
        permissionService.deletePermission(id);
        return ApiResponse.<String>builder()
                .timestamp(new Date())
                .reasonPhrase(HttpStatus.NO_CONTENT.getReasonPhrase())
                .message(MessageUtil.getMessage("permission.success.delete"))
                .status(HttpStatus.NO_CONTENT.value())
                .build();
    }
}
