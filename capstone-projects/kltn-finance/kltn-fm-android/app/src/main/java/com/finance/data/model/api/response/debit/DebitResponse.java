package com.finance.data.model.api.response.debit;

import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.data.model.api.response.transaction.Category;
import com.finance.data.model.api.response.transaction.TransactionResponse;
import com.finance.data.model.api.response.transaction.group.TransactionGroupResponse;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DebitResponse implements Serializable {
    private Long id;
    private Integer status;
    private String createdDate;
    private String transactionDate;
    private String modifiedDate;
    private String name;
    private Integer kind;
    private String money;
    private String note;
    private Category category;
    private Integer state;
    private TransactionGroupResponse transactionGroup;
    private String document;
    private AccountResponse addedBy;
    private TransactionResponse transaction;
    private TagResponse tag;
}
