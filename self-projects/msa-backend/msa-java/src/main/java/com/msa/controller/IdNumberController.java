package com.msa.controller;

import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.idNumber.IdNumberDto;
import com.msa.exception.BadRequestException;
import com.msa.form.idNumber.CreateIdNumberForm;
import com.msa.form.idNumber.UpdateIdNumberForm;
import com.msa.mapper.IdNumberMapper;
import com.msa.storage.tenant.model.IdNumber;
import com.msa.storage.tenant.model.Tag;
import com.msa.storage.tenant.model.criteria.IdNumberCriteria;
import com.msa.storage.tenant.repository.IdNumberRepository;
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
@RequestMapping("/v1/id-number")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class IdNumberController extends ABasicController {
    @Autowired
    private IdNumberRepository idNumberRepository;
    @Autowired
    private IdNumberMapper idNumberMapper;
    @Autowired
    private TagRepository tagRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ID_N_V')")
    public ApiMessageDto<IdNumberDto> get(@PathVariable("id") Long id) {
        IdNumber idNumber = idNumberRepository.findFirstByIdAndCreatedBy(id, getCurrentUserName()).orElse(null);
        if (idNumber == null) {
            throw new BadRequestException(ErrorCode.ID_NUMBER_ERROR_NOT_FOUND, "Not found id number");
        }
        return makeSuccessResponse(idNumberMapper.fromEntityToIdNumberDto(idNumber), "Get id number success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ID_N_L')")
    public ApiMessageDto<ResponseListDto<List<IdNumberDto>>> list(IdNumberCriteria idNumberCriteria, Pageable pageable) {
        idNumberCriteria.setCreatedBy(getCurrentUserName());
        Page<IdNumber> listIdNumber = idNumberRepository.findAll(idNumberCriteria.getCriteria(), pageable);
        ResponseListDto<List<IdNumberDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(idNumberMapper.fromEntityListToIdNumberDtoList(listIdNumber.getContent()));
        responseListObj.setTotalPages(listIdNumber.getTotalPages());
        responseListObj.setTotalElements(listIdNumber.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list id number success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<IdNumberDto>>> autoComplete(IdNumberCriteria idNumberCriteria, @PageableDefault Pageable pageable) {
        idNumberCriteria.setCreatedBy(getCurrentUserName());
        idNumberCriteria.setStatus(AppConstant.STATUS_ACTIVE);
        Page<IdNumber> listIdNumber = idNumberRepository.findAll(idNumberCriteria.getCriteria(), pageable);
        ResponseListDto<List<IdNumberDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(idNumberMapper.fromEntityListToIdNumberDtoListAutoComplete(listIdNumber.getContent()));
        responseListObj.setTotalPages(listIdNumber.getTotalPages());
        responseListObj.setTotalElements(listIdNumber.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete id number success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ID_N_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateIdNumberForm form, BindingResult bindingResult) {
        if (idNumberRepository.existsByNameAndCreatedBy(form.getName(), getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.ID_NUMBER_ERROR_NAME_EXISTED, "Name existed");
        }
        if (idNumberRepository.existsByCodeAndCreatedBy(form.getCode(), getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.ID_NUMBER_ERROR_CODE_EXISTED, "Code existed");
        }
        IdNumber idNumber = idNumberMapper.fromCreateIdNumberFormToEntity(form);
        if (form.getTagId() != null) {
            Tag tag = tagRepository.findFirstByIdAndKindAndCreatedBy(form.getTagId(), AppConstant.TAG_KIND_ID_NUMBER, getCurrentUserName()).orElse(null);
            if (tag == null) {
                throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            idNumber.setTag(tag);
        } else {
            idNumber.setTag(null);
        }
        idNumberRepository.save(idNumber);
        return makeSuccessResponse(null, "Create id number success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ID_N_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateIdNumberForm form, BindingResult bindingResult) {
        IdNumber idNumber = idNumberRepository.findFirstByIdAndCreatedBy(form.getId(), getCurrentUserName()).orElse(null);
        if (idNumber == null) {
            throw new BadRequestException(ErrorCode.ID_NUMBER_ERROR_NOT_FOUND, "Not found id number");
        }
        if (idNumberRepository.existsByNameAndIdNotAndCreatedBy(form.getName(), idNumber.getId(), getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.ID_NUMBER_ERROR_NAME_EXISTED, "Name existed");
        }
        if (idNumberRepository.existsByCodeAndIdNotAndCreatedBy(form.getCode(), idNumber.getId(), getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.ID_NUMBER_ERROR_CODE_EXISTED, "Code existed");
        }
        idNumberMapper.fromUpdateIdNumberFormToEntity(form, idNumber);
        if (form.getTagId() != null) {
            Tag tag = tagRepository.findFirstByIdAndKindAndCreatedBy(form.getTagId(), AppConstant.TAG_KIND_ID_NUMBER, getCurrentUserName()).orElse(null);
            if (tag == null) {
                throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            idNumber.setTag(tag);
        } else {
            idNumber.setTag(null);
        }
        idNumberRepository.save(idNumber);
        return makeSuccessResponse(null, "Update id number success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ID_N_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        IdNumber idNumber = idNumberRepository.findFirstByIdAndCreatedBy(id, getCurrentUserName()).orElse(null);
        if (idNumber == null) {
            throw new BadRequestException(ErrorCode.ID_NUMBER_ERROR_NOT_FOUND, "Not found id number");
        }
        idNumberRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete id number success");
    }
}
