package com.finance.data.model.api.request.transaction.group;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupTransactionUpdateRequest implements Serializable {
    Long id;
    String name;
    String description;
}
