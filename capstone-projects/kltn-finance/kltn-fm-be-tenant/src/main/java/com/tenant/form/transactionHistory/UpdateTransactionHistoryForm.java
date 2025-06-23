package com.tenant.form.transactionHistory;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UpdateTransactionHistoryForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @ApiModelProperty(name = "note")
    private String note;
    @NotNull(message = "state cannot be null")
    @ApiModelProperty(name = "state", required = true)
    private Integer state;
}
