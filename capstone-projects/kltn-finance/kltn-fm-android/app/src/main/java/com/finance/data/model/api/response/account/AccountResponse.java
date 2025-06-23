package com.finance.data.model.api.response.account;

import com.finance.data.model.api.request.account.UpdateProfileRequest;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse implements Serializable {
    private Long id;
    private Integer kind;
    private String username;
    private String phone;
    private String birthDate;
    private String address;
    private String email;
    private String fullName;
    private String lastLogin;
    private String avatarPath;
    private Boolean isSuperAdmin;
    private Group group;
    private DepartmentResponse department;


    public AccountResponse(Long id){
        this.id = id;
    }
    public void setAccountResponse(UpdateProfileRequest request){
        this.address = request.getAddress();
        this.birthDate = request.getBirthDate();
        this.fullName = request.getFullName();
        this.avatarPath = request.getAvatarPath();
    }
}
