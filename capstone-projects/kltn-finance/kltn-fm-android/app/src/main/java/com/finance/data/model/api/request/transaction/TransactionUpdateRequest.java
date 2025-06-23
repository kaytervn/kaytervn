package com.finance.data.model.api.request.transaction;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionUpdateRequest implements Serializable {
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
    private Long approvedBy;
    private Integer ignoreDebit;
}
