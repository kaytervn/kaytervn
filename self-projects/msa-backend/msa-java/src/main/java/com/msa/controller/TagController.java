package com.msa.controller;

import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.tag.TagDto;
import com.msa.exception.BadRequestException;
import com.msa.form.tag.CreateTagForm;
import com.msa.form.tag.UpdateTagForm;
import com.msa.mapper.TagMapper;
import com.msa.storage.tenant.model.Tag;
import com.msa.storage.tenant.model.criteria.TagCriteria;
import com.msa.storage.tenant.repository.*;
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
@RequestMapping("/v1/tag")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TagController extends ABasicController {
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private TagMapper tagMapper;
    @Autowired
    private BankRepository bankRepository;
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private IdNumberRepository idNumberRepository;
    @Autowired
    private LinkRepository linkRepository;
    @Autowired
    private NoteRepository noteRepository;
    @Autowired
    private SoftwareRepository softwareRepository;
    @Autowired
    private ScheduleRepository scheduleRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_V')")
    public ApiMessageDto<TagDto> get(@PathVariable("id") Long id) {
        Tag tag = tagRepository.findById(id).orElse(null);
        if (tag == null) {
            throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
        }
        return makeSuccessResponse(tagMapper.fromEntityToTagDto(tag), "Get tag success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_L')")
    public ApiMessageDto<ResponseListDto<List<TagDto>>> list(TagCriteria tagCriteria, Pageable pageable) {
        Page<Tag> listTag = tagRepository.findAll(tagCriteria.getCriteria(), pageable);
        ResponseListDto<List<TagDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(tagMapper.fromEntityListToTagDtoList(listTag.getContent()));
        responseListObj.setTotalPages(listTag.getTotalPages());
        responseListObj.setTotalElements(listTag.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list tag success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<TagDto>>> autoComplete(TagCriteria tagCriteria, @PageableDefault Pageable pageable) {
        tagCriteria.setStatus(AppConstant.STATUS_ACTIVE);
        Page<Tag> listTag = tagRepository.findAll(tagCriteria.getCriteria(), pageable);
        ResponseListDto<List<TagDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(tagMapper.fromEntityListToTagDtoListAutoComplete(listTag.getContent()));
        responseListObj.setTotalPages(listTag.getTotalPages());
        responseListObj.setTotalElements(listTag.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete tag success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateTagForm form, BindingResult bindingResult) {
        if (tagRepository.existsByNameAndKind(form.getName(), form.getKind())) {
            throw new BadRequestException(ErrorCode.TAG_ERROR_NAME_EXISTED, "Name existed with this kind");
        }
        Tag tag = tagMapper.fromCreateTagFormToEntity(form);
        tagRepository.save(tag);
        return makeSuccessResponse(null, "Create tag success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateTagForm form, BindingResult bindingResult) {
        Tag tag = tagRepository.findById(form.getId()).orElse(null);
        if (tag == null) {
            throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
        }
        if (tagRepository.existsByNameAndKindAndIdNot(form.getName(), tag.getKind(), tag.getId())) {
            throw new BadRequestException(ErrorCode.TAG_ERROR_NAME_EXISTED, "Name existed with this kind");
        }
        tagMapper.fromUpdateTagFormToEntity(form, tag);
        tagRepository.save(tag);
        return makeSuccessResponse(null, "Update tag success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Tag tag = tagRepository.findById(id).orElse(null);
        if (tag == null) {
            throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
        }
        if (AppConstant.TAG_KIND_ACCOUNT.equals(tag.getKind())) {
            accountRepository.updateTagIdNull(id);
        } else if (AppConstant.TAG_KIND_BANK.equals(tag.getKind()) && bankRepository.existsByTagId(id)) {
            throw new BadRequestException(ErrorCode.TAG_ERROR_BANK_EXISTED, "Bank existed");
        } else if (AppConstant.TAG_KIND_CONTACT.equals(tag.getKind())) {
            contactRepository.updateTagIdNull(id);
        } else if (AppConstant.TAG_KIND_ID_NUMBER.equals(tag.getKind())) {
            idNumberRepository.updateTagIdNull(id);
        } else if (AppConstant.TAG_KIND_LINK.equals(tag.getKind())) {
            linkRepository.updateTagIdNull(id);
        } else if (AppConstant.TAG_KIND_NOTE.equals(tag.getKind())) {
            noteRepository.updateTagIdNull(id);
        } else if (AppConstant.TAG_KIND_SOFTWARE.equals(tag.getKind())) {
            softwareRepository.updateTagIdNull(id);
        } else if (AppConstant.TAG_KIND_SCHEDULE.equals(tag.getKind())) {
            scheduleRepository.updateTagIdNull(id);
        }
        tagRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete tag success");
    }
}