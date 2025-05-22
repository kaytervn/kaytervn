package com.base.auth.mapper;

import com.base.auth.dto.comment.CommentDto;
import com.base.auth.form.comment.CreateCommentForm;
import com.base.auth.form.comment.UpdateCommentForm;
import com.base.auth.model.Comment;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {UserMapper.class})
public interface CommentMapper {

    @Named("fromEntityToCommentDto")
    @Mapping(target = "user", qualifiedByName = "fromUserToDtoAutoComplete")
    CommentDto fromEntityToCommentDto(Comment comment);

    @IterableMapping(elementTargetType = CommentDto.class, qualifiedByName = "fromEntityToCommentDto")
    List<CommentDto> fromEntityToCommentDtoList(List<Comment> comments);

    @Mapping(source = "newsId", target = "news.id")
    @Mapping(source = "content", target = "content")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromCreateCommentFormToEntity")
    Comment fromCreateCommentFormToEntity(CreateCommentForm createCommentForm);

    @Mapping(source = "newsId", target = "news.id")
    @Mapping(source = "content", target = "content")
    @BeanMapping(ignoreByDefault = true)
    @Named("updateCommentFromUpdateCommentForm")
    void updateCommentFromUpdateCommentForm(UpdateCommentForm updateCommentForm, @MappingTarget Comment comment);
}