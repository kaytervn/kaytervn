package com.base.auth.controller;

import com.base.auth.dto.ApiMessageDto;
import com.base.auth.dto.ErrorCode;
import com.base.auth.dto.ResponseListDto;
import com.base.auth.dto.comment.CommentDto;
import com.base.auth.exception.BadRequestException;
import com.base.auth.form.comment.CreateCommentForm;
import com.base.auth.form.comment.UpdateCommentForm;
import com.base.auth.mapper.CommentMapper;
import com.base.auth.model.Comment;
import com.base.auth.model.News;
import com.base.auth.model.User;
import com.base.auth.model.criteria.CommentCriteria;
import com.base.auth.repository.CommentRepository;
import com.base.auth.repository.NewsRepository;
import com.base.auth.repository.UserRepository;
import lombok.AccessLevel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/v1/comment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CommentController extends ABasicController {

    CommentRepository commentRepository;
    NewsRepository newsRepository;
    CommentMapper commentMapper;
    UserRepository userRepository;

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('COMMENT_L')")
    public ApiMessageDto<ResponseListDto<List<CommentDto>>> list(CommentCriteria commentCriteria, Pageable pageable) {
        ApiMessageDto<ResponseListDto<List<CommentDto>>> responseListObjApiMessageDto = new ApiMessageDto<>();
        Page<Comment> listComment = commentRepository.findAll(commentCriteria.getSpecification(), pageable);
        ResponseListDto<List<CommentDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(commentMapper.fromEntityToCommentDtoList(listComment.getContent()));
        responseListObj.setTotalPages(listComment.getTotalPages());
        responseListObj.setTotalElements(listComment.getTotalElements());

        responseListObjApiMessageDto.setData(responseListObj);
        responseListObjApiMessageDto.setMessage("Get list success");
        return responseListObjApiMessageDto;
    }

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('COMMENT_V')")
    public ApiMessageDto<CommentDto> get(@PathVariable("id") Long id) {
        ApiMessageDto<CommentDto> apiMessageDto = new ApiMessageDto<>();
        Comment existingComment = commentRepository.findById(id).orElse(null);
        if (existingComment == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.COMMENT_ERROR_NOT_FOUND);
            return apiMessageDto;
        }
        apiMessageDto.setData(commentMapper.fromEntityToCommentDto(existingComment));
        apiMessageDto.setResult(true);
        apiMessageDto.setMessage("Get comment success.");
        return apiMessageDto;
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('COMMENT_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateCommentForm createCommentForm, BindingResult bindingResult) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        News news = newsRepository.findById(createCommentForm.getNewsId()).orElse(null);
        if (news == null) {
            throw new BadRequestException(ErrorCode.NEWS_ERROR_NOT_FOUND);
        }

        User user = userRepository.findByAccountId(getCurrentUser()).orElse(null);
        if (user == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND);
        }

        Comment comment = commentMapper.fromCreateCommentFormToEntity(createCommentForm);
        comment.setNews(news);
        comment.setUser(user);
        commentRepository.save(comment);
        apiMessageDto.setMessage("Create comment success");
        return apiMessageDto;
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('COMMENT_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateCommentForm updateCommentForm, BindingResult bindingResult) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        Comment existingComment = commentRepository.findById(updateCommentForm.getId()).orElse(null);
        if (existingComment == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.COMMENT_ERROR_NOT_FOUND);
            return apiMessageDto;
        }

        News news = newsRepository.findById(updateCommentForm.getNewsId()).orElse(null);
        if (news == null) {
            throw new BadRequestException(ErrorCode.NEWS_ERROR_NOT_FOUND);
        }

        User user = userRepository.findByAccountId(getCurrentUser()).orElse(null);
        if (user == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND);
        }

        if (!Objects.equals(user.getId(), existingComment.getUser().getId())) {
            throw new BadRequestException("Not Allowed to Update");
        }

        commentMapper.updateCommentFromUpdateCommentForm(updateCommentForm, existingComment);
        existingComment.setNews(news);
        existingComment.setUser(user);
        commentRepository.save(existingComment);
        apiMessageDto.setResult(true);
        apiMessageDto.setMessage("Update comment success");
        return apiMessageDto;
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('COMMENT_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        Comment existingComment = commentRepository.findById(id).orElse(null);
        if (existingComment == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.COMMENT_ERROR_NOT_FOUND);
            return apiMessageDto;
        }
        commentRepository.delete(existingComment);
        apiMessageDto.setMessage("Delete comment success");
        return apiMessageDto;
    }
}
