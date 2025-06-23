package com.finance.data.model.api.request.service.group;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupServiceUpdateRequest implements Serializable {
    private Long id;
    private String name;
    private String description;
}
