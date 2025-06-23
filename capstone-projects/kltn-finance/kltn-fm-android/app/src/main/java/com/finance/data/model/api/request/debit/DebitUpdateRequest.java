package com.finance.data.model.api.request.debit;

import com.finance.data.model.api.response.debit.DebitResponse;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.data.model.api.response.transaction.TransactionResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DebitUpdateRequest {
    private Long id;
    private String name;
    private Integer kind;
    private Long categoryId;
    private Double money;
    private String note;
    private Integer state;
    private Long transactionGroupId;
    private String document;
    private String transactionDate;
    private Long addedBy;
    private TransactionResponse transaction;
    private Long tagId;
    public DebitUpdateRequest(DebitResponse debitResponse) {
        this.id = debitResponse.getId();
        this.name = debitResponse.getName();
        this.kind = debitResponse.getKind();
        this.transactionDate = debitResponse.getTransactionDate();
        if (debitResponse.getCategory() != null && debitResponse.getCategory().getId() != null)
            this.categoryId = debitResponse.getCategory().getId();
        if (debitResponse.getNote() != null)
            this.note = debitResponse.getNote();
        this.state = debitResponse.getState();
        if (debitResponse.getTransactionGroup() != null)
            this.transactionGroupId = debitResponse.getTransactionGroup().getId();
        if (debitResponse.getAddedBy() != null)
            this.addedBy = debitResponse.getAddedBy().getId();
        if (debitResponse.getTransaction() != null)
            this.transaction = debitResponse.getTransaction();
        if (debitResponse.getTag() != null)
            this.tagId = debitResponse.getTag().getId();
    }
}
