package com.tenant.form.transaction;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ExportExcelTransactionForm {
    @NotNull(message = "transactionIds cannot be null")
    private List<Long> transactionIds;
    private Integer sortDate;
}
