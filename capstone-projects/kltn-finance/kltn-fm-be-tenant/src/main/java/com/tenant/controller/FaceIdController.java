package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.faceId.VerifyFaceIdDto;
import com.tenant.exception.BadRequestException;
import com.tenant.form.faceId.DeleteFaceIdForm;
import com.tenant.form.faceId.RegisterFaceIdForm;
import com.tenant.form.faceId.RequestFaceIdForm;
import com.tenant.multitenancy.dto.ImagePayloadDto;
import com.tenant.multitenancy.feign.FeignCacheService;
import com.tenant.multitenancy.feign.FeignFaceIdService;
import com.tenant.storage.tenant.model.Account;
import com.tenant.storage.tenant.repository.AccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/v1/face-id")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class FaceIdController extends ABasicController {
    @Autowired
    private FeignCacheService feignCacheService;
    @Autowired
    private FeignFaceIdService feignFaceIdService;
    @Value("${cache.api-key}")
    private String cacheApiKey;
    @Value("${face-id.api-key}")
    private String faceIdApiKey;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<Object> register(@Valid @RequestBody RegisterFaceIdForm form, BindingResult bindingResult) {
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Account not found");
        }
        if (!FinanceConstant.STATUS_ACTIVE.equals(account.getStatus())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_ACTIVE, "Account not active");
        }
        if (!passwordEncoder.matches(form.getPassword(), account.getPassword())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_WRONG_PASSWORD, "Wrong password");
        }
        ImagePayloadDto dto = new ImagePayloadDto();
        dto.setImageData(form.getImageData());
        dto.setUserId(account.getUsername());
        ApiMessageDto<Object> res = feignFaceIdService.registerWebCam(faceIdApiKey, dto);
        if (!res.getResult()) {
            throw new BadRequestException(res.getMessage());
        }
        account.setIsFaceIdRegistered(true);
        accountRepository.save(account);
        return res;
    }

    @PostMapping(value = "/verify", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<VerifyFaceIdDto> verify(@Valid @RequestBody RequestFaceIdForm form, BindingResult bindingResult) {
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Account not found");
        }
        if (!FinanceConstant.STATUS_ACTIVE.equals(account.getStatus())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_ACTIVE, "Account not active");
        }
        ImagePayloadDto dto = new ImagePayloadDto();
        dto.setImageData(form.getImageData());
        ApiMessageDto<VerifyFaceIdDto> res = feignFaceIdService.verifyWebCam(faceIdApiKey, dto);
        if (!res.getResult()) {
            throw new BadRequestException(res.getMessage());
        }
        if (StringUtils.isNotBlank(res.getData().getUserId()) && !res.getData().getUserId().equals(account.getUsername())) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_INVALID_FACE_ID, "Face not match");
        }
        return res;
    }

    @PostMapping(value = "/delete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> delete(@Valid @RequestBody DeleteFaceIdForm form, BindingResult bindingResult) {
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Account not found");
        }
        if (!FinanceConstant.STATUS_ACTIVE.equals(account.getStatus())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_ACTIVE, "Account not active");
        }
        if (!passwordEncoder.matches(form.getPassword(), account.getPassword())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_WRONG_PASSWORD, "Wrong password");
        }
        account.setIsFaceIdRegistered(false);
        accountRepository.save(account);
        return feignCacheService.deleteFaceId(cacheApiKey, account.getUsername());
    }
}
