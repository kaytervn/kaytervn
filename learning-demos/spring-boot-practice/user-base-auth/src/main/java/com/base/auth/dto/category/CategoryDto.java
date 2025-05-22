package com.base.auth.dto.category;

import com.base.auth.dto.ABasicAdminDto;
import lombok.Data;


@Data
public class CategoryDto extends ABasicAdminDto {
    private String name;
    private String description;
    private String image;
    private Integer ordering;
    private Integer kind;
}
