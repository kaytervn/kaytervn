package com.msa.controller;

import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.note.NoteDto;
import com.msa.exception.BadRequestException;
import com.msa.form.note.CreateNoteForm;
import com.msa.form.note.UpdateNoteForm;
import com.msa.mapper.NoteMapper;
import com.msa.storage.tenant.model.Note;
import com.msa.storage.tenant.model.Tag;
import com.msa.storage.tenant.model.criteria.NoteCriteria;
import com.msa.storage.tenant.repository.NoteRepository;
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
@RequestMapping("/v1/note")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NoteController extends ABasicController {
    @Autowired
    private NoteRepository noteRepository;
    @Autowired
    private NoteMapper noteMapper;
    @Autowired
    private TagRepository tagRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NO_V')")
    public ApiMessageDto<NoteDto> get(@PathVariable("id") Long id) {
        Note note = noteRepository.findById(id).orElse(null);
        if (note == null) {
            throw new BadRequestException(ErrorCode.NOTE_ERROR_NOT_FOUND, "Not found note");
        }
        return makeSuccessResponse(noteMapper.fromEntityToNoteDto(note), "Get note success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NO_L')")
    public ApiMessageDto<ResponseListDto<List<NoteDto>>> list(NoteCriteria noteCriteria, Pageable pageable) {
        Page<Note> listNote = noteRepository.findAll(noteCriteria.getCriteria(), pageable);
        ResponseListDto<List<NoteDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(noteMapper.fromEntityListToNoteDtoList(listNote.getContent()));
        responseListObj.setTotalPages(listNote.getTotalPages());
        responseListObj.setTotalElements(listNote.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list note success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<NoteDto>>> autoComplete(NoteCriteria noteCriteria, @PageableDefault Pageable pageable) {
        noteCriteria.setStatus(AppConstant.STATUS_ACTIVE);
        Page<Note> listNote = noteRepository.findAll(noteCriteria.getCriteria(), pageable);
        ResponseListDto<List<NoteDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(noteMapper.fromEntityListToNoteDtoListAutoComplete(listNote.getContent()));
        responseListObj.setTotalPages(listNote.getTotalPages());
        responseListObj.setTotalElements(listNote.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete note success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NO_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateNoteForm form, BindingResult bindingResult) {
        if (noteRepository.existsByName(form.getName())) {
            throw new BadRequestException(ErrorCode.NOTE_ERROR_NAME_EXISTED, "Name existed");
        }
        Note note = noteMapper.fromCreateNoteFormToEntity(form);
        if (form.getTagId() != null) {
            Tag tag = tagRepository.findFirstByIdAndKind(form.getTagId(), AppConstant.TAG_KIND_NOTE).orElse(null);
            if (tag == null) {
                throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            note.setTag(tag);
        } else {
            note.setTag(null);
        }
        noteRepository.save(note);
        return makeSuccessResponse(null, "Create note success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NO_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateNoteForm form, BindingResult bindingResult) {
        Note note = noteRepository.findById(form.getId()).orElse(null);
        if (note == null) {
            throw new BadRequestException(ErrorCode.NOTE_ERROR_NOT_FOUND, "Not found note");
        }
        if (noteRepository.existsByNameAndIdNot(form.getName(), note.getId())) {
            throw new BadRequestException(ErrorCode.NOTE_ERROR_NAME_EXISTED, "Name existed");
        }
        noteMapper.fromUpdateNoteFormToEntity(form, note);
        if (form.getTagId() != null) {
            Tag tag = tagRepository.findFirstByIdAndKind(form.getTagId(), AppConstant.TAG_KIND_NOTE).orElse(null);
            if (tag == null) {
                throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            note.setTag(tag);
        } else {
            note.setTag(null);
        }
        noteRepository.save(note);
        return makeSuccessResponse(null, "Update note success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NO_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Note note = noteRepository.findById(id).orElse(null);
        if (note == null) {
            throw new BadRequestException(ErrorCode.NOTE_ERROR_NOT_FOUND, "Not found note");
        }
        noteRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete note success");
    }
}
