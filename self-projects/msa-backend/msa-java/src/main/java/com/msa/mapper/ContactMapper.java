package com.msa.mapper;

import com.msa.dto.contact.ContactDto;
import com.msa.form.contact.CreateContactForm;
import com.msa.form.contact.UpdateContactForm;
import com.msa.storage.tenant.model.Contact;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {TagMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ContactMapper {
    @Mapping(source = "name", target = "name")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "phones", target = "phones")
    @Mapping(source = "note", target = "note")
    @BeanMapping(ignoreByDefault = true)
    Contact fromCreateContactFormToEntity(CreateContactForm createContactForm);

    @Mapping(source = "name", target = "name")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "phones", target = "phones")
    @Mapping(source = "note", target = "note")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateContactFormToEntity(UpdateContactForm updateContactForm, @MappingTarget Contact contact);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "phones", target = "phones")
    @Mapping(source = "note", target = "note")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEntityToTagDtoAutoComplete")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToContactDto")
    ContactDto fromEntityToContactDto(Contact contact);

    @IterableMapping(elementTargetType = ContactDto.class, qualifiedByName = "fromEntityToContactDto")
    List<ContactDto> fromEntityListToContactDtoList(List<Contact> contactList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "phone", target = "phone")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToContactDtoAutoComplete")
    ContactDto fromEntityToContactDtoAutoComplete(Contact contact);

    @IterableMapping(elementTargetType = ContactDto.class, qualifiedByName = "fromEntityToContactDtoAutoComplete")
    List<ContactDto> fromEntityListToContactDtoListAutoComplete(List<Contact> contactList);
}
