package com.finance.data.model.api.response.account;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse implements Serializable {
    Long id;
    Integer status;
    String createdDate;
    String modifiedDate;
    String name;
}
