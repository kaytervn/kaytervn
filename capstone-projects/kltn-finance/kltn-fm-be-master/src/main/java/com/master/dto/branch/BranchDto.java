package com.master.dto.branch;

import com.master.dto.ABasicAdminDto;
import lombok.Data;

@Data
public class BranchDto extends ABasicAdminDto {
    private String name;
    private String description;
}