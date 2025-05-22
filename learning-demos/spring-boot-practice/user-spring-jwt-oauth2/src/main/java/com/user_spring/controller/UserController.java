package com.user_spring.controller;

import com.user_spring.dto.request.UserCreationRequest;
import com.user_spring.dto.request.UserUpdateRequest;
import com.user_spring.dto.response.ApiResponse;
import com.user_spring.dto.response.UserResponse;
import com.user_spring.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "User Controller")
public class UserController {
    UserService userService;

    @PostMapping
    public ApiResponse<?> createUser(@RequestBody @Valid UserCreationRequest request) {
        UserResponse userResponse = userService.createUser(request);
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("User created successfully")
                .data(userResponse)
                .build();
    }

    @GetMapping
    public ApiResponse<?> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .status(HttpStatus.OK.value())
                .data(userService.getUsers())
                .build();
    }

    @GetMapping("/{userId}")
    public ApiResponse<?> getUser(@PathVariable("userId") String id) {
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.OK.value())
                .data(userService.getUser(id))
                .build();
    }

    @GetMapping("/my-infor")
    public ApiResponse<?> getMyInfor() {
        return ApiResponse.builder()
                .status(HttpStatus.OK.value())
                .data(userService.getMyInfor())
                .build();
    }

    @PutMapping("/{userId}")
    public ApiResponse<?> updateUser(@PathVariable("userId") String id,
                                     @Valid @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .data(userService.updateUser(id, request))
                .message("User updated successfully")
                .status(HttpStatus.ACCEPTED.value())
                .build();
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<?> deleteUser(@PathVariable("userId") String id) {
        userService.deleteUser(id);
        return ApiResponse.<String>builder()
                .message("User deleted successfully")
                .status(HttpStatus.NO_CONTENT.value())
                .build();
    }

}
