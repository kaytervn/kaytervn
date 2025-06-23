package com.finance.data.model.api.response.account;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class Permission implements Serializable {
    public static Boolean checkPermission(String code, List<String> permissionList){
        if(permissionList == null || permissionList.isEmpty()){
            return false;
        }
        return permissionList.contains(code);
    }
}