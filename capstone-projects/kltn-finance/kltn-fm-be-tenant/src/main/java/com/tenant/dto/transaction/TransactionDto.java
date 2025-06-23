package com.tenant.dto.transaction;

import com.tenant.dto.account.AccountDto;
import com.tenant.dto.category.CategoryDto;
import com.tenant.dto.paymentPeriod.PaymentPeriodDto;
import com.tenant.dto.tag.TagDto;
import com.tenant.dto.transactionGroup.TransactionGroupDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;

@Data
public class TransactionDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "kind")
    private Integer kind;
    @ApiModelProperty(name = "state")
    private Integer state;
    @ApiModelProperty(name = "money")
    private String money;
    @ApiModelProperty(name = "note")
    private String note;
    @ApiModelProperty(name = "document")
    private String document;
    @ApiModelProperty(name = "category")
    private CategoryDto category;
    @ApiModelProperty(name = "transactionGroup")
    private TransactionGroupDto transactionGroup;
    @ApiModelProperty(name = "paymentPeriod")
    private PaymentPeriodDto paymentPeriod;
    @ApiModelProperty(name = "transactionDate")
    private Date transactionDate;
    @ApiModelProperty(name = "addedBy")
    private AccountDto addedBy;
    @ApiModelProperty(name = "approvedBy")
    private AccountDto approvedBy;
    @ApiModelProperty(name = "approvedDate")
    private Date approvedDate;
    @ApiModelProperty(name = "ignoreDebit")
    private Integer ignoreDebit;
    @ApiModelProperty(name = "tag")
    private TagDto tag;
}
