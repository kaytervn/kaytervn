package com.msa.controller;

import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.software.SoftwareDto;
import com.msa.exception.BadRequestException;
import com.msa.form.software.CreateSoftwareForm;
import com.msa.form.software.UpdateSoftwareForm;
import com.msa.mapper.SoftwareMapper;
import com.msa.storage.tenant.model.Software;
import com.msa.storage.tenant.model.Tag;
import com.msa.storage.tenant.model.criteria.SoftwareCriteria;
import com.msa.storage.tenant.repository.SoftwareRepository;
import com.msa.storage.tenant.repository.TagRepository;
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
@RequestMapping("/v1/software")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class SoftwareController extends ABasicController {
    @Autowired
    private SoftwareRepository softwareRepository;
    @Autowired
    private SoftwareMapper softwareMapper;
    @Autowired
    private TagRepository tagRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SO_V')")
    public ApiMessageDto<SoftwareDto> get(@PathVariable("id") Long id) {
        Software software = softwareRepository.findById(id).orElse(null);
        if (software == null) {
            throw new BadRequestException(ErrorCode.SOFTWARE_ERROR_NOT_FOUND, "Not found software");
        }
        return makeSuccessResponse(softwareMapper.fromEntityToSoftwareDto(software), "Get software success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SO_L')")
    public ApiMessageDto<ResponseListDto<List<SoftwareDto>>> list(SoftwareCriteria softwareCriteria, Pageable pageable) {
        Page<Software> listSoftware = softwareRepository.findAll(softwareCriteria.getCriteria(), pageable);
        ResponseListDto<List<SoftwareDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(softwareMapper.fromEntityListToSoftwareDtoList(listSoftware.getContent()));
        responseListObj.setTotalPages(listSoftware.getTotalPages());
        responseListObj.setTotalElements(listSoftware.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list software success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<SoftwareDto>>> autoComplete(SoftwareCriteria softwareCriteria, @PageableDefault Pageable pageable) {
        softwareCriteria.setStatus(AppConstant.STATUS_ACTIVE);
        Page<Software> listSoftware = softwareRepository.findAll(softwareCriteria.getCriteria(), pageable);
        ResponseListDto<List<SoftwareDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(softwareMapper.fromEntityListToSoftwareDtoListAutoComplete(listSoftware.getContent()));
        responseListObj.setTotalPages(listSoftware.getTotalPages());
        responseListObj.setTotalElements(listSoftware.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete software success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SO_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateSoftwareForm form, BindingResult bindingResult) {
        if (softwareRepository.existsByName(form.getName())) {
            throw new BadRequestException(ErrorCode.SOFTWARE_ERROR_NAME_EXISTED, "Name existed");
        }
        Software software = softwareMapper.fromCreateSoftwareFormToEntity(form);
        if (form.getTagId() != null) {
            Tag tag = tagRepository.findFirstByIdAndKind(form.getTagId(), AppConstant.TAG_KIND_SOFTWARE).orElse(null);
            if (tag == null) {
                throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            software.setTag(tag);
        } else {
            software.setTag(null);
        }
        softwareRepository.save(software);
        return makeSuccessResponse(null, "Create software success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SO_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateSoftwareForm form, BindingResult bindingResult) {
        Software software = softwareRepository.findById(form.getId()).orElse(null);
        if (software == null) {
            throw new BadRequestException(ErrorCode.SOFTWARE_ERROR_NOT_FOUND, "Not found software");
        }
        if (softwareRepository.existsByNameAndIdNot(form.getName(), form.getId())) {
            throw new BadRequestException(ErrorCode.SOFTWARE_ERROR_NAME_EXISTED, "Name existed");
        }
        softwareMapper.fromUpdateSoftwareFormToEntity(form, software);
        if (form.getTagId() != null) {
            Tag tag = tagRepository.findFirstByIdAndKind(form.getTagId(), AppConstant.TAG_KIND_SOFTWARE).orElse(null);
            if (tag == null) {
                throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            software.setTag(tag);
        } else {
            software.setTag(null);
        }
        softwareRepository.save(software);
        return makeSuccessResponse(null, "Update software success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SO_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Software software = softwareRepository.findById(id).orElse(null);
        if (software == null) {
            throw new BadRequestException(ErrorCode.SOFTWARE_ERROR_NOT_FOUND, "Not found software");
        }
        softwareRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete software success");
    }
}
