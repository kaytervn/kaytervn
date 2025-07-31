package com.msa.dto.schedule;

import lombok.Data;

@Data
public class ScheduleMailDto {
    private String title;
    private String receiver;
    private String content;
    private String link;
    private String sender;
    private String toEmail;
    private String date;
}
