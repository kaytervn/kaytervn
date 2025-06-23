package com.finance.data.model.api.response.key;

import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.data.model.api.response.tag.TagResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeyResponse{
    private Long id;
    private Integer status;
    private String createdDate;
    private String modifiedDate;
    private String name;
    private Integer kind;
    private String description;
    private AccountResponse account;
    private KeyGroupResponse keyInformationGroup;
    private String additionalInformation;
    private OrganizationResponse organization;
    private String document;
    private TagResponse tag = new TagResponse();
}