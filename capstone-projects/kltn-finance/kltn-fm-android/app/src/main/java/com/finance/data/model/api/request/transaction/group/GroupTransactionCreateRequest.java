package com.finance.data.model.api.request.transaction.group;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupTransactionCreateRequest {
    String name;
    String description;
}
