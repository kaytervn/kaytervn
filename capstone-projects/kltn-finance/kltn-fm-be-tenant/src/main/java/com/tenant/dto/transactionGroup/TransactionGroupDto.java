package com.tenant.dto.transactionGroup;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class TransactionGroupDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "status")
    private Integer status;
}
