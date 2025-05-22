package com.base.auth.dto.address;

import com.base.auth.dto.ABasicAdminDto;
import com.base.auth.dto.nation.NationAdminDto;
import com.base.auth.dto.user.UserDto;
import lombok.Data;

@Data
public class AddressAdminDto extends ABasicAdminDto {
    private String address;
    private NationAdminDto wardInfo;
    private NationAdminDto districtInfo;
    private NationAdminDto provinceInfo;
    private String name;
    private String phone;
    private UserDto userInfo;
}
