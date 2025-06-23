package com.finance.data.model.api.request.transaction;

import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.data.model.api.response.transaction.TransactionResponse;
import com.finance.utils.AESUtils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionCreateUpdateRequest {
    private Long id;
    private Long categoryId;
    private Integer kind;
    private Double money;
    private String name;
    private Integer state;
    private String note;
    private Long transactionGroupId;
    private String document;
    private String transactionDate;
    private Long addedBy;
    private Long approvedBy;
    private Integer ignoreDebit;
    private Long tagId;
    public TransactionCreateUpdateRequest(TransactionResponse transactionResponse, String secretKey) {
        this.id = transactionResponse.getId();
        this.name = transactionResponse.getName();
        this.kind = transactionResponse.getKind();
        this.transactionDate = transactionResponse.getTransactionDate();
        if (transactionResponse.getCategory() != null && transactionResponse.getCategory().getId() != null){
            this.categoryId = transactionResponse.getCategory().getId();
        }
        if (transactionResponse.getNote() != null) {
            this.note = transactionResponse.getNote();
        }
        this.state = transactionResponse.getState();
        if (transactionResponse.getTransactionGroup() != null) {
            this.transactionGroupId = transactionResponse.getTransactionGroup().getId();
        }
        if (transactionResponse.getAddedBy() != null) {
            this.addedBy = transactionResponse.getAddedBy().getId();
        }
        if (transactionResponse.getApprovedBy() != null) {
            this.approvedBy = transactionResponse.getApprovedBy().getId();
        }
        if (transactionResponse.getTag() != null) {
            this.tagId = transactionResponse.getTag().getId();
        }
        //Decrypt data
        if (this.getName() != null) {
            this.setName(AESUtils.decrypt(secretKey, this.getName()));
        }
        if (this.getNote() != null) {
            this.setNote(AESUtils.decrypt(secretKey, this.getNote()));
        }
        String moneyDecrypt = AESUtils.decrypt(secretKey, transactionResponse.getMoney());
        Double moneyDouble = Double.parseDouble(moneyDecrypt);
        this.setMoney(moneyDouble);
    }

}
