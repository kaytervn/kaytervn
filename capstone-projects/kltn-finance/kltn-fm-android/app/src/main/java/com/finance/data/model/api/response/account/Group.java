package com.finance.data.model.api.response.account;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Group implements Serializable {
    private Long id;
    private String name;
    private Integer kind;
    private String description;
    private List<Permission> permissions;
}
