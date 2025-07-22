package com.msa.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ABasicAdminDto {
    private Long id;
    private Integer status;
    private Date createdDate;
    private Date modifiedDate;
}
