package com.user_spring.controller;

import com.user_spring.dto.request.PostCreationRequest;
import com.user_spring.dto.request.PostUpdateRequest;
import com.user_spring.dto.response.ApiResponse;
import com.user_spring.dto.response.PostResponse;
import com.user_spring.service.PostService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Post Controller")
public class PostController {
    PostService postService;

    @PostMapping
    public ApiResponse<?> createUser(@RequestBody @Valid PostCreationRequest request) {
        PostResponse postResponse = postService.createPost(request);
        return ApiResponse.<PostResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Post created successfully")
                .data(postResponse)
                .build();
    }

    @GetMapping
    public ApiResponse<?> getPosts() {
        return ApiResponse.<List<PostResponse>>builder()
                .status(HttpStatus.OK.value())
                .data(postService.getPosts())
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<?> getPostsByUserId(@PathVariable String userId) {
        return ApiResponse.<List<PostResponse>>builder()
                .status(HttpStatus.OK.value())
                .data(postService.getMyPosts(userId))
                .build();
    }

    @GetMapping("/{postId}")
    public ApiResponse<?> getPost(@PathVariable("postId") String id) {
        return ApiResponse.<PostResponse>builder()
                .status(HttpStatus.OK.value())
                .data(postService.getPost(id))
                .build();
    }

    @PutMapping("/{postId}")
    public ApiResponse<?> updateUser(@PathVariable("postId") String id,
                                     @Valid @RequestBody PostUpdateRequest request) {
        return ApiResponse.<PostResponse>builder()
                .data(postService.updatePost(id, request))
                .message("Post updated successfully")
                .status(HttpStatus.ACCEPTED.value())
                .build();
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<?> deleteUser(@PathVariable("postId") String id) {
        postService.deletePost(id);
        return ApiResponse.<String>builder()
                .message("Post deleted successfully")
                .status(HttpStatus.NO_CONTENT.value())
                .build();
    }
}
