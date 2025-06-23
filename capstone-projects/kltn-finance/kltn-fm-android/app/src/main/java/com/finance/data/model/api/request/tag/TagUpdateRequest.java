package com.finance.data.model.api.request.tag;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagUpdateRequest {
    Long id;
    String name;
    Integer kind;
    String colorCode;
}
