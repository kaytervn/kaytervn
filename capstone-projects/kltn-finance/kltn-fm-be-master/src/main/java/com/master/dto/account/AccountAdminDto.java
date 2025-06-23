package com.master.dto.account;

import com.master.dto.ABasicAdminDto;
import com.master.dto.branch.BranchDto;
import io.swagger.annotations.ApiModelProperty;
import com.master.dto.group.GroupDto;
import lombok.Data;

import java.util.Date;
import java.util.List;

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
    @ApiModelProperty(name = "lastLogin")
    private Date lastLogin;
    @ApiModelProperty(name = "avatarPath")
    private String avatarPath;
    @ApiModelProperty(name = "isSuperAdmin")
    private Boolean isSuperAdmin;
    @ApiModelProperty(name = "group")
    private GroupDto group;
    private List<BranchDto> branches;
}
