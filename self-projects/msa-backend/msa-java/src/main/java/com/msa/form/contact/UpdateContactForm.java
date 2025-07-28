package com.msa.form.contact;

import com.msa.constant.AppConstant;
import com.msa.validation.PatternConstraint;
import com.msa.validation.ValidJsonField;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class UpdateContactForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(required = true)
    private Long id;
    @NotBlank(message = "name cannot be blank")
    @ApiModelProperty(required = true)
    private String name;
    @PatternConstraint(pattern = AppConstant.PHONE_PATTERN)
    @ApiModelProperty(required = true)
    private String phone;
    @ValidJsonField(classType = List.class, type = AppConstant.JSON_TYPE_LIST_OBJECT, allowNull = true)
    @ApiModelProperty(required = true)
    private String phones;
    private String note;
    private Long tagId;
}
