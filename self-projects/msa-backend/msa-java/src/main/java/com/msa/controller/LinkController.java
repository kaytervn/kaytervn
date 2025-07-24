package com.msa.controller;

import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.link.LinkDto;
import com.msa.exception.BadRequestException;
import com.msa.form.link.CreateLinkForm;
import com.msa.form.link.UpdateLinkForm;
import com.msa.mapper.LinkMapper;
import com.msa.storage.tenant.model.Link;
import com.msa.storage.tenant.model.Tag;
import com.msa.storage.tenant.model.criteria.LinkCriteria;
import com.msa.storage.tenant.repository.LinkRepository;
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
@RequestMapping("/v1/link")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LinkController extends ABasicController {
    @Autowired
    private LinkRepository linkRepository;
    @Autowired
    private LinkMapper linkMapper;
    @Autowired
    private TagRepository tagRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('LI_V')")
    public ApiMessageDto<LinkDto> get(@PathVariable("id") Long id) {
        Link link = linkRepository.findById(id).orElse(null);
        if (link == null) {
            throw new BadRequestException(ErrorCode.LINK_ERROR_NOT_FOUND, "Not found link");
        }
        return makeSuccessResponse(linkMapper.fromEntityToLinkDto(link), "Get link success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('LI_L')")
    public ApiMessageDto<ResponseListDto<List<LinkDto>>> list(LinkCriteria linkCriteria, Pageable pageable) {
        Page<Link> listLink = linkRepository.findAll(linkCriteria.getCriteria(), pageable);
        ResponseListDto<List<LinkDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(linkMapper.fromEntityListToLinkDtoList(listLink.getContent()));
        responseListObj.setTotalPages(listLink.getTotalPages());
        responseListObj.setTotalElements(listLink.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list link success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<LinkDto>>> autoComplete(LinkCriteria linkCriteria, @PageableDefault Pageable pageable) {
        linkCriteria.setStatus(AppConstant.STATUS_ACTIVE);
        Page<Link> listLink = linkRepository.findAll(linkCriteria.getCriteria(), pageable);
        ResponseListDto<List<LinkDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(linkMapper.fromEntityListToLinkDtoListAutoComplete(listLink.getContent()));
        responseListObj.setTotalPages(listLink.getTotalPages());
        responseListObj.setTotalElements(listLink.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete link success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('LI_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateLinkForm form, BindingResult bindingResult) {
        if (linkRepository.existsByName(form.getName())) {
            throw new BadRequestException(ErrorCode.LINK_ERROR_NAME_EXISTED, "Name existed");
        }
        if (linkRepository.existsByLink(form.getLink())) {
            throw new BadRequestException(ErrorCode.LINK_ERROR_LINK_EXISTED, "Link existed");
        }
        Link link = linkMapper.fromCreateLinkFormToEntity(form);
        if (form.getTagId() != null) {
            Tag tag = tagRepository.findFirstByIdAndKind(form.getTagId(), AppConstant.TAG_KIND_LINK).orElse(null);
            if (tag == null) {
                throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            link.setTag(tag);
        } else {
            link.setTag(null);
        }
        linkRepository.save(link);
        return makeSuccessResponse(null, "Create link success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('LI_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateLinkForm form, BindingResult bindingResult) {
        Link link = linkRepository.findById(form.getId()).orElse(null);
        if (link == null) {
            throw new BadRequestException(ErrorCode.LINK_ERROR_NOT_FOUND, "Not found link");
        }
        if (linkRepository.existsByNameAndIdNot(form.getName(), link.getId())) {
            throw new BadRequestException(ErrorCode.LINK_ERROR_NAME_EXISTED, "Name existed");
        }
        if (linkRepository.existsByLinkAndIdNot(form.getLink(), link.getId())) {
            throw new BadRequestException(ErrorCode.LINK_ERROR_LINK_EXISTED, "Link existed");
        }
        linkMapper.fromUpdateLinkFormToEntity(form, link);
        if (form.getTagId() != null) {
            Tag tag = tagRepository.findFirstByIdAndKind(form.getTagId(), AppConstant.TAG_KIND_LINK).orElse(null);
            if (tag == null) {
                throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            link.setTag(tag);
        } else {
            link.setTag(null);
        }
        linkRepository.save(link);
        return makeSuccessResponse(null, "Update link success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('LI_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Link link = linkRepository.findById(id).orElse(null);
        if (link == null) {
            throw new BadRequestException(ErrorCode.LINK_ERROR_NOT_FOUND, "Not found link");
        }
        linkRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete link success");
    }
}
