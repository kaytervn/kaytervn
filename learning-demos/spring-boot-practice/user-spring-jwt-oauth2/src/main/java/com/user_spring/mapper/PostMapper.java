package com.user_spring.mapper;

import com.user_spring.dto.request.PostCreationRequest;
import com.user_spring.dto.request.PostUpdateRequest;
import com.user_spring.dto.response.PostResponse;
import com.user_spring.entity.Post;
import com.user_spring.repository.UserRepository;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface PostMapper {
    Post toPost(PostCreationRequest request);

    void updatePostFromDto(@MappingTarget Post post, PostUpdateRequest request);

    @Mapping(target = "user", qualifiedByName = "userToUserResponse")
    PostResponse toPostResponse(Post post);

    List<PostResponse> toPostResponseList(List<Post> posts);
}
