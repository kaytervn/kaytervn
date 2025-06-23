package com.finance.data.model.api.response.transaction;

import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.data.model.api.response.transaction.group.TransactionGroupResponse;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse implements Serializable {
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
    private AccountResponse approvedBy;
    private Integer ignoreDebit;
    private TagResponse tag;
    public void setTransactionResponse(TransactionResponse transactionResponse) {
        this.id = transactionResponse.getId();
        this.status = transactionResponse.getStatus();
        this.createdDate = transactionResponse.getCreatedDate();
        this.transactionDate = transactionResponse.getTransactionDate();
        this.modifiedDate = transactionResponse.getModifiedDate();
        this.name = transactionResponse.getName();
        this.kind = transactionResponse.getKind();
        this.money = transactionResponse.getMoney();
        this.note = transactionResponse.getNote();
        this.category = transactionResponse.getCategory();
        this.state = transactionResponse.getState();
        this.transactionGroup = transactionResponse.getTransactionGroup();
        this.document = transactionResponse.getDocument();
        this.addedBy = transactionResponse.getAddedBy();
        this.approvedBy = transactionResponse.getApprovedBy();
        this.tag = transactionResponse.getTag();
    }
}
