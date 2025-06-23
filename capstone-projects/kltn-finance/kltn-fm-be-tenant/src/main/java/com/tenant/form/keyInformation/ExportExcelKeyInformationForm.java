package com.tenant.form.keyInformation;

import com.tenant.validation.KeyInformationKind;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ExportExcelKeyInformationForm {
    @NotNull(message = "keyInformationIds cannot be null")
    @ApiModelProperty(name = "keyInformationIds", required = true)
    private List<Long> keyInformationIds;
    @NotNull(message = "kind cannot be null")
    @ApiModelProperty(name = "kind", required = true)
    @KeyInformationKind
    private Integer kind;
}

