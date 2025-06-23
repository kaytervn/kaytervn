package com.finance.data.model.api.response.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentChat {
    private String description;
    private int id;
    private String name;
}
