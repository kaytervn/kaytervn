package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.category.CategoryAdminDto;
import com.tenant.dto.category.CategoryDto;
import com.tenant.form.category.CreateCategoryForm;
import com.tenant.form.category.UpdateCategoryForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CategoryMapper extends EncryptDecryptMapper{
    @Mapping(source = "kind", target = "kind")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, createCategoryForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, createCategoryForm.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    Category fromCreateCategoryFormToEncryptEntity(CreateCategoryForm createCategoryForm, @Context String secretKey);

    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateCategoryForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, updateCategoryForm.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateCategoryFormToEncryptEntity(UpdateCategoryForm updateCategoryForm, @MappingTarget Category category, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, category.getName()))")
    @Mapping(target = "description", expression = "java(decryptAndEncrypt(keyWrapper, category.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptCategoryAdminDto")
    CategoryAdminDto fromEncryptEntityToEncryptCategoryAdminDto(Category category, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = CategoryAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptCategoryAdminDto")
    List<CategoryAdminDto> fromEncryptEntityListToEncryptCategoryAdminDtoList(List<Category> categories, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, category.getName()))")
    @Mapping(source = "kind", target = "kind")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptCategoryDto")
    CategoryDto fromEncryptEntityToEncryptCategoryDto(Category category, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = CategoryDto.class, qualifiedByName = "fromEncryptEntityToEncryptCategoryDto")
    List<CategoryDto> fromEncryptEntityListToEncryptCategoryDtoList(List<Category> categories, @Context KeyWrapperDto keyWrapper);
}
