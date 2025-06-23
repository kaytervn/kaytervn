package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.project.ProjectAdminDto;
import com.tenant.dto.project.ProjectDto;
import com.tenant.form.project.CreateProjectForm;
import com.tenant.form.project.UpdateProjectForm;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.repository.TaskRepository;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {OrganizationMapper.class, TagMapper.class})
public interface ProjectMapper extends EncryptDecryptMapper {

    @Mapping(target = "name", expression = "java(encrypt(secretKey, createProjectForm.getName()))")
    @Mapping(target = "logo", expression = "java(encrypt(secretKey, createProjectForm.getLogo()))")
    @Mapping(target = "note", expression = "java(encrypt(secretKey, createProjectForm.getNote()))")
    @BeanMapping(ignoreByDefault = true)
    Project fromCreateProjectFormToEntity(CreateProjectForm createProjectForm, @Context String secretKey);

    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateProjectForm.getName()))")
    @Mapping(target = "logo", expression = "java(encrypt(secretKey, updateProjectForm.getLogo()))")
    @Mapping(target = "note", expression = "java(encrypt(secretKey, updateProjectForm.getNote()))")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateProjectFormToEntity(UpdateProjectForm updateProjectForm, @MappingTarget Project project, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(source = "organization", target = "organization", qualifiedByName = "fromEncryptEntityToEncryptOrganizationDtoAutoComplete")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, project.getName()))")
    @Mapping(target = "logo", expression = "java(decryptAndEncrypt(keyWrapper, project.getLogo()))")
    @Mapping(target = "note", expression = "java(decryptAndEncrypt(keyWrapper, project.getNote()))")
    @Mapping(target = "totalTasks", expression = "java(countTotalTasksByProjectId(project.getId(), taskRepository))")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEncryptEntityToEncryptTagDtoAutoComplete")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptProjectAdminDto")
    ProjectAdminDto fromEncryptEntityToEncryptProjectAdminDto(Project project, @Context KeyWrapperDto keyWrapper, @Context TaskRepository taskRepository);

    @IterableMapping(elementTargetType = ProjectAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptProjectAdminDto")
    List<ProjectAdminDto> fromEncryptEntityListToEncryptProjectAdminDtoList(List<Project> projects, @Context KeyWrapperDto keyWrapper, @Context TaskRepository taskRepository);

    @Mapping(source = "id", target = "id")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, project.getName()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptProjectDtoAutoComplete")
    ProjectDto fromEncryptEntityToEncryptProjectDtoAutoComplete(Project project, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = ProjectDto.class, qualifiedByName = "fromEncryptEntityToEncryptProjectDtoAutoComplete")
    List<ProjectDto> fromEncryptEntityListToEncryptProjectDtoAutoCompleteList(List<Project> projects, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, project.getName()))")
    @Mapping(source = "organization", target = "organization", qualifiedByName = "fromEncryptEntityToEncryptOrganizationDtoAutoComplete")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptProjectDtoForTask")
    ProjectDto fromEncryptEntityToEncryptProjectDtoForTask(Project project, @Context KeyWrapperDto keyWrapper);
}
