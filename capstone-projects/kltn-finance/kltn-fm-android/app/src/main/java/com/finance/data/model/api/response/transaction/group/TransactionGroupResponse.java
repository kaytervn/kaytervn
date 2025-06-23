package com.finance.data.model.api.response.transaction.group;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionGroupResponse implements Serializable {
    Long id;
    Integer status;
    String createdDate;
    String modifiedDate;
    String name;
    String description;
}
