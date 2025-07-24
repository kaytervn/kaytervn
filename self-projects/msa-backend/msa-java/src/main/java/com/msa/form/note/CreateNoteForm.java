package com.msa.form.note;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateNoteForm {
    @NotBlank(message = "name cannot be blank")
    @ApiModelProperty(required = true)
    private String name;
    @NotBlank(message = "note cannot be blank")
    @ApiModelProperty(required = true)
    private String note;
    private Long tagId;
}
