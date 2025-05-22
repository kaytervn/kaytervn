package com.example.demo.controller;

import com.example.demo.configuration.locale.MessageUtil;
import com.example.demo.dto.request.PostRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.PostResponse;
import com.example.demo.service.PostService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Post Controller")
public class PostController {
    PostService postService;

    @PostMapping
    public ApiResponse<?> createPost(@RequestBody @Valid PostRequest request) {
        PostResponse postResponse = postService.createPost(request);
        return ApiResponse.<PostResponse>builder()
                .status(HttpStatus.CREATED.value())
                .timestamp(new Date())
                .reasonPhrase(HttpStatus.CREATED.getReasonPhrase())
                .message(MessageUtil.getMessage("post.success.create"))
                .data(postResponse)
                .build();
    }

    @GetMapping
    public ApiResponse<?> getPosts() throws InterruptedException {
        return ApiResponse.<List<PostResponse>>builder()
                .timestamp(new Date())
                .status(HttpStatus.OK.value())
                .reasonPhrase(HttpStatus.OK.getReasonPhrase())
                .data(postService.getPosts())
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<?> getPostsByUserId(@PathVariable String userId) {
        return ApiResponse.<List<PostResponse>>builder()
                .timestamp(new Date())
                .status(HttpStatus.OK.value())
                .reasonPhrase(HttpStatus.OK.getReasonPhrase())
                .data(postService.getMyPosts())
                .build();
    }

    @GetMapping("/{postId}")
    public ApiResponse<?> getPost(@PathVariable("postId") String id) {
        return ApiResponse.<PostResponse>builder()
                .timestamp(new Date())
                .status(HttpStatus.OK.value())
                .reasonPhrase(HttpStatus.OK.getReasonPhrase())
                .data(postService.getPost(id))
                .build();
    }

    @PutMapping("/{postId}")
    public ApiResponse<?> updatePost(@PathVariable("postId") String id,
                                     @Valid @RequestBody PostRequest request) {
        return ApiResponse.<PostResponse>builder()
                .timestamp(new Date())
                .data(postService.updatePost(id, request))
                .message(MessageUtil.getMessage("post.success.update"))
                .status(HttpStatus.ACCEPTED.value())
                .reasonPhrase(HttpStatus.ACCEPTED.getReasonPhrase())
                .build();
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<?> deletePost(@PathVariable("postId") String id) {
        postService.deletePost(id);
        return ApiResponse.<String>builder()
                .timestamp(new Date())
                .message(MessageUtil.getMessage("post.success.delete"))
                .status(HttpStatus.NO_CONTENT.value())
                .reasonPhrase(HttpStatus.NO_CONTENT.getReasonPhrase())
                .build();
    }
}
