package com.msa.form.link;

import com.msa.validation.UrlConstraint;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateLinkForm {
    @NotBlank(message = "name cannot be blank")
    @ApiModelProperty(required = true)
    private String name;
    @UrlConstraint(allowNull = false)
    @ApiModelProperty(required = true)
    private String link;
    private String note;
    private Long tagId;
}
