package com.base.auth.form.news;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;


@Data
@ApiModel
public class UpdateNewsForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(required = true)
    private Long id;

    @NotNull(message = "categoryId cannot be null")
    @ApiModelProperty(required = true)
    private Long categoryId;

    @NotEmpty(message = "title can not empty")
    @ApiModelProperty(required = true)
    private String title;

    @NotEmpty(message = "content can not empty")
    @ApiModelProperty(required = true)
    private String content;

    @ApiModelProperty(name = "avatar")
    private String avatar;

    @ApiModelProperty(name = "banner")
    private String banner;

    @ApiModelProperty(name = "description", required = true)
    @NotEmpty(message = "description can not empty")
    private String description;

    @ApiModelProperty(name = "status", required = true)
    @NotNull(message = "status can not null")
    private Integer status;

    @ApiModelProperty(name = "pinTop")
    private Integer pinTop;
}
