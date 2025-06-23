package com.finance.data.model.api.request.tag;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagCreateRequest {
    String name;
    Integer kind;
    String colorCode;
}
