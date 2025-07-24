package com.msa.mapper;

import com.msa.dto.note.NoteDto;
import com.msa.form.note.CreateNoteForm;
import com.msa.form.note.UpdateNoteForm;
import com.msa.storage.tenant.model.Note;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {TagMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface NoteMapper {
    @Mapping(source = "name", target = "name")
    @Mapping(source = "note", target = "note")
    @BeanMapping(ignoreByDefault = true)
    Note fromCreateNoteFormToEntity(CreateNoteForm createNoteForm);

    @Mapping(source = "name", target = "name")
    @Mapping(source = "note", target = "note")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateNoteFormToEntity(UpdateNoteForm updateNoteForm, @MappingTarget Note note);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "note", target = "note")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEntityToTagDtoAutoComplete")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToNoteDto")
    NoteDto fromEntityToNoteDto(Note note);

    @IterableMapping(elementTargetType = NoteDto.class, qualifiedByName = "fromEntityToNoteDto")
    List<NoteDto> fromEntityListToNoteDtoList(List<Note> noteList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToNoteDtoAutoComplete")
    NoteDto fromEntityToNoteDtoAutoComplete(Note note);

    @IterableMapping(elementTargetType = NoteDto.class, qualifiedByName = "fromEntityToNoteDtoAutoComplete")
    List<NoteDto> fromEntityListToNoteDtoListAutoComplete(List<Note> noteList);
}
