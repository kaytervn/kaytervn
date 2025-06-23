package com.tenant.form.transaction;

import com.tenant.validation.IgnoreDebit;
import com.tenant.validation.TransactionKind;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
public class CreateTransactionForm {
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @TransactionKind
    @NotNull(message = "kind cannot be null")
    @ApiModelProperty(name = "kind", required = true)
    private Integer kind;
    @NotNull(message = "money cannot be null")
    @ApiModelProperty(name = "money", required = true)
    private Double money;
    @ApiModelProperty(name = "note")
    private String note;
    @ApiModelProperty(name = "document")
    private String document;
    @ApiModelProperty(name = "categoryId")
    private Long categoryId;
    @NotNull(message = "transactionGroupId cannot be null")
    @ApiModelProperty(name = "transactionGroupId", required = true)
    private Long transactionGroupId;
    @NotNull(message = "transactionDate cannot be null")
    @ApiModelProperty(name = "transactionDate", required = true)
    private Date transactionDate;
    @ApiModelProperty(name = "addedBy")
    private Long addedBy;
    @ApiModelProperty(name = "approvedBy")
    private Long approvedBy;
    @IgnoreDebit
    @ApiModelProperty(name = "ignoreDebit", required = true)
    private Integer ignoreDebit;
    @ApiModelProperty(name = "tagId")
    private Long tagId;
}
