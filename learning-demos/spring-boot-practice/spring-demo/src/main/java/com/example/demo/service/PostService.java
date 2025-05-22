package com.example.demo.service;

import com.example.demo.dto.request.PostRequest;
import com.example.demo.dto.response.PostResponse;
import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.mapper.PostMapper;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    PostMapper postMapper;
    UserService userService;

    public PostResponse createPost(PostRequest request) {
        User user = userService.getCurrentUser();
        Post post = postMapper.toPost(request);
        post.setUser(user);
        return postMapper.toPostResponse(postRepository.save(post));
    }

    public List<PostResponse> getPosts() {
        return postMapper.toPostResponseList(postRepository.findAll());
    }

    public List<PostResponse> getMyPosts() {
        User user = userService.getCurrentUser();
        List<Post> posts = postRepository.findByUserId(user.getId());
        return postMapper.toPostResponseList(posts);
    }

    public PostResponse getPost(String id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new AppException("post.error.not-found", HttpStatus.NOT_FOUND));
        return postMapper.toPostResponse(post);
    }

    public PostResponse updatePost(String id, PostRequest request) {
        Post post = postRepository.findById(id).orElseThrow(() -> new AppException("post.error.not-found", HttpStatus.NOT_FOUND));
        User user = userService.getCurrentUser();
        if (!Objects.equals(user.getId(), post.getUser().getId())) {
            throw new AppException("post.update.unauthorized", HttpStatus.UNAUTHORIZED);
        }
        postMapper.updatePostFromDto(post, request);
        return postMapper.toPostResponse(postRepository.save(post));
    }

    public void deletePost(String id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new AppException("post.error.not-found", HttpStatus.NOT_FOUND));
        postRepository.deleteById(id);
    }
}
