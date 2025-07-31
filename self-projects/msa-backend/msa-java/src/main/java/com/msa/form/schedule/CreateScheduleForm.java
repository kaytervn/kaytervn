package com.msa.form.schedule;

import com.msa.constant.AppConstant;
import com.msa.validation.*;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class CreateScheduleForm {
    @NotBlank(message = "name cannot be blank")
    @ApiModelProperty(required = true)
    private String name;
    @NotBlank(message = "sender cannot be blank")
    @ApiModelProperty(required = true)
    private String sender;
    @ValidJsonField(classType = List.class, type = AppConstant.JSON_TYPE_LIST_OBJECT)
    @ApiModelProperty(required = true)
    private String emails;
    @NotBlank(message = "content cannot be blank")
    @ApiModelProperty(required = true)
    private String content;
    @ScheduleKind
    @ApiModelProperty(required = true)
    private Integer kind;
    @Min(1)
    private Integer amount;
    @PatternConstraint(pattern = AppConstant.TIME_PATTERN)
    @ApiModelProperty(required = true)
    private String time;
    @NotBlank(message = "checkedDate cannot be blank")
    @ApiModelProperty(required = true)
    private String checkedDate;
    private Long tagId;
    @ScheduleType(allowNull = true)
    private Integer type;
}
