package com.msa.controller;

import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.platform.PlatformDto;
import com.msa.exception.BadRequestException;
import com.msa.form.platform.CreatePlatformForm;
import com.msa.form.platform.UpdatePlatformForm;
import com.msa.mapper.PlatformMapper;
import com.msa.storage.tenant.model.Platform;
import com.msa.storage.tenant.model.criteria.PlatformCriteria;
import com.msa.storage.tenant.repository.AccountRepository;
import com.msa.storage.tenant.repository.PlatformRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/platform")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PlatformController extends ABasicController {
    @Autowired
    private PlatformRepository platformRepository;
    @Autowired
    private PlatformMapper platformMapper;
    @Autowired
    private AccountRepository accountRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PL_V')")
    public ApiMessageDto<PlatformDto> get(@PathVariable("id") Long id) {
        Platform platform = platformRepository.findFirstByIdAndCreatedBy(id, getCurrentUserName()).orElse(null);
        if (platform == null) {
            throw new BadRequestException(ErrorCode.PLATFORM_ERROR_NOT_FOUND, "Not found platform");
        }
        return makeSuccessResponse(platformMapper.fromEntityToPlatformDto(platform), "Get platform success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PL_L')")
    public ApiMessageDto<ResponseListDto<List<PlatformDto>>> list(PlatformCriteria platformCriteria, Pageable pageable) {
        platformCriteria.setCreatedBy(getCurrentUserName());
        Page<Platform> listPlatform = platformRepository.findAll(platformCriteria.getCriteria(), pageable);
        ResponseListDto<List<PlatformDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(platformMapper.fromEntityListToPlatformDtoList(listPlatform.getContent()));
        responseListObj.setTotalPages(listPlatform.getTotalPages());
        responseListObj.setTotalElements(listPlatform.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list platform success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<PlatformDto>>> autoComplete(PlatformCriteria platformCriteria, @PageableDefault Pageable pageable) {
        platformCriteria.setCreatedBy(getCurrentUserName());
        platformCriteria.setStatus(AppConstant.STATUS_ACTIVE);
        Page<Platform> listPlatform = platformRepository.findAll(platformCriteria.getCriteria(), pageable);
        ResponseListDto<List<PlatformDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(platformMapper.fromEntityListToPlatformDtoListAutoComplete(listPlatform.getContent()));
        responseListObj.setTotalPages(listPlatform.getTotalPages());
        responseListObj.setTotalElements(listPlatform.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete platform success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PL_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreatePlatformForm form, BindingResult bindingResult) {
        if (platformRepository.existsByNameAndCreatedBy(form.getName(), getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.PLATFORM_ERROR_NAME_EXISTED, "Name existed");
        }
        Platform platform = platformMapper.fromCreatePlatformFormToEntity(form);
        platformRepository.save(platform);
        return makeSuccessResponse(null, "Create platform success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PL_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdatePlatformForm form, BindingResult bindingResult) {
        Platform platform = platformRepository.findFirstByIdAndCreatedBy(form.getId(), getCurrentUserName()).orElse(null);
        if (platform == null) {
            throw new BadRequestException(ErrorCode.PLATFORM_ERROR_NOT_FOUND, "Not found platform");
        }
        if (platformRepository.existsByNameAndIdNotAndCreatedBy(form.getName(), platform.getId(), getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.PLATFORM_ERROR_NAME_EXISTED, "Name existed");
        }
        platformMapper.fromUpdatePlatformFormToEntity(form, platform);
        platformRepository.save(platform);
        return makeSuccessResponse(null, "Update platform success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PL_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Platform platform = platformRepository.findFirstByIdAndCreatedBy(id,getCurrentUserName()).orElse(null);
        if (platform == null) {
            throw new BadRequestException(ErrorCode.PLATFORM_ERROR_NOT_FOUND, "Not found platform");
        }
        if (accountRepository.existsByPlatformIdAndCreatedBy(id, getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.PLATFORM_ERROR_ACCOUNT_EXISTED, "Account existed");
        }
        platformRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete platform success");
    }
}
