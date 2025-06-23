package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.task.TaskAdminDto;
import com.tenant.dto.task.TaskDto;
import com.tenant.form.task.CreateTaskForm;
import com.tenant.form.task.UpdateTaskForm;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.repository.TaskRepository;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {ProjectMapper.class})
public interface TaskMapper extends EncryptDecryptMapper {
    @Mapping(target = "name", expression = "java(encrypt(secretKey, createTaskForm.getName()))")
    @Mapping(target = "note", expression = "java(encrypt(secretKey, createTaskForm.getNote()))")
    @Mapping(target = "document", expression = "java(encrypt(secretKey, createTaskForm.getDocument()))")
    @Mapping(source = "state", target = "state")
    @BeanMapping(ignoreByDefault = true)
    Task fromCreateTaskFormToEncryptEntity(CreateTaskForm createTaskForm, @Context String secretKey);

    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateTaskForm.getName()))")
    @Mapping(target = "note", expression = "java(encrypt(secretKey, updateTaskForm.getNote()))")
    @Mapping(target = "document", expression = "java(encrypt(secretKey, updateTaskForm.getDocument()))")
    @Mapping(source = "state", target = "state")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateTaskFormToEncryptEntity(UpdateTaskForm updateTaskForm, @MappingTarget Task task, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, task.getName()))")
    @Mapping(target = "note", expression = "java(decryptAndEncrypt(keyWrapper, task.getNote()))")
    @Mapping(source = "project", target = "project", qualifiedByName = "fromEncryptEntityToEncryptProjectDtoForTask")
    @Mapping(source = "parent", target = "parent", qualifiedByName = "fromEncryptEntityToEncryptTaskDto")
    @Mapping(target = "document", expression = "java(decryptAndEncrypt(keyWrapper, task.getDocument()))")
    @Mapping(target = "totalChildren", expression = "java(countTotalChildrenByParentId(task.getId(), taskRepository))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTaskAdminDto")
    TaskAdminDto fromEncryptEntityToEncryptTaskAdminDto(Task task, @Context KeyWrapperDto keyWrapper, @Context TaskRepository taskRepository);

    @IterableMapping(elementTargetType = TaskAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptTaskAdminDto")
    List<TaskAdminDto> fromEncryptEntityListToEncryptTaskAdminDtoList(List<Task> tasks, @Context KeyWrapperDto keyWrapper, @Context TaskRepository taskRepository);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "state", target = "state")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, task.getName()))")
    @Mapping(target = "note", expression = "java(decryptAndEncrypt(keyWrapper, task.getNote()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTaskDto")
    TaskDto fromEncryptEntityToEncryptTaskDto(Task task, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = TaskDto.class, qualifiedByName = "fromEncryptEntityToEncryptTaskDto")
    List<TaskDto> fromEncryptEntityListToTaskDtoList(List<Task> tasks, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(target = "name", expression = "java(decrypt(secretKey, task.getName()))")
    @Mapping(target = "note", expression = "java(decrypt(secretKey, task.getNote()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToDecryptEntity")
    Task fromEncryptEntityToDecryptEntity(Task task, @Context String secretKey);

    @IterableMapping(elementTargetType = Task.class, qualifiedByName = "fromEncryptEntityToDecryptEntity")
    List<Task> fromEncryptEntityListToDecryptEntityList(List<Task> tasks, @Context String secretKey);

    @Mapping(source = "state", target = "state")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, task.getName()))")
    @Mapping(target = "note", expression = "java(encrypt(secretKey, task.getNote()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromDecryptEntityToEncryptEntity")
    Task fromDecryptEntityToEncryptEntity(Task task, @Context String secretKey);

    @IterableMapping(elementTargetType = Task.class, qualifiedByName = "fromDecryptEntityToEncryptEntity")
    List<Task> fromDecryptEntityListToEncryptEntityList(List<Task> tasks, @Context String secretKey);
}