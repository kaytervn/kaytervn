package com.msa.controller;

import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.contact.ContactDto;
import com.msa.exception.BadRequestException;
import com.msa.form.contact.CreateContactForm;
import com.msa.form.contact.UpdateContactForm;
import com.msa.mapper.ContactMapper;
import com.msa.storage.tenant.model.Contact;
import com.msa.storage.tenant.model.Tag;
import com.msa.storage.tenant.model.criteria.ContactCriteria;
import com.msa.storage.tenant.repository.ContactRepository;
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
@RequestMapping("/v1/contact")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ContactController extends ABasicController {
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private ContactMapper contactMapper;
    @Autowired
    private TagRepository tagRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CO_V')")
    public ApiMessageDto<ContactDto> get(@PathVariable("id") Long id) {
        Contact contact = contactRepository.findFirstByIdAndCreatedBy(id, getCurrentUserName()).orElse(null);
        if (contact == null) {
            throw new BadRequestException(ErrorCode.CONTACT_ERROR_NOT_FOUND, "Not found contact");
        }
        return makeSuccessResponse(contactMapper.fromEntityToContactDto(contact), "Get contact success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CO_L')")
    public ApiMessageDto<ResponseListDto<List<ContactDto>>> list(ContactCriteria contactCriteria, Pageable pageable) {
        contactCriteria.setCreatedBy(getCurrentUserName());
        Page<Contact> listContact = contactRepository.findAll(contactCriteria.getCriteria(), pageable);
        ResponseListDto<List<ContactDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(contactMapper.fromEntityListToContactDtoList(listContact.getContent()));
        responseListObj.setTotalPages(listContact.getTotalPages());
        responseListObj.setTotalElements(listContact.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list contact success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<ContactDto>>> autoComplete(ContactCriteria contactCriteria, @PageableDefault Pageable pageable) {
        contactCriteria.setStatus(AppConstant.STATUS_ACTIVE);
        contactCriteria.setCreatedBy(getCurrentUserName());
        Page<Contact> listContact = contactRepository.findAll(contactCriteria.getCriteria(), pageable);
        ResponseListDto<List<ContactDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(contactMapper.fromEntityListToContactDtoListAutoComplete(listContact.getContent()));
        responseListObj.setTotalPages(listContact.getTotalPages());
        responseListObj.setTotalElements(listContact.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete contact success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CO_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateContactForm form, BindingResult bindingResult) {
        if (contactRepository.existsByNameAndCreatedBy(form.getName(), getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.CONTACT_ERROR_NAME_EXISTED, "Name existed");
        }
        if (contactRepository.existsByPhoneAndCreatedBy(form.getPhone(), getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.CONTACT_ERROR_PHONE_EXISTED, "Phone existed");
        }
        Contact contact = contactMapper.fromCreateContactFormToEntity(form);
        if (form.getTagId() != null) {
            Tag tag = tagRepository.findFirstByIdAndKindAndCreatedBy(form.getTagId(), AppConstant.TAG_KIND_CONTACT, getCurrentUserName()).orElse(null);
            if (tag == null) {
                throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            contact.setTag(tag);
        } else {
            contact.setTag(null);
        }
        contactRepository.save(contact);
        return makeSuccessResponse(null, "Create contact success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CO_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateContactForm form, BindingResult bindingResult) {
        Contact contact = contactRepository.findFirstByIdAndCreatedBy(form.getId(), getCurrentUserName()).orElse(null);
        if (contact == null) {
            throw new BadRequestException(ErrorCode.CONTACT_ERROR_NOT_FOUND, "Not found contact");
        }
        if (contactRepository.existsByNameAndIdNotAndCreatedBy(form.getName(), contact.getId(), getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.CONTACT_ERROR_NAME_EXISTED, "Name existed");
        }
        if (contactRepository.existsByPhoneAndIdNotAndCreatedBy(form.getPhone(), contact.getId(), getCurrentUserName())) {
            throw new BadRequestException(ErrorCode.CONTACT_ERROR_PHONE_EXISTED, "Phone existed");
        }
        contactMapper.fromUpdateContactFormToEntity(form, contact);
        if (form.getTagId() != null) {
            Tag tag = tagRepository.findFirstByIdAndKindAndCreatedBy(form.getTagId(), AppConstant.TAG_KIND_CONTACT, getCurrentUserName()).orElse(null);
            if (tag == null) {
                throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            contact.setTag(tag);
        } else {
            contact.setTag(null);
        }
        contactRepository.save(contact);
        return makeSuccessResponse(null, "Update contact success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CO_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Contact contact = contactRepository.findFirstByIdAndCreatedBy(id, getCurrentUserName()).orElse(null);
        if (contact == null) {
            throw new BadRequestException(ErrorCode.CONTACT_ERROR_NOT_FOUND, "Not found contact");
        }
        contactRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete contact success");
    }
}
