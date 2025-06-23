package com.tenant.form.paymentPeriod;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
public class CreatePaymentPeriodForm {
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @NotNull(message = "startDate cannot be null")
    @ApiModelProperty(name = "startDate", required = true)
    private Date startDate;
    @NotNull(message = "endDate cannot be null")
    @ApiModelProperty(name = "endDate", required = true)
    private Date endDate;
}
