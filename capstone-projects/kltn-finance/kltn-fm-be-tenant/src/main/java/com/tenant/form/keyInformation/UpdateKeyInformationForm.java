package com.tenant.form.keyInformation;

import com.tenant.validation.KeyInformationKind;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class UpdateKeyInformationForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @NotNull(message = "kind cannot be null")
    @KeyInformationKind
    @ApiModelProperty(name = "kind", required = true)
    private Integer kind;
    @ApiModelProperty(name = "description")
    private String description;
    @ApiModelProperty(name = "document")
    private String document;
    @ApiModelProperty(name = "additionalInformation")
    private String additionalInformation;
    @NotNull(message = "keyInformationGroupId cannot be null")
    @ApiModelProperty(name = "keyInformationGroupId", required = true)
    private Long keyInformationGroupId;
    @ApiModelProperty(name = "organizationId")
    private Long organizationId;
    @ApiModelProperty(name = "tagId")
    private Long tagId;
}
