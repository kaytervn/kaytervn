package com.tenant.form.message.reaction;

import com.tenant.validation.MessageReactionKind;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
@ApiModel
public class ReactMessageReactionForm {
    @ApiModelProperty(required = true)
    @NotNull(message = "messageId can not be null")
    private Long messageId;
    @MessageReactionKind
    private Integer kind;
}
