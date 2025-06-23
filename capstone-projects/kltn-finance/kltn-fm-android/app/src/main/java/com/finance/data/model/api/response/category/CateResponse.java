package com.finance.data.model.api.response.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CateResponse{
    private String createdDate;
    private String description;
    private Long id;
    private Integer kind;
    private String modifiedDate;
    private String name;
    private Integer status;

}
