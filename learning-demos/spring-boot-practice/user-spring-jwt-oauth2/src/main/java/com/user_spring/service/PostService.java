package com.user_spring.service;

import com.user_spring.dto.request.PostCreationRequest;
import com.user_spring.dto.request.PostUpdateRequest;
import com.user_spring.dto.response.PostResponse;
import com.user_spring.entity.Post;
import com.user_spring.entity.User;
import com.user_spring.exception.AppException;
import com.user_spring.exception.message.ErrorMessage;
import com.user_spring.mapper.PostMapper;
import com.user_spring.repository.PostRepository;
import com.user_spring.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    UserRepository userRepository;
    PostMapper postMapper;
    UserService userService;

    @PreAuthorize("hasAuthority('CREATE_POST')")
    public PostResponse createPost(PostCreationRequest request) {
        User user = userService.getCurrentUser();
        Post post = postMapper.toPost(request);
        post.setUser(user);
        return postMapper.toPostResponse(postRepository.save(post));
    }

    public List<PostResponse> getPosts() {
        return postMapper.toPostResponseList(postRepository.findAll());
    }

    public List<PostResponse> getMyPosts(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(User.class, ErrorMessage.ENTITY_NOT_FOUND));
        List<Post> posts = postRepository.findByUserId(user.getId());
        return postMapper.toPostResponseList(posts);
    }

    public PostResponse getPost(String id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new AppException(Post.class, ErrorMessage.ENTITY_NOT_FOUND));
        return postMapper.toPostResponse(post);
    }

    public PostResponse updatePost(String id, PostUpdateRequest request) {
        Post post = postRepository.findById(id).orElseThrow(() -> new AppException(Post.class, ErrorMessage.ENTITY_NOT_FOUND));
        postMapper.updatePostFromDto(post, request);
        return postMapper.toPostResponse(postRepository.save(post));
    }

    public void deletePost(String id) {
        postRepository.findById(id).orElseThrow(() -> new AppException(Post.class, ErrorMessage.ENTITY_NOT_FOUND));
        postRepository.deleteById(id);
    }
}
