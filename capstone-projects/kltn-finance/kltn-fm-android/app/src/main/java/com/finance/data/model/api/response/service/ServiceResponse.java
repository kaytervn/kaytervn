package com.finance.data.model.api.response.service;

import android.annotation.SuppressLint;

import com.finance.data.model.api.response.service.group.ServiceGroupResponse;
import com.finance.data.model.api.response.tag.TagResponse;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponse implements Serializable {
    private Long id;
    private String status;
    private String createdDate;
    private String modifiedDate;
    private String name;
    private Integer kind;
    private String description;
    private String money;
    private Integer periodKind;
    private String startDate;
    private String expirationDate;
    private ServiceGroupResponse serviceGroup;
    private Integer isPaid;
    private Long daysToExpiration;
    private TagResponse tag;

    public ServiceResponse(ServiceResponse serviceResponse) {
        this.id = serviceResponse.getId();
        this.status = serviceResponse.getStatus();
        this.createdDate = serviceResponse.getCreatedDate();
        this.modifiedDate = serviceResponse.getModifiedDate();
        this.name = serviceResponse.getName();
        this.kind = serviceResponse.getKind();
        this.description = serviceResponse.getDescription();
        this.money = serviceResponse.getMoney();
        this.periodKind = serviceResponse.getPeriodKind();
        this.startDate = serviceResponse.getStartDate();
        this.expirationDate = serviceResponse.getExpirationDate();
        this.serviceGroup = serviceResponse.getServiceGroup();
        this.isPaid = serviceResponse.getIsPaid();
        this.daysToExpiration = serviceResponse.getDaysToExpiration();
        this.tag = serviceResponse.getTag();
    }

    public void calculateDayToExpiration() {
        @SuppressLint("SimpleDateFormat")
        DateTimeFormatter formatter;
        long days = 0L;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            String currentDate = LocalDateTime.now().format(formatter);
            LocalDateTime date1 = LocalDateTime.parse(currentDate, formatter);
            LocalDateTime date2 = LocalDateTime.parse(expirationDate, formatter);
            days = ChronoUnit.DAYS.between(date1, date2);
        }
        this.daysToExpiration = days;
    }
}
