package com.msa.dto.dbConfig;

import com.msa.dto.ABasicAdminDto;
import com.msa.dto.user.UserDto;
import lombok.Data;

import java.util.Date;

@Data
public class DbConfigDto extends ABasicAdminDto {
    private String url;
    private String username;
    private String password;
    private Date lockedTime;
    private UserDto user;
}
