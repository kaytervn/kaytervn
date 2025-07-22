package com.msa.controller;

import com.msa.dto.ApiMessageDto;
import com.msa.jwt.AppJwt;
import com.msa.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;

public class ABasicController {
    @Autowired
    private UserServiceImpl userService;

    public long getCurrentUser() {
        try {
            AppJwt AppJwt = userService.getAddInfoFromToken();
            return AppJwt.getAccountId();
        } catch (Exception e) {
            return -1000L;
        }
    }

    public <T> ApiMessageDto<T> makeSuccessResponse(T data, String message) {
        ApiMessageDto<T> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setData(data);
        apiMessageDto.setMessage(message);
        return apiMessageDto;
    }
}
