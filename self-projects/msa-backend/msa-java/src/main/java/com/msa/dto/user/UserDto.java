package com.msa.dto.user;

import com.msa.dto.ABasicAdminDto;
import com.msa.dto.group.GroupDto;
import lombok.Data;

import java.util.Date;

@Data
public class UserDto extends ABasicAdminDto {
    private Integer kind;
    private String username;
    private String fullName;
    private String avatarPath;
    private String email;
    private GroupDto group;
    private Date lastLogin;
    private Boolean isMfa;
    private Boolean isSuperAdmin;
    private String codes;
}