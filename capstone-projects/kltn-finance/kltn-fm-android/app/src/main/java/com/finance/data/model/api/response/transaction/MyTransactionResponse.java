package com.finance.data.model.api.response.transaction;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyTransactionResponse implements Serializable {
    private Long id;
    private String name;
    private Integer kind;
    private String money;
    private String transactionDate;
    private Integer state;
    private Category category;
    private Boolean isHavePermissionReject = true;
    private Boolean isHavePermissionDeleted = true;

}

