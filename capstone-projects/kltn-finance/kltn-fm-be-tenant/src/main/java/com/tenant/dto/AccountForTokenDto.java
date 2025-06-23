package com.tenant.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class AccountForTokenDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "kind")
    private int kind;
    @ApiModelProperty(name = "username")
    private String username;
    @ApiModelProperty(name = "email")
    private String email;
    @ApiModelProperty(name = "fullName")
    private String fullName;
    @ApiModelProperty(name = "parentId")
    private Long parentId;
    @ApiModelProperty(name = "isSuperAdmin")
    private Boolean isSuperAdmin;
//    @ApiModelProperty(name = "group")
//    private GroupAdminDto group;
//    @ApiModelProperty(name = "lastLogin")
//    private Date lastLogin;
//    @ApiModelProperty(name = "avatar")
//    private String avatar;
}
