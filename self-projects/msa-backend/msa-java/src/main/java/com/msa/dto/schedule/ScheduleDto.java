package com.msa.dto.schedule;

import com.msa.dto.ABasicAdminDto;
import com.msa.dto.tag.TagDto;
import lombok.Data;

import java.util.Date;

@Data
public class ScheduleDto extends ABasicAdminDto {
    private String name;
    private String sender;
    private String emails;
    private String content;
    private Integer kind;
    private Integer amount;
    private String time;
    private String checkedDate;
    private Date dueDate;
    private Integer type;
    private Boolean isSent;
    private TagDto tag;
}
