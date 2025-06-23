package com.finance.data.model.api.response.service.schedule;

import com.finance.data.model.api.response.service.ServiceResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceScheduleResponse {
    private Long id;
    private Integer status;
    private String createdDate;
    private String modifiedDate;
    private Integer numberOfDueDays;
    private Integer ordering;
    private ServiceResponse service;
}
