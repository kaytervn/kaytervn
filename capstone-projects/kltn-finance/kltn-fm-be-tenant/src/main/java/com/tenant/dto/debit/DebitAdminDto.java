package com.tenant.dto.debit;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.account.AccountDto;
import com.tenant.dto.category.CategoryDto;
import com.tenant.dto.tag.TagDto;
import com.tenant.dto.transaction.TransactionDto;
import com.tenant.dto.transactionGroup.TransactionGroupDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;

@Data
public class DebitAdminDto extends ABasicAdminDto {
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
    @ApiModelProperty(name = "transaction")
    private TransactionDto transaction;
    @ApiModelProperty(name = "category")
    private CategoryDto category;
    @ApiModelProperty(name = "transactionGroup")
    private TransactionGroupDto transactionGroup;
    @ApiModelProperty(name = "transactionDate")
    private Date transactionDate;
    @ApiModelProperty(name = "addedBy")
    private AccountDto addedBy;
    @ApiModelProperty(name = "tag")
    private TagDto tag;
}
