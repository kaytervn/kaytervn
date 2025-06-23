package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.task.TaskAdminDto;
import com.tenant.dto.task.TaskDto;
import com.tenant.form.task.*;
import com.tenant.mapper.TaskMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.service.DocumentService;
import com.tenant.service.ExcelService;
import com.tenant.service.KeyService;
import com.tenant.utils.DateUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/v1/task")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class TaskController extends ABasicController {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private TaskMapper taskMapper;
    @Autowired
    private KeyService keyService;
    @Autowired
    private ResourceLoader resourceLoader;
    @Autowired
    private ExcelService excelService;
    @Autowired
    private DocumentService documentService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_V')")
    public ApiMessageDto<TaskAdminDto> get(@PathVariable("id") Long id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) {
            return makeErrorResponse(ErrorCode.TASK_ERROR_NOT_FOUND, "Not found task");
        }
        TaskAdminDto taskAdminDto = taskMapper.fromEncryptEntityToEncryptTaskAdminDto(task, keyService.getFinanceKeyWrapper(), taskRepository);
        return makeSuccessResponse(taskAdminDto, "Get task success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_L')")
    public ApiMessageDto<ResponseListDto<List<TaskAdminDto>>> list(TaskCriteria taskCriteria, Pageable pageable) {
        if (taskCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)){
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        if (!isCustomer()) {
            taskCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<Task> tasks = taskRepository.findAll(taskCriteria.getCriteria(), pageable);
        ResponseListDto<List<TaskAdminDto>> responseListObj = new ResponseListDto<>();
        List<TaskAdminDto> taskAdminDtos = taskMapper.fromEncryptEntityListToEncryptTaskAdminDtoList(tasks.getContent(), keyService.getFinanceKeyWrapper(), taskRepository);
        responseListObj.setContent(taskAdminDtos);
        responseListObj.setTotalPages(tasks.getTotalPages());
        responseListObj.setTotalElements(tasks.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list task success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<TaskDto>>> autoComplete(TaskCriteria taskCriteria) {
        Pageable pageable = taskCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        taskCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        if (!isCustomer()) {
            taskCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<Task> tasks = taskRepository.findAll(taskCriteria.getCriteria(), pageable);
        ResponseListDto<List<TaskDto>> responseListObj = new ResponseListDto<>();
        List<TaskDto> taskDtos = taskMapper.fromEncryptEntityListToTaskDtoList(tasks.getContent(), keyService.getFinanceKeyWrapper());
        responseListObj.setContent(taskDtos);
        responseListObj.setTotalPages(tasks.getTotalPages());
        responseListObj.setTotalElements(tasks.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list task success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateTaskForm createTaskForm, BindingResult bindingResult) {
        Task task = taskMapper.fromCreateTaskFormToEncryptEntity(createTaskForm, keyService.getFinanceSecretKey());
        if (createTaskForm.getProjectId() != null) {
            Project project = projectRepository.findById(createTaskForm.getProjectId()).orElse(null);
            if (project == null) {
                return makeErrorResponse(ErrorCode.PROJECT_ERROR_NOT_FOUND, "Not found project");
            }
            task.setProject(project);
        }
        if (createTaskForm.getParentId() != null) {
            Task parent = taskRepository.findById(createTaskForm.getParentId()).orElse(null);
            if (parent == null) {
                return makeErrorResponse(ErrorCode.TASK_ERROR_NOT_FOUND, "Not found parent task");
            }
            if (parent.getParent() != null) {
                return makeErrorResponse(ErrorCode.TASK_ERROR_NOT_ALLOW_ADD_PARENT, "Not allowed to add parent");
            }
            if (parent.getProject() != null) {
                task.setProject(parent.getProject());
            }
            task.setParent(parent);
        }
        if (createTaskForm.getDocument() != null){
            if (documentService.isNotValidCreateDocumentString(createTaskForm.getDocument())) {
                return makeErrorResponse(ErrorCode.TASK_ERROR_DOCUMENT_INVALID, "Document name or url cannot be null");
            }
        }
        taskRepository.save(task);
        return makeSuccessResponse(null, "Create task success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateTaskForm updateTaskForm, BindingResult bindingResult) {
        Task task = taskRepository.findById(updateTaskForm.getId()).orElse(null);
        if (task == null) {
            return makeErrorResponse(ErrorCode.TASK_ERROR_NOT_FOUND, "Not found task");
        }
        if (task.getDocument() != null){
            if (documentService.isNotValidUpdateDocumentString(updateTaskForm.getDocument(), task.getDocument(), keyService.getFinanceSecretKey())) {
                return makeErrorResponse(ErrorCode.TASK_ERROR_DOCUMENT_INVALID, "Document name or url cannot be null");
            }
        }
        taskMapper.fromUpdateTaskFormToEncryptEntity(updateTaskForm, task, keyService.getFinanceSecretKey());
        if (updateTaskForm.getProjectId() != null && task.getParent() == null) {
            Project project = projectRepository.findById(updateTaskForm.getProjectId()).orElse(null);
            if (project == null) {
                return makeErrorResponse(ErrorCode.PROJECT_ERROR_NOT_FOUND, "Not found project");
            }
            if (!Objects.equals(task.getProject().getId(), project.getId())) {
                taskRepository.updateAllByParentId(project.getId(), task.getId());
            }
            task.setProject(project);
        } else {
            task.setProject(null);
        }
        taskRepository.save(task);
        return makeSuccessResponse(null, "Update task success");
    }

    @PutMapping(value = "/change-state", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_C_S')")
    public ApiMessageDto<String> changeState(@Valid @RequestBody ChangeStateTaskForm changeStateTaskForm, BindingResult bindingResult) {
        Task task = taskRepository.findById(changeStateTaskForm.getId()).orElse(null);
        if (task == null) {
            return makeErrorResponse(ErrorCode.TASK_ERROR_NOT_FOUND, "Not found task");
        }
        if (task.getState().equals(FinanceConstant.TASK_STATE_DONE)) {
            return makeErrorResponse(ErrorCode.TASK_ERROR_NOT_ALLOW_CHANGE_STATE, "Task has already been done!");
        }
        task.setState(FinanceConstant.TASK_STATE_DONE);
        taskRepository.save(task);
        return makeSuccessResponse(null, "Change state task success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TA_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) {
            return makeErrorResponse(ErrorCode.TASK_ERROR_NOT_FOUND, "Not found task");
        }
        documentService.deleteDocument(task.getDocument(), keyService.getFinanceSecretKey());
        taskRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete task success");
    }

    @PostMapping("/export-to-excel")
    @PreAuthorize("hasRole('TA_E_E')")
    public ResponseEntity<Resource> exportToExcel(@Valid @RequestBody ExportExcelTaskForm exportExcelTaskForm, BindingResult bindingResult) throws IOException {
        TaskCriteria taskCriteria = new TaskCriteria();
        taskCriteria.setTaskIds(exportExcelTaskForm.getTaskIds());
        Resource resource = resourceLoader.getResource("classpath:templates/export_list_task.xlsx");
        InputStream inputStream = resource.getInputStream();
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);
        Row dateRow = sheet.getRow(1);
        if (dateRow == null) {
            dateRow = sheet.createRow(1);
        }
        Cell cell = dateRow.getCell(0);
        if (cell == null) {
            cell = dateRow.createCell(0);
        }
        Date currentDate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        String formattedDate = dateFormat.format(currentDate);
        cell.setCellValue("Ngày xuất: " + formattedDate);
        List<Task> tasks = taskMapper.fromEncryptEntityListToDecryptEntityList(taskRepository.findAll(taskCriteria.getCriteria()), keyService.getFinanceSecretKey());
        // Fill data into sheet
        int startRow = 3;
        int orderNumber = 1;
        for (Task task: tasks) {
            Row currentRow = sheet.createRow(startRow++);
            fillDataIntoSheet(currentRow, orderNumber, task);
            orderNumber++;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename="  + excelService.generateFileName("Task"));
        ByteArrayOutputStream outPut = new ByteArrayOutputStream();
        workbook.write(outPut);
        ByteArrayResource byteArrayResource = new ByteArrayResource(outPut.toByteArray());
        return ResponseEntity.ok()
                .headers(headers)
                .body(byteArrayResource);
    }

    private void fillDataIntoSheet(Row row, int orderNumber, Task task) {
        try {
            CellStyle borderedCellStyle = excelService.createBorderCellStyle(row);
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            String formattedCreatedDate = dateFormat.format(DateUtils.convertUTCToVN(task.getCreatedDate()));
            excelService.createCell(row, 0, String.valueOf(orderNumber).trim(), borderedCellStyle);
            excelService.createCell(row, 1, formattedCreatedDate, borderedCellStyle);
            excelService.createCell(row, 2, task.getName(), borderedCellStyle);
            excelService.createCell(row, 3, excelService.mapTaskState(task.getState()), borderedCellStyle);
            excelService.createCell(row, 4, task.getNote(), borderedCellStyle);
        } catch (Exception e) {
            log.error("Error filling row {}: ", row.getRowNum(), e);
        }
    }
}
