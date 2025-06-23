package com.tenant.form.account;

import com.tenant.validation.EmailConstraint;
import com.tenant.validation.NameConstraint;
import com.tenant.validation.PhoneConstraint;
import com.tenant.validation.StatusConstraint;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
@ApiModel
public class UpdateAccountAdminForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @NameConstraint
    @NotBlank(message = "fullName cannot be null")
    @ApiModelProperty(name = "fullName", required = true)
    private String fullName;
    @ApiModelProperty(name = "avatarPath")
    private String avatarPath;
    @NotBlank(message = "email cannot be null")
    @EmailConstraint
    @ApiModelProperty(name = "email", required = true)
    private String email;
    @NotBlank(message = "phone cannot be null")
    @PhoneConstraint
    @ApiModelProperty(name = "phone", required = true)
    private String phone;
    @ApiModelProperty(name = "birthDate")
    private Date birthDate;
    @ApiModelProperty(name = "address")
    private String address;
    @NotNull(message = "status cannot be null")
    @StatusConstraint
    @ApiModelProperty(name = "status", required = true)
    private Integer status;
    @NotNull(message = "groupId cannot be null")
    @ApiModelProperty(name = "groupId", required = true)
    private Long groupId;
    @NotNull(message = "departmentId cannot be null")
    @ApiModelProperty(name = "departmentId", required = true)
    private Long departmentId;
}
