package com.base.auth.dto.news;


import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class NewsAutoCompleteDto {
    @ApiModelProperty(name = "id")
    private Long id;

    @ApiModelProperty(name = "status")
    private Integer status;

    @ApiModelProperty(name = "title")
    private String title;

    @ApiModelProperty(name = "content")
    private String content;

    @ApiModelProperty(name = "avatar")
    private String avatar;

    @ApiModelProperty(name = "banner")
    private String banner;

    @ApiModelProperty(name = "description")
    private String description;

    @ApiModelProperty(name = "pinTop")
    private Integer pinTop;
}
