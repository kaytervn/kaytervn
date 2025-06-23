package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.taskPermission.TaskPermissionAdminDto;
import com.tenant.dto.taskPermission.TaskPermissionDto;
import com.tenant.form.taskPermission.CreateTaskPermissionForm;
import com.tenant.form.taskPermission.UpdateTaskPermissionForm;
import com.tenant.mapper.TaskPermissionMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.service.KeyService;
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
@RequestMapping("/v1/task-permission")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class TaskPermissionController extends ABasicController {
    @Autowired
    private TaskPermissionRepository taskPermissionRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private TaskPermissionMapper taskPermissionMapper;
    @Autowired
    private KeyService keyService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_P_V')")
    public ApiMessageDto<TaskPermissionAdminDto> get(@PathVariable("id") Long id) {
        TaskPermission taskPermission = taskPermissionRepository.findById(id).orElse(null);
        if (taskPermission == null) {
            return makeErrorResponse(ErrorCode.TASK_PERMISSION_ERROR_NOT_FOUND, "Not found task permission");
        }
        return makeSuccessResponse(taskPermissionMapper.fromEncryptEntityToEncryptTaskPermissionAdminDto(taskPermission, keyService.getFinanceKeyWrapper()), "Get task permission success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_P_L')")
    public ApiMessageDto<ResponseListDto<List<TaskPermissionAdminDto>>> list(TaskPermissionCriteria taskPermissionCriteria, Pageable pageable) {
        if (taskPermissionCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<TaskPermission> taskPermissions = taskPermissionRepository.findAll(taskPermissionCriteria.getCriteria(), pageable);
        ResponseListDto<List<TaskPermissionAdminDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(taskPermissionMapper.fromEncryptEntityListToEncryptTaskPermissionAdminDtoList(taskPermissions.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(taskPermissions.getTotalPages());
        responseListObj.setTotalElements(taskPermissions.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list task permission success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<TaskPermissionDto>>> autoComplete(TaskPermissionCriteria taskPermissionCriteria) {
        Pageable pageable = taskPermissionCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        taskPermissionCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        Page<TaskPermission> taskPermissions = taskPermissionRepository.findAll(taskPermissionCriteria.getCriteria(), pageable);
        ResponseListDto<List<TaskPermissionDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(taskPermissionMapper.fromEncryptEntityListToEncryptTaskPermissionDtoList(taskPermissions.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(taskPermissions.getTotalPages());
        responseListObj.setTotalElements(taskPermissions.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list task permission success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_P_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateTaskPermissionForm createTaskPermissionForm, BindingResult bindingResult) {
        TaskPermission taskPermission = new TaskPermission();
        taskPermission.setPermissionKind(createTaskPermissionForm.getPermissionKind());
        Account account = accountRepository.findById(createTaskPermissionForm.getAccountId()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        taskPermission.setAccount(account);
        if (taskPermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_ITEM)) {
            if (createTaskPermissionForm.getTaskId() == null) {
                return makeErrorResponse(ErrorCode.TASK_ERROR_NOT_FOUND, "taskId cannot be null");
            }
            Task task = taskRepository.findById(createTaskPermissionForm.getTaskId()).orElse(null);
            if (task == null) {
                return makeErrorResponse(ErrorCode.TASK_ERROR_NOT_FOUND, "Not found task");
            }
            if (taskPermissionRepository.findFirstByAccountIdAndTaskId(account.getId(), task.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.TASK_PERMISSION_ERROR_ACCOUNT_AND_TASK_EXISTED, "Task permission exists in this account");
            }
            taskPermission.setTask(task);
        }
        if (taskPermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_GROUP)) {
            if (createTaskPermissionForm.getProjectId() == null) {
                return makeErrorResponse(ErrorCode.PROJECT_ERROR_NOT_FOUND, "projectId cannot be null");
            }
            Project project = projectRepository.findById(createTaskPermissionForm.getProjectId()).orElse(null);
            if (project == null) {
                return makeErrorResponse(ErrorCode.PROJECT_ERROR_NOT_FOUND, "Not found project");
            }
            if (taskPermissionRepository.findFirstByAccountIdAndProjectId(account.getId(), project.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.TASK_PERMISSION_ERROR_ACCOUNT_AND_PROJECT_EXISTED, "Project permission exists in this account");
            }
            taskPermission.setProject(project);
        }
        taskPermissionRepository.save(taskPermission);
        return makeSuccessResponse(null, "Create task permission success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_P_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateTaskPermissionForm updateTaskPermissionForm, BindingResult bindingResult) {
        TaskPermission taskPermission = taskPermissionRepository.findById(updateTaskPermissionForm.getId()).orElse(null);
        if (taskPermission == null) {
            return makeErrorResponse(ErrorCode.TASK_PERMISSION_ERROR_NOT_FOUND, "Not found task permission");
        }
        taskPermission.setPermissionKind(updateTaskPermissionForm.getPermissionKind());
        Account account = accountRepository.findById(updateTaskPermissionForm.getAccountId()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        taskPermission.setAccount(account);
        if (taskPermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_ITEM)) {
            if (updateTaskPermissionForm.getTaskId() == null) {
                return makeErrorResponse(ErrorCode.TASK_ERROR_NOT_FOUND, "taskId cannot be null");
            }
            Task task = taskRepository.findById(updateTaskPermissionForm.getTaskId()).orElse(null);
            if (task == null) {
                return makeErrorResponse(ErrorCode.TASK_ERROR_NOT_FOUND, "Not found task");
            }
            if (taskPermissionRepository.findFirstByAccountIdAndTaskId(account.getId(), task.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.TASK_PERMISSION_ERROR_ACCOUNT_AND_TASK_EXISTED, "Task permission exists in this account");
            }
            taskPermission.setTask(task);
        } else {
            taskPermission.setTask(null);
        }
        if (taskPermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_GROUP)) {
            if (updateTaskPermissionForm.getProjectId() == null) {
                return makeErrorResponse(ErrorCode.PROJECT_ERROR_NOT_FOUND, "projectId cannot be null");
            }
            Project project = projectRepository.findById(updateTaskPermissionForm.getProjectId()).orElse(null);
            if (project == null) {
                return makeErrorResponse(ErrorCode.PROJECT_ERROR_NOT_FOUND, "Not found project");
            }
            if (taskPermissionRepository.findFirstByAccountIdAndProjectId(account.getId(), project.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.TASK_PERMISSION_ERROR_ACCOUNT_AND_PROJECT_EXISTED, "Project permission exists in this account");
            }
            taskPermission.setProject(project);
        } else {
            taskPermission.setProject(null);
        }
        taskPermissionRepository.save(taskPermission);
        return makeSuccessResponse(null, "Update task permission success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_P_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        TaskPermission taskPermission = taskPermissionRepository.findById(id).orElse(null);
        if (taskPermission == null) {
            return makeErrorResponse(ErrorCode.TASK_PERMISSION_ERROR_NOT_FOUND, "Not found task permission");
        }
        taskPermissionRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete task permission success");
    }
}
