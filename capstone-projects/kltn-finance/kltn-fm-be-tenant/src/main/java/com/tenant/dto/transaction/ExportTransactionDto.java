package com.tenant.dto.transaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExportTransactionDto {
    private Long id;
    private String name;
    private Integer kind;
    private Integer state;
    private String money;
    private String note;
    private String document;
    private Date transactionDate;
}