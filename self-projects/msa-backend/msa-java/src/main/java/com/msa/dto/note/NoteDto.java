package com.msa.dto.note;

import com.msa.dto.ABasicAdminDto;
import com.msa.dto.tag.TagDto;
import lombok.Data;

@Data
public class NoteDto extends ABasicAdminDto {
    private String name;
    private String note;
    private TagDto tag;
}