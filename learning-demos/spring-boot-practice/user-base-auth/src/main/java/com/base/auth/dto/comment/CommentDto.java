package com.base.auth.dto.comment;

import com.base.auth.dto.ABasicAdminDto;
import com.base.auth.dto.news.NewsAutoCompleteDto;
import com.base.auth.dto.user.UserAutoCompleteDto;
import lombok.Data;


@Data
public class CommentDto extends ABasicAdminDto {
    NewsAutoCompleteDto news;
    UserAutoCompleteDto user;
    String content;
}