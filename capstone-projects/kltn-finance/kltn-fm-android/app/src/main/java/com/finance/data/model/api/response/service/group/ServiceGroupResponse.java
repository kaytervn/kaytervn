package com.finance.data.model.api.response.service.group;

import com.finance.data.model.api.request.service.group.GroupServiceUpdateRequest;
import com.finance.data.model.api.response.service.ServiceResponse;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceGroupResponse implements Serializable {
    private Long id;
    private Integer status;
    private String createdDate;
    private String modifiedDate;
    private String name;
    private String description;
    private List<ServiceResponse> services;
}
