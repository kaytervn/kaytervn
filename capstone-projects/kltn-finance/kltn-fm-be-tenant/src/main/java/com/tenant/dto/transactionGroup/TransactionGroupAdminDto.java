package com.tenant.dto.transactionGroup;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.transaction.TransactionDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class TransactionGroupAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "description")
    private String description;
    @ApiModelProperty(name = "transactions")
    private List<TransactionDto> transactions;
}
