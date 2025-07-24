package com.msa.dto.tag;

import com.msa.dto.ABasicAdminDto;
import lombok.Data;

@Data
public class TagDto extends ABasicAdminDto {
    private String name;
    private String color;
    private Integer kind;
}
