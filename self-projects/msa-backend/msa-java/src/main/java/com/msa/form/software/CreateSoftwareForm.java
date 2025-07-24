package com.msa.form.software;

import com.msa.validation.UrlConstraint;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateSoftwareForm {
    @NotBlank(message = "name cannot be blank")
    @ApiModelProperty(required = true)
    private String name;
    @UrlConstraint
    private String link;
    private String note;
    private Long tagId;
}
