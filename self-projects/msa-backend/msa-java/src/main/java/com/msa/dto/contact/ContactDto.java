package com.msa.dto.contact;

import com.msa.dto.ABasicAdminDto;
import com.msa.dto.tag.TagDto;
import lombok.Data;

@Data
public class ContactDto extends ABasicAdminDto {
    private String name;
    private String phone;
    private String phones;
    private String note;
    private TagDto tag;
}
