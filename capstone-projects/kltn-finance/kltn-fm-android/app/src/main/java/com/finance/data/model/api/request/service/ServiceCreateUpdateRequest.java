package com.finance.data.model.api.request.service;

import com.finance.data.model.api.response.service.ServiceResponse;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCreateUpdateRequest implements Serializable {
    private Long id;
    private String name;
    private Double money;
    private Integer periodKind;
    private String startDate;
    private String expirationDate;
    private String description;
    private Integer kind;
    private Long serviceGroupId;
    private Long tagId;
    public void setServiceCreateUpdateRequest(ServiceResponse serviceResponse){
        this.id = serviceResponse.getId();
        this.name = serviceResponse.getName();
        this.periodKind = serviceResponse.getPeriodKind();
        this.startDate = serviceResponse.getStartDate();
        this.expirationDate = serviceResponse.getExpirationDate();
        this.description = serviceResponse.getDescription();
        this.kind = serviceResponse.getKind();
        if (serviceResponse.getServiceGroup()!=null
                && serviceResponse.getServiceGroup().getId() != null)
            this.serviceGroupId = serviceResponse.getServiceGroup().getId();
        if (serviceResponse.getTag()!=null
                && serviceResponse.getTag().getId() != null){
            this.tagId = serviceResponse.getTag().getId();
        }
    }
}
