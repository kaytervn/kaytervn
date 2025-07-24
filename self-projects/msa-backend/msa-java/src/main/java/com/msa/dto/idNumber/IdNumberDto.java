package com.msa.dto.idNumber;

import com.msa.dto.ABasicAdminDto;
import com.msa.dto.tag.TagDto;
import lombok.Data;

@Data
public class IdNumberDto extends ABasicAdminDto {
    private String name;
    private String code;
    private String note;
    private TagDto tag;
}