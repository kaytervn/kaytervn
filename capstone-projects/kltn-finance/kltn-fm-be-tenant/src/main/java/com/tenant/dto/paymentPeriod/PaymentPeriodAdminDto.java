package com.tenant.dto.paymentPeriod;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.transaction.TransactionDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class PaymentPeriodAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "state")
    private Integer state;
    @ApiModelProperty(name = "startDate")
    private Date startDate;
    @ApiModelProperty(name = "endDate")
    private Date endDate;
    @ApiModelProperty(name = "transactions")
    private List<TransactionDto> transactions;
    @ApiModelProperty(name = "totalIncome")
    private String totalIncome;
    @ApiModelProperty(name = "totalExpenditure")
    private String totalExpenditure;
}
