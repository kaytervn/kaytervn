package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.tag.TagAdminDto;
import com.tenant.dto.tag.TagDto;
import com.tenant.form.tag.CreateTagForm;
import com.tenant.form.tag.UpdateTagForm;
import com.tenant.mapper.TagMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.service.KeyService;
import com.tenant.utils.AESUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/v1/tag")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class TagController extends ABasicController {
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private TagMapper tagMapper;
    @Autowired
    private KeyService keyService;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private DebitRepository debitRepository;
    @Autowired
    private KeyInformationRepository keyInformationRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TAG_V')")
    public ApiMessageDto<TagAdminDto> get(@PathVariable("id") Long id) {
        Tag tag = tagRepository.findById(id).orElse(null);
        if (tag == null) {
            return makeErrorResponse(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
        }
        TagAdminDto tagAdminDto = tagMapper.fromEncryptEntityToEncryptTagAdminDto(tag, keyService.getFinanceKeyWrapper());
        return makeSuccessResponse(tagAdminDto, "Get tag success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TAG_L')")
    public ApiMessageDto<ResponseListDto<List<TagAdminDto>>> list(TagCriteria tagCriteria, Pageable pageable) {
        if (tagCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<Tag> tags = tagRepository.findAll(tagCriteria.getCriteria(), pageable);
        ResponseListDto<List<TagAdminDto>> responseListObj = new ResponseListDto<>();
        List<TagAdminDto> tagAdminDtos = tagMapper.fromEncryptEntityListToEncryptTagAdminDtoList(tags.getContent(), keyService.getFinanceKeyWrapper());
        responseListObj.setContent(tagAdminDtos);
        responseListObj.setTotalPages(tags.getTotalPages());
        responseListObj.setTotalElements(tags.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list tag success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<TagDto>>> autoComplete(TagCriteria tagCriteria) {
        Pageable pageable = tagCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        tagCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        Page<Tag> tags = tagRepository.findAll(tagCriteria.getCriteria(), pageable);
        ResponseListDto<List<TagDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(tagMapper.fromEncryptEntityListToEncryptTagDtoAutoCompleteList(tags.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(tags.getTotalPages());
        responseListObj.setTotalElements(tags.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list tag success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TAG_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateTagForm createTagForm, BindingResult bindingResult) {
        Tag tag = tagMapper.fromCreateTagFormToEntity(createTagForm, keyService.getFinanceSecretKey());
        if (tagRepository.findFirstByNameAndKind(tag.getName(), tag.getKind()).isPresent()) {
            return makeErrorResponse(ErrorCode.TAG_ERROR_NAME_EXISTED, "Name tag existed for this kind");
        }
        tagRepository.save(tag);
        return makeSuccessResponse(null, "Create tag success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TAG_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateTagForm updateTagForm, BindingResult bindingResult) {
        Tag tag = tagRepository.findById(updateTagForm.getId()).orElse(null);
        if (tag == null) {
            return makeErrorResponse(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
        }
        String encryptName = AESUtils.encrypt(keyService.getFinanceSecretKey(), updateTagForm.getName(), FinanceConstant.AES_ZIP_ENABLE);
        if (!tag.getName().equals(encryptName) && tagRepository.findFirstByNameAndKind(encryptName, tag.getKind()).isPresent()) {
            return makeErrorResponse(ErrorCode.TAG_ERROR_NAME_EXISTED, "Name tag existed for this kind");
        }
        tagMapper.fromUpdateTagFormToEntity(updateTagForm, tag, keyService.getFinanceSecretKey());
        tagRepository.save(tag);
        return makeSuccessResponse(null, "Update tag success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TAG_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Tag tag = tagRepository.findById(id).orElse(null);
        if (tag == null) {
            return makeErrorResponse(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
        }
        transactionRepository.updateAllByTagId(id);
        debitRepository.updateAllByTagId(id);
        serviceRepository.updateAllByTagId(id);
        keyInformationRepository.updateAllByTagId(id);
        projectRepository.updateAllByTagId(id);
        tagRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete tag success");
    }
}
