package com.example.demo.mapper;

import com.example.demo.dto.request.PostRequest;
import com.example.demo.dto.response.PostResponse;
import com.example.demo.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface PostMapper {
    Post toPost(PostRequest request);

    void updatePostFromDto(@MappingTarget Post post, PostRequest request);

    @Mapping(target = "user", qualifiedByName = "userToUserResponseWithoutRole")
    PostResponse toPostResponse(Post post);

    List<PostResponse> toPostResponseList(List<Post> posts);
}
