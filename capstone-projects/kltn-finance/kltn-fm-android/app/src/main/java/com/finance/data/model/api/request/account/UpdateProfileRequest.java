package com.finance.data.model.api.request.account;


import com.finance.data.model.api.response.account.AccountResponse;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest implements Serializable {
    String address;
    String birthDate;
    String fullName;
    String avatarPath;
    String oldPassword;

    public void setUpdateProfileRequest(AccountResponse accountResponse) {
        this.address = accountResponse.getAddress();
        this.birthDate = accountResponse.getBirthDate();
        this.fullName = accountResponse.getFullName();
        this.avatarPath = accountResponse.getAvatarPath();
    }
}
