package com.msa.controller;

import com.msa.component.AuditLogAnnotation;
import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.bank.BankDto;
import com.msa.exception.BadRequestException;
import com.msa.form.bank.CreateBankForm;
import com.msa.form.bank.UpdateBankForm;
import com.msa.form.json.BasicObject;
import com.msa.mapper.BankMapper;
import com.msa.service.BasicApiService;
import com.msa.service.encryption.EncryptionService;
import com.msa.storage.tenant.model.Bank;
import com.msa.storage.tenant.model.Tag;
import com.msa.storage.tenant.model.criteria.BankCriteria;
import com.msa.storage.tenant.repository.BankRepository;
import com.msa.storage.tenant.repository.TagRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
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
@RequestMapping("/v1/bank")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BankController extends ABasicController {
    @Autowired
    private BankRepository bankRepository;
    @Autowired
    private BankMapper bankMapper;
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private EncryptionService encryptionService;
    @Autowired
    private BasicApiService basicApiService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BA_V')")
    public ApiMessageDto<BankDto> get(@PathVariable("id") Long id) {
        Bank bank = bankRepository.findFirstByIdAndCreatedBy(id, getCurrentUserName()).orElse(null);
        if (bank == null) {
            throw new BadRequestException(ErrorCode.BANK_ERROR_NOT_FOUND, "Not found bank");
        }
        return makeSuccessResponse(bankMapper.fromEntityToBankDto(bank, encryptionService.getServerKeyWrapper()), "Get bank success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BA_L')")
    public ApiMessageDto<ResponseListDto<List<BankDto>>> list(BankCriteria bankCriteria, Pageable pageable) {
        bankCriteria.setCreatedBy(getCurrentUserName());
        Page<Bank> listBank = bankRepository.findAll(bankCriteria.getCriteria(), pageable);
        ResponseListDto<List<BankDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(bankMapper.fromEntityListToBankDtoList(listBank.getContent(), encryptionService.getServerKeyWrapper()));
        responseListObj.setTotalPages(listBank.getTotalPages());
        responseListObj.setTotalElements(listBank.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list bank success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<BankDto>>> autoComplete(BankCriteria bankCriteria, @PageableDefault Pageable pageable) {
        bankCriteria.setCreatedBy(getCurrentUserName());
        bankCriteria.setStatus(AppConstant.STATUS_ACTIVE);
        Page<Bank> listBank = bankRepository.findAll(bankCriteria.getCriteria(), pageable);
        ResponseListDto<List<BankDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(bankMapper.fromEntityListToBankDtoListAutoComplete(listBank.getContent()));
        responseListObj.setTotalPages(listBank.getTotalPages());
        responseListObj.setTotalElements(listBank.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete bank success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BA_C')")
    @AuditLogAnnotation()
    public ApiMessageDto<String> create(@Valid @RequestBody CreateBankForm form, BindingResult bindingResult) {
        String password = encryptionService.userDecrypt(form.getPassword());
        String pins = encryptionService.userDecrypt(form.getPins());
        if (StringUtils.isBlank(password) || StringUtils.isBlank(pins)) {
            throw new BadRequestException("password and pins are required");
        }
        List<BasicObject> listPins = basicApiService.extractListBasicJson(pins);
        if (listPins == null) {
            throw new BadRequestException("Invalid pin format");
        }
        Bank bank = bankMapper.fromCreateBankFormToEntity(form);
        Tag tag = tagRepository.findFirstByIdAndKindAndCreatedBy(form.getTagId(), AppConstant.TAG_KIND_BANK, getCurrentUserName()).orElse(null);
        if (tag == null) {
            throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
        }
        if (bankRepository.existsByUsernameAndTagIdAndCreatedBy(form.getUsername(), form.getTagId(), getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.BANK_ERROR_USERNAME_EXISTED, "Username existed with this tag");
        }
        bank.setTag(tag);
        bank.setPassword(encryptionService.serverEncrypt(password));
        bank.setPins(encryptionService.serverEncrypt(pins));
        bankRepository.save(bank);
        return makeSuccessResponse(null, "Create bank success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BA_U')")
    @AuditLogAnnotation()
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateBankForm form, BindingResult bindingResult) {
        String password = encryptionService.userDecrypt(form.getPassword());
        String pins = encryptionService.userDecrypt(form.getPins());
        if (StringUtils.isBlank(password) || StringUtils.isBlank(pins)) {
            throw new BadRequestException("password and pins are required");
        }
        List<BasicObject> listPins = basicApiService.extractListBasicJson(pins);
        if (listPins == null) {
            throw new BadRequestException("Invalid pin format");
        }
        Bank bank = bankRepository.findFirstByIdAndCreatedBy(form.getId(), getCurrentUserName()).orElse(null);
        if (bank == null) {
            throw new BadRequestException(ErrorCode.BANK_ERROR_NOT_FOUND, "Not found bank");
        }
        bankMapper.fromUpdateBankFormToEntity(form, bank);
        Tag tag = tagRepository.findFirstByIdAndKindAndCreatedBy(form.getTagId(), AppConstant.TAG_KIND_BANK, getCurrentUserName()).orElse(null);
        if (tag == null) {
            throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
        }
        if (bankRepository.existsByUsernameAndTagIdAndIdNotAndCreatedBy(form.getUsername(), form.getTagId(), bank.getId(), getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.BANK_ERROR_USERNAME_EXISTED, "Username existed with this tag");
        }
        bank.setTag(tag);
        bank.setPassword(encryptionService.serverEncrypt(password));
        bank.setPins(encryptionService.serverEncrypt(pins));
        bankRepository.save(bank);
        return makeSuccessResponse(null, "Update bank success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BA_D')")
    @AuditLogAnnotation()
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Bank bank = bankRepository.findFirstByIdAndCreatedBy(id, getCurrentUserName()).orElse(null);
        if (bank == null) {
            throw new BadRequestException(ErrorCode.BANK_ERROR_NOT_FOUND, "Not found bank");
        }
        bankRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete bank success");
    }
}