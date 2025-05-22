package com.base.auth.form.address;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class UpdateAddressForm{
    @NotNull(message = "id can not be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @NotEmpty(message = "address can not be empty")
    @ApiModelProperty(name = "address", required = true)
    private String address;
    @NotNull(message = "ward can not be null")
    @ApiModelProperty(name = "ward", required = true)
    private Long wardId;
    @NotNull(message = "district can not be null")
    @ApiModelProperty(name = "district", required = true)
    private Long districtId;
    @NotNull(message = "province can not be null")
    @ApiModelProperty(name = "province", required = true)
    private Long provinceId;
    @NotEmpty(message = "name can not be empty")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @NotEmpty(message = "phone can not be empty")
    @ApiModelProperty(name = "phone", required = true)
    private String phone;
    @NotNull(message = "status can not be null")
    @ApiModelProperty(name = "status", required = true)
    private Integer status;
}
