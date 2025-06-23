package com.tenant.dto.account;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.department.DepartmentDto;
import io.swagger.annotations.ApiModelProperty;
import com.tenant.dto.group.GroupDto;
import lombok.Data;

import java.util.Date;

@Data
public class AccountAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "kind")
    private Integer kind;
    @ApiModelProperty(name = "username")
    private String username;
    @ApiModelProperty(name = "phone")
    private String phone;
    @ApiModelProperty(name = "email")
    private String email;
    @ApiModelProperty(name = "fullName")
    private String fullName;
    @ApiModelProperty(name = "birthDate")
    private Date birthDate;
    @ApiModelProperty(name = "address")
    private String address;
    @ApiModelProperty(name = "lastLogin")
    private Date lastLogin;
    @ApiModelProperty(name = "avatarPath")
    private String avatarPath;
    @ApiModelProperty(name = "isSuperAdmin")
    private Boolean isSuperAdmin;
    @ApiModelProperty(name = "group")
    private GroupDto group;
    @ApiModelProperty(name = "department")
    private DepartmentDto department;
    @ApiModelProperty(name = "publicKey")
    private String publicKey;
    @ApiModelProperty(name = "secretKey")
    private String secretKey;
    private Boolean isFaceIdRegistered;
}
