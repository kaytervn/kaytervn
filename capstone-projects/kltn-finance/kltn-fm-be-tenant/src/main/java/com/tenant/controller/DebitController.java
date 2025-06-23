package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.debit.DebitAdminDto;
import com.tenant.dto.debit.DebitDto;
import com.tenant.form.debit.ApproveDebitForm;
import com.tenant.form.debit.ExportExcelDebitForm;
import com.tenant.form.debit.UpdateDebitForm;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.mapper.DebitMapper;
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
@RequestMapping("/v1/debit")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class DebitController extends ABasicController {
    @Autowired
    private DebitRepository debitRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private TransactionGroupRepository transactionGroupRepository;
    @Autowired
    private DebitMapper debitMapper;
    @Autowired
    private DocumentService documentService;
    @Autowired
    private KeyService keyService;
    @Autowired
    private ResourceLoader resourceLoader;
    @Autowired
    private ExcelService excelService;
    @Autowired
    private TagRepository tagRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('DEB_V')")
    public ApiMessageDto<DebitAdminDto> get(@PathVariable("id") Long id) {
        Debit debit = debitRepository.findById(id).orElse(null);
        if (debit == null) {
            return makeErrorResponse(ErrorCode.DEBIT_ERROR_NOT_FOUND, "Not found debit");
        }
        DebitAdminDto debitAdminDto = debitMapper.fromEncryptEntityToEncryptDebitAdminDto(debit, keyService.getFinanceKeyWrapper());
        return makeSuccessResponse(debitAdminDto, "Get debit success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('DEB_L')")
    public ApiMessageDto<ResponseListDto<List<DebitAdminDto>>> list(DebitCriteria debitCriteria, Pageable pageable) {
        if (debitCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)){
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        if (!isCustomer()) {
            debitCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<Debit> debits = debitRepository.findAll(debitCriteria.getCriteria(), pageable);
        ResponseListDto<List<DebitAdminDto>> responseListObj = new ResponseListDto<>();
        List<DebitAdminDto> debitAdminDtos = debitMapper.fromEncryptEntityListToEncryptDebitAdminDtoList(debits.getContent(), keyService.getFinanceKeyWrapper());
        responseListObj.setContent(debitAdminDtos);
        responseListObj.setTotalPages(debits.getTotalPages());
        responseListObj.setTotalElements(debits.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list debit success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<DebitDto>>> autoComplete(DebitCriteria debitCriteria) {
        Pageable pageable = debitCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        debitCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        if (!isCustomer()) {
            debitCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<Debit> debits = debitRepository.findAll(debitCriteria.getCriteria(), pageable);
        ResponseListDto<List<DebitDto>> responseListObj = new ResponseListDto<>();
        List<DebitDto> debitDtos = debitMapper.fromEncryptEntityListToEncryptDebitDtoAutoCompleteList(debits.getContent(), keyService.getFinanceKeyWrapper());
        responseListObj.setContent(debitDtos);
        responseListObj.setTotalPages(debits.getTotalPages());
        responseListObj.setTotalElements(debits.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list debit success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('DEB_U', 'DEB_U_FA')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateDebitForm updateDebitForm, BindingResult bindingResult) {
        boolean hasFullAuthority = hasRole("DEB_U_FA");
        Debit debit = debitRepository.findById(updateDebitForm.getId()).orElse(null);
        if (debit == null) {
            return makeErrorResponse(ErrorCode.DEBIT_ERROR_NOT_FOUND, "Not found debit");
        }
        if (!debit.getTransaction().getState().equals(FinanceConstant.TRANSACTION_STATE_PAID)) {
            return makeErrorResponse(ErrorCode.DEBIT_ERROR_NOT_ALLOW_UPDATE, "Not allowed to update debit");
        }
        if (debit.getState().equals(FinanceConstant.TRANSACTION_STATE_PAID)) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_ALLOW_UPDATE, "Debit is already paid");
        }
        if (updateDebitForm.getTransactionGroupId() != null) {
            TransactionGroup transactionGroup = transactionGroupRepository.findById(updateDebitForm.getTransactionGroupId()).orElse(null);
            if (transactionGroup == null){
                return makeErrorResponse(ErrorCode.TRANSACTION_GROUP_ERROR_NOT_FOUND, "Not found transaction group");
            }
            debit.setTransactionGroup(transactionGroup);
        } else {
            debit.setTransactionGroup(null);
        }
        if (updateDebitForm.getCategoryId() != null) {
            Category category = categoryRepository.findById(updateDebitForm.getCategoryId()).orElse(null);
            if (category == null) {
                return makeErrorResponse(ErrorCode.CATEGORY_ERROR_NOT_FOUND, "Not found category");
            }
            if (!updateDebitForm.getKind().equals(category.getKind())) {
                return makeErrorResponse(ErrorCode.DEBIT_ERROR_KIND_INVALID, "Debit kind not match category");
            }
            debit.setCategory(category);
        } else {
            debit.setCategory(null);
        }
        if (updateDebitForm.getTagId() != null) {
            Tag tag = tagRepository.findById(updateDebitForm.getTagId()).orElse(null);
            if (tag == null) {
                return makeErrorResponse(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            if (!FinanceConstant.TAG_KIND_TRANSACTION.equals(tag.getKind())) {
                return makeErrorResponse(ErrorCode.DEBIT_ERROR_TAG_INVALID, "Tag kind does not match");
            }
            debit.setTag(tag);
        } else {
            debit.setTag(null);
        }
        if (debit.getDocument() != null){
            if (!documentService.isNotValidUpdateDocumentString(updateDebitForm.getDocument(), debit.getDocument(), keyService.getFinanceSecretKey())) {
                return makeErrorResponse(ErrorCode.DEBIT_ERROR_DOCUMENT_INVALID, "Document name or url cannot be null");
            }
        }
        debitMapper.fromUpdateDebitFormToEncryptEntity(updateDebitForm, debit, keyService.getFinanceSecretKey());
        if (updateDebitForm.getAddedBy() != null) {
            Account addedBy = accountRepository.findById(updateDebitForm.getAddedBy()).orElse(null);
            if (addedBy == null) {
                return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found addedBy account");
            }
            boolean isAddedByChanged = !Objects.equals(debit.getAddedBy(), addedBy);
            if (!hasFullAuthority && isAddedByChanged) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_ALLOW_UPDATE, "Not allowed to update addedBy account");
            }
            debit.setAddedBy(addedBy);
        }
        debitRepository.save(debit);
        return makeSuccessResponse(null, "Update debit success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('DEB_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Debit debit = debitRepository.findById(id).orElse(null);
        if (debit == null) {
            return makeErrorResponse(ErrorCode.DEBIT_ERROR_NOT_FOUND, "Not found debit");
        }
        if (debit.getState().equals(FinanceConstant.TRANSACTION_STATE_PAID)) {
            return makeErrorResponse(ErrorCode.DEBIT_ERROR_NOT_ALLOW_DELETE, "Debit is already paid");
        }
        documentService.deleteDocument(debit.getDocument(), keyService.getFinanceSecretKey());
        debitRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete debit success");
    }

    @PutMapping(value = "/approve", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('DEB_A')")
    public ApiMessageDto<String> approve(@Valid @RequestBody ApproveDebitForm approveDebitForm, BindingResult bindingResult) {
        Debit debit = debitRepository.findById(approveDebitForm.getId()).orElse(null);
        if (debit == null) {
            return makeErrorResponse(ErrorCode.DEBIT_ERROR_NOT_FOUND, "Not found debit");
        }
        if (debit.getState().equals(FinanceConstant.TRANSACTION_STATE_PAID)) {
            return makeErrorResponse(ErrorCode.DEBIT_ERROR_NOT_ALLOW_UPDATE, "Debit is already paid");
        }
        debit.setState(FinanceConstant.TRANSACTION_STATE_PAID);
        debitRepository.save(debit);
        return makeSuccessResponse(null, "Approve debit success");
    }

    @PostMapping("/export-to-excel")
    @PreAuthorize("hasRole('DEB_E_E')")
    public ResponseEntity<Resource> exportToExcel(@Valid @RequestBody ExportExcelDebitForm exportExcelDebitForm, BindingResult bindingResult) throws IOException {
        DebitCriteria debitCriteria = new DebitCriteria();
        debitCriteria.setSortDate(FinanceConstant.SORT_TRANSACTION_DATE_ASC);
        debitCriteria.setDebitIds(exportExcelDebitForm.getDebitIds());
        Resource resource = resourceLoader.getResource("classpath:templates/export_list_transaction_template.xlsx");
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
        List<Debit> encryptedDebits = debitRepository.findAll(debitCriteria.getCriteria());
        List<Debit> debits = debitMapper.fromEncryptEntityListToDecryptEntityList(encryptedDebits, keyService.getFinanceSecretKey());
        int startRow = 3;
        int orderNumber = 1;
        for (Debit debit : debits) {
            Row currentRow = sheet.createRow(startRow++);
            fillDataIntoSheet(currentRow, orderNumber, debit);
            orderNumber++;
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + excelService.generateFileName("Debit"));
        ByteArrayOutputStream outPut = new ByteArrayOutputStream();
        workbook.write(outPut);
        ByteArrayResource byteArrayResource = new ByteArrayResource(outPut.toByteArray());
        return ResponseEntity.ok()
                .headers(headers)
                .body(byteArrayResource);
    }

    private void fillDataIntoSheet(Row row, int orderNumber, Debit debit) {
        try {
            CellStyle borderedCellStyle = excelService.createBorderCellStyle(row);
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            String formattedDebitDate = dateFormat.format(DateUtils.convertUTCToVN(debit.getTransactionDate()));
            excelService.createCell(row, 0, String.valueOf(orderNumber).trim(), borderedCellStyle);
            excelService.createCell(row, 1, formattedDebitDate, borderedCellStyle);
            excelService.createCell(row, 2, debit.getName(), borderedCellStyle);
            excelService.createCell(row, 3, excelService.mapTransactionKind(debit.getKind()), borderedCellStyle);
            excelService.createCell(row, 4, Double.valueOf(debit.getMoney()).intValue(), borderedCellStyle);
            excelService.createCell(row, 5, excelService.mapTransactionState(debit.getState()), borderedCellStyle);
            excelService.createCell(row, 6, debit.getNote(), borderedCellStyle);
        } catch (Exception e) {
            log.error("Error filling row {}: ", row.getRowNum(), e);
        }
    }
}