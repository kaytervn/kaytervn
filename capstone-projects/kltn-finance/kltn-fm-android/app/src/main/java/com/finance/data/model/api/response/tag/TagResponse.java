package com.finance.data.model.api.response.tag;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagResponse implements Serializable {
    private Long id;
    private String name;
    private Integer kind;
    private String kindName;
    private String colorCode;

}
