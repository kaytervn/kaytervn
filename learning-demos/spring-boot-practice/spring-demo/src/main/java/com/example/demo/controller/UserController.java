package com.example.demo.controller;

import com.example.demo.configuration.locale.MessageUtil;
import com.example.demo.dto.request.RegisterRequest;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Locale;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "User Controller")
@Slf4j
public class UserController {
    UserService userService;

    @PostMapping
    public ApiResponse<?> createUser(@RequestBody @Valid UserCreationRequest request) {
        UserResponse userResponse = userService.createUser(request);
        return ApiResponse.<UserResponse>builder()
                .timestamp(new Date())
                .status(HttpStatus.CREATED.value())
                .reasonPhrase(HttpStatus.CREATED.getReasonPhrase())
                .message(MessageUtil.getMessage("user.success.create"))
                .data(userResponse)
                .build();
    }

    @GetMapping
    public ApiResponse<?> getUsers(
            @Min(value = 0, message = "validation.param") @RequestParam(defaultValue = "0", required = false) int pageNo,
            @Min(value = 1, message = "validation.param") @RequestParam(defaultValue = "20", required = false) int pageSize,
            @RequestParam(defaultValue = "", required = false) String... sorts
    ) {
        return ApiResponse.builder()
                .timestamp(new Date())
                .status(HttpStatus.OK.value())
                .reasonPhrase(HttpStatus.OK.getReasonPhrase())
                .data(userService.getUsers(pageNo, pageSize, sorts))
                .build();
    }

    @GetMapping("/advance")
    public ApiResponse<?> getUsersAdvance(
            Pageable pageable,
            @RequestParam(defaultValue = "", required = false) String[] user,
            @RequestParam(defaultValue = "", required = false) String[] role
    ) {
        return ApiResponse.builder()
                .timestamp(new Date())
                .status(HttpStatus.OK.value())
                .reasonPhrase(HttpStatus.OK.getReasonPhrase())
                .data(userService.getUsersAdvance(pageable, user, role))
                .build();
    }

    @GetMapping("/user-roles")
    public ApiResponse<?> getUserRoles(
            Pageable pageable,
            @RequestParam(defaultValue = "", required = false) String search
    ) {
        return ApiResponse.builder()
                .timestamp(new Date())
                .status(HttpStatus.OK.value())
                .reasonPhrase(HttpStatus.OK.getReasonPhrase())
                .data(userService.getUserRoles(pageable, search))
                .build();
    }

    @GetMapping("/{userId}")
    public ApiResponse<?> getUser(@PathVariable("userId") String id) {
        return ApiResponse.<UserResponse>builder()
                .timestamp(new Date())
                .status(HttpStatus.OK.value())
                .reasonPhrase(HttpStatus.OK.getReasonPhrase())
                .data(userService.getUser(id))
                .build();
    }

    @GetMapping("/my-infor")
    public ApiResponse<?> getMyInfo() {
        return ApiResponse.builder()
                .timestamp(new Date())
                .status(HttpStatus.OK.value())
                .reasonPhrase(HttpStatus.OK.getReasonPhrase())
                .data(userService.getMyInfo())
                .build();
    }

    @PutMapping("/{userId}")
    public ApiResponse<?> updateUser(@PathVariable("userId") String id,
                                     @Valid @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .timestamp(new Date())
                .data(userService.updateUser(id, request))
                .reasonPhrase(HttpStatus.ACCEPTED.getReasonPhrase())
                .message(MessageUtil.getMessage("user.success.update"))
                .status(HttpStatus.ACCEPTED.value())
                .build();
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<?> deleteUser(@PathVariable("userId") String id) {
        userService.deleteUser(id);
        return ApiResponse.<String>builder()
                .timestamp(new Date())
                .reasonPhrase(HttpStatus.NO_CONTENT.getReasonPhrase())
                .message(MessageUtil.getMessage("user.success.delete"))
                .status(HttpStatus.NO_CONTENT.value())
                .build();
    }
}
