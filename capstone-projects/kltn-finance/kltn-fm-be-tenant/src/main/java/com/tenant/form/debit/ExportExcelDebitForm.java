package com.tenant.form.debit;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ExportExcelDebitForm {
    @NotNull(message = "debitIds cannot be null")
    private List<Long> debitIds;
}
