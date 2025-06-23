package com.tenant.form.serviceSchedule;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class UpdateServiceScheduleForm {
    @NotNull(message = "serviceId cannot be null")
    @ApiModelProperty(name = "serviceId", required = true)
    private Long serviceId;
    @NotNull(message = "numberOfDueDaysList cannot be null")
    @ApiModelProperty(name = "numberOfDueDaysList", required = true)
    private List<Integer> numberOfDueDaysList;
}
