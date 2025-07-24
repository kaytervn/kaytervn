package com.msa.dto.link;

import com.msa.dto.ABasicAdminDto;
import com.msa.dto.tag.TagDto;
import lombok.Data;

@Data
public class LinkDto extends ABasicAdminDto {
    private String name;
    private String link;
    private String note;
    private TagDto tag;
}
