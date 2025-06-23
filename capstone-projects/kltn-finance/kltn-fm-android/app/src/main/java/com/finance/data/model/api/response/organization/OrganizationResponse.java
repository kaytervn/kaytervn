package com.finance.data.model.api.response.organization;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationResponse implements Serializable {
    private Long id;
    private String name;
    private String logo;
}
