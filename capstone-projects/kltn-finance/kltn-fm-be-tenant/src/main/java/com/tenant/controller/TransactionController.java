package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.transaction.*;
import com.tenant.form.transaction.*;
import com.tenant.mapper.TransactionMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.service.DocumentService;
import com.tenant.service.KeyService;
import com.tenant.service.TransactionService;
import com.tenant.utils.AESUtils;
import com.tenant.utils.ConvertUtils;
import com.tenant.utils.DateUtils;
import com.tenant.service.ExcelService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.openxml4j.util.ZipSecureFile;
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
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/v1/transaction")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class TransactionController extends ABasicController {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private TransactionGroupRepository transactionGroupRepository;
    @Autowired
    private TransactionMapper transactionMapper;
    @Autowired
    private ResourceLoader resourceLoader;
    @Autowired
    private DocumentService documentService;
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private ExcelService excelService;
    @Autowired
    private KeyService keyService;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private TagRepository tagRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TR_V')")
    public ApiMessageDto<TransactionAdminDto> get(@PathVariable("id") Long id) {
        Transaction transaction = transactionRepository.findById(id).orElse(null);
        if (transaction == null) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_FOUND, "Not found transaction");
        }
        TransactionAdminDto transactionAdminDto = transactionMapper.fromEncryptEntityToEncryptTransactionAdminDto(transaction, keyService.getFinanceKeyWrapper());
        return makeSuccessResponse(transactionAdminDto, "Get transaction success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TR_L')")
    public ApiMessageDto<ResponseListDto<List<TransactionAdminDto>>> list(TransactionCriteria transactionCriteria, Pageable pageable) {
        if (transactionCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)){
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        if (!isCustomer()) {
            transactionCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<Transaction> transactions = transactionRepository.findAll(transactionCriteria.getCriteria(), pageable);
        ResponseListDto<List<TransactionAdminDto>> responseListObj = new ResponseListDto<>();
        List<TransactionAdminDto> transactionAdminDtos = transactionMapper.fromEncryptEntityListToEncryptTransactionAdminDtoList(transactions.getContent(), keyService.getFinanceKeyWrapper());
        responseListObj.setContent(transactionAdminDtos);
        responseListObj.setTotalPages(transactions.getTotalPages());
        responseListObj.setTotalElements(transactions.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list transaction success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<TransactionDto>>> autoComplete(TransactionCriteria transactionCriteria) {
        Pageable pageable = transactionCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        transactionCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        if (!isCustomer()) {
            transactionCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<Transaction> transactions = transactionRepository.findAll(transactionCriteria.getCriteria(), pageable);
        ResponseListDto<List<TransactionDto>> responseListObj = new ResponseListDto<>();
        List<TransactionDto> transactionDtos = transactionMapper.fromEncryptEntityListToEncryptTransactionDtoAutoCompleteList(transactions.getContent(), keyService.getFinanceKeyWrapper());
        responseListObj.setContent(transactionDtos);
        responseListObj.setTotalPages(transactions.getTotalPages());
        responseListObj.setTotalElements(transactions.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list transaction success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('TR_C', 'TR_C_FA')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateTransactionForm createTransactionForm, BindingResult bindingResult) {
        boolean hasFullAuthority = hasRole("TR_C_FA");
        Transaction transaction = transactionMapper.fromCreateTransactionFormToEncryptEntity(createTransactionForm, keyService.getFinanceSecretKey());
        if (createTransactionForm.getTransactionGroupId() != null) {
            TransactionGroup transactionGroup = transactionGroupRepository.findById(createTransactionForm.getTransactionGroupId()).orElse(null);
            if (transactionGroup == null){
                return makeErrorResponse(ErrorCode.TRANSACTION_GROUP_ERROR_NOT_FOUND, "Not found transaction group");
            }
            transaction.setTransactionGroup(transactionGroup);
        }
        if (createTransactionForm.getCategoryId() != null) {
            Category category = categoryRepository.findById(createTransactionForm.getCategoryId()).orElse(null);
            if (category == null) {
                return makeErrorResponse(ErrorCode.CATEGORY_ERROR_NOT_FOUND, "Not found category");
            }
            if (!createTransactionForm.getKind().equals(category.getKind())) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_KIND_INVALID, "Transaction kind not match category");
            }
            transaction.setCategory(category);
        }
        if (createTransactionForm.getTagId() != null) {
            Tag tag = tagRepository.findById(createTransactionForm.getTagId()).orElse(null);
            if (tag == null) {
                return makeErrorResponse(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            if (!FinanceConstant.TAG_KIND_TRANSACTION.equals(tag.getKind())) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_TAG_INVALID, "Tag kind does not match");
            }
            transaction.setTag(tag);
        }
        if (createTransactionForm.getDocument() != null){
            if (documentService.isNotValidCreateDocumentString(createTransactionForm.getDocument())) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_DOCUMENT_INVALID, "Document name or url cannot be null");
            }
        }
        if (createTransactionForm.getAddedBy() != null) {
            Account addedBy = accountRepository.findById(createTransactionForm.getAddedBy()).orElse(null);
            if (addedBy == null) {
                return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found addedBy account");
            }
            if (!hasFullAuthority) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_ALLOW_CREATE, "Not allowed to add addedBy account");
            }
            transaction.setAddedBy(addedBy);
        } else {
            Account currentUser = accountRepository.findById(getCurrentUser()).orElse(null);
            transaction.setAddedBy(currentUser);
        }
        if (createTransactionForm.getApprovedBy() != null) {
            Account approvedBy = accountRepository.findById(createTransactionForm.getApprovedBy()).orElse(null);
            if (approvedBy == null) {
                return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found approvedBy account");
            }
            if (!hasFullAuthority) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_ALLOW_CREATE, "Not allowed to add approvedBy account");
            }
            transaction.setApprovedBy(approvedBy);
            transaction.setApprovedDate(new Date());
            transaction.setState(FinanceConstant.TRANSACTION_STATE_APPROVE);
        } else {
            transaction.setState(FinanceConstant.TRANSACTION_STATE_CREATED);
        }
        if (createTransactionForm.getIgnoreDebit() == null || transaction.getKind().equals(FinanceConstant.TRANSACTION_KIND_INCOME)) {
            transaction.setIgnoreDebit(FinanceConstant.IGNORE_ENTITY_RELATIONSHIP_TRUE);
        }
        transactionRepository.save(transaction);
        transactionService.createDebitByTransaction(transaction);
        transactionService.createTransactionHistory(getCurrentUser(), transaction, transaction.getNote());
        return makeSuccessResponse(null, "Create transaction success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('TR_U', 'TR_U_FA')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateTransactionForm updateTransactionForm, BindingResult bindingResult) {
        boolean hasFullAuthority = hasRole("TR_U_FA");
        Transaction transaction = transactionRepository.findById(updateTransactionForm.getId()).orElse(null);
        if (transaction == null) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_FOUND, "Not found transaction");
        }
        if (transaction.getState().equals(FinanceConstant.TRANSACTION_STATE_PAID)) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_ALLOW_UPDATE, "Not allowed to update transaction");
        }
        if (updateTransactionForm.getTransactionGroupId() != null) {
            TransactionGroup transactionGroup = transactionGroupRepository.findById(updateTransactionForm.getTransactionGroupId()).orElse(null);
            if (transactionGroup == null){
                return makeErrorResponse(ErrorCode.TRANSACTION_GROUP_ERROR_NOT_FOUND, "Not found transaction group");
            }
            transaction.setTransactionGroup(transactionGroup);
        } else {
            transaction.setTransactionGroup(null);
        }
        if (updateTransactionForm.getCategoryId() != null) {
            Category category = categoryRepository.findById(updateTransactionForm.getCategoryId()).orElse(null);
            if (category == null) {
                return makeErrorResponse(ErrorCode.CATEGORY_ERROR_NOT_FOUND, "Not found category");
            }
            if (!updateTransactionForm.getKind().equals(category.getKind())) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_KIND_INVALID, "Transaction kind not match category");
            }
            transaction.setCategory(category);
        } else {
            transaction.setCategory(null);
        }
        if (updateTransactionForm.getTagId() != null) {
            Tag tag = tagRepository.findById(updateTransactionForm.getTagId()).orElse(null);
            if (tag == null) {
                return makeErrorResponse(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            if (!FinanceConstant.TAG_KIND_TRANSACTION.equals(tag.getKind())) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_TAG_INVALID, "Tag kind does not match");
            }
            transaction.setTag(tag);
        } else {
            transaction.setTag(null);
        }
        if (transaction.getDocument() != null){
            if (documentService.isNotValidUpdateDocumentString(updateTransactionForm.getDocument(), transaction.getDocument(), keyService.getFinanceSecretKey())) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_DOCUMENT_INVALID, "Document name or url cannot be null");
            }
        }
        transactionMapper.fromUpdateTransactionFormToEncryptEntity(updateTransactionForm, transaction, keyService.getFinanceSecretKey());
        if (updateTransactionForm.getAddedBy() != null) {
            Account addedBy = accountRepository.findById(updateTransactionForm.getAddedBy()).orElse(null);
            if (addedBy == null) {
                return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found addedBy account");
            }
            boolean isAddedByChanged = !Objects.equals(transaction.getAddedBy(), addedBy);
            if (!hasFullAuthority && isAddedByChanged) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_ALLOW_UPDATE, "Not allowed to update addedBy account");
            }
            transaction.setAddedBy(addedBy);
        }
        Account approvedBy = updateTransactionForm.getApprovedBy() != null
                ? accountRepository.findById(updateTransactionForm.getApprovedBy()).orElse(null)
                : accountRepository.findById(getCurrentUser()).orElse(null);
        if (approvedBy == null && updateTransactionForm.getApprovedBy() != null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found approvedBy account");
        }
        boolean isApprovedByChanged = !Objects.equals(transaction.getApprovedBy(), approvedBy);
        boolean isStateChanged = !updateTransactionForm.getState().equals(transaction.getState());
        if (!hasFullAuthority && (isApprovedByChanged || isStateChanged)) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_ALLOW_UPDATE, "Not allowed to update approvedBy account or transaction state");
        }
        if (isApprovedByChanged) {
            transaction.setApprovedBy(approvedBy);
            transaction.setApprovedDate(new Date());
            transaction.setState(FinanceConstant.TRANSACTION_STATE_APPROVE);
        }
        if (updateTransactionForm.getState().equals(FinanceConstant.TRANSACTION_STATE_CREATED)) {
            transaction.setApprovedBy(null);
            transaction.setApprovedDate(null);
            transaction.setState(FinanceConstant.TRANSACTION_STATE_CREATED);
        }
        if (updateTransactionForm.getIgnoreDebit() == null || transaction.getKind().equals(FinanceConstant.TRANSACTION_KIND_INCOME)) {
            transaction.setIgnoreDebit(FinanceConstant.IGNORE_ENTITY_RELATIONSHIP_TRUE);
        }
        transactionRepository.save(transaction);
        transactionService.updateDebitByTransaction(transaction);
        return makeSuccessResponse(null, "Update transaction success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TR_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Transaction transaction = transactionRepository.findById(id).orElse(null);
        if (transaction == null) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_FOUND, "Not found transaction");
        }
        if (transaction.getState().equals(FinanceConstant.TRANSACTION_STATE_PAID)) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_ALLOW_DELETE, "Not allowed to delete transaction");
        }
        documentService.deleteDocument(transaction.getDocument(), keyService.getFinanceSecretKey());
        Long paymentPeriodId = transaction.getPaymentPeriod() != null ? transaction.getPaymentPeriod().getId() : 1L;
        transactionRepository.deleteById(id);
        transactionService.recalculatePaymentPeriod(paymentPeriodId);
        return makeSuccessResponse(null, "Delete transaction success");
    }

    @PutMapping(value = "/approve", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TR_A')")
    public ApiMessageDto<String> approve(@Valid @RequestBody ApproveTransactionForm approveTransactionForm, BindingResult bindingResult) {
        Transaction transaction = transactionRepository.findById(approveTransactionForm.getId()).orElse(null);
        if (transaction == null) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_FOUND, "Not found transaction");
        }
        if (transaction.getState().equals(FinanceConstant.TRANSACTION_STATE_APPROVE)) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_ALLOW_UPDATE, "Transaction has already been approved");
        }
        if (transaction.getState().equals(FinanceConstant.TRANSACTION_STATE_PAID)) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_ALLOW_UPDATE, "Not allowed to approve transaction");
        }
        String note = AESUtils.encrypt(keyService.getFinanceSecretKey(), approveTransactionForm.getNote(), FinanceConstant.AES_ZIP_ENABLE);
        transaction.setState(FinanceConstant.TRANSACTION_STATE_APPROVE);
        Account approvedBy = accountRepository.findById(getCurrentUser()).orElse(null);
        transaction.setApprovedBy(approvedBy);
        transaction.setApprovedDate(new Date());
        transactionRepository.save(transaction);
        transactionService.createDebitByTransaction(transaction);
        transactionService.createTransactionHistory(getCurrentUser(), transaction, note);
        return makeSuccessResponse(null, "Approve transaction success");
    }

    @PutMapping(value = "/reject", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TR_R')")
    public ApiMessageDto<String> reject(@Valid @RequestBody RemoveTransactionFromPeriodForm rejectTransactionForm, BindingResult bindingResult) {
        Long id = rejectTransactionForm.getId();
        Transaction transaction = transactionRepository.findById(id).orElse(null);
        if (transaction == null) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_FOUND, "Not found transaction");
        }
        if (transaction.getState().equals(FinanceConstant.TRANSACTION_STATE_PAID)) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_ALLOW_DELETE, "Not allowed to reject transaction");
        }
        documentService.deleteDocument(transaction.getDocument(), keyService.getFinanceSecretKey());
        Long paymentPeriodId = transaction.getPaymentPeriod() != null ? transaction.getPaymentPeriod().getId() : 0L;
        transactionRepository.deleteById(id);
        transactionService.recalculatePaymentPeriod(paymentPeriodId);
        return makeSuccessResponse(null, "Reject transaction success");
    }

    @PutMapping(value = "/remove-from-period", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TR_R_F_P')")
    public ApiMessageDto<String> removeFromPeriod(@Valid @RequestBody RemoveTransactionFromPeriodForm removeTransactionFromPeriodForm, BindingResult bindingResult) {
        Long id = removeTransactionFromPeriodForm.getId();
        Transaction transaction = transactionRepository.findById(id).orElse(null);
        if (transaction == null) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_FOUND, "Not found transaction");
        }
        if (transaction.getState().equals(FinanceConstant.TRANSACTION_STATE_PAID)) {
            return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_ALLOW_UPDATE, "Transaction has already been paid");
        }
        Long paymentPeriodId = transaction.getPaymentPeriod() != null ? transaction.getPaymentPeriod().getId() : 0L;
        transaction.setPaymentPeriod(null);
        transactionRepository.save(transaction);
        transactionService.recalculatePaymentPeriod(paymentPeriodId);
        return makeSuccessResponse(null, "Remove transaction from payment period success");
    }

    @PostMapping("/export-to-excel")
    @PreAuthorize("hasRole('TR_E_E')")
    public ResponseEntity<Resource> exportToExcel(@Valid @RequestBody ExportExcelTransactionForm exportExcelTransactionForm, BindingResult bindingResult) throws IOException {
        TransactionCriteria transactionCriteria = new TransactionCriteria();
        transactionCriteria.setSortDate(FinanceConstant.SORT_TRANSACTION_DATE_ASC);
        transactionCriteria.setTransactionIds(exportExcelTransactionForm.getTransactionIds());
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

        List<Transaction> encryptedTransactions = transactionRepository.findAll(transactionCriteria.getCriteria());
        List<Transaction> transactions = transactionMapper.fromEncryptEntityListToDecryptEntityList(encryptedTransactions, keyService.getFinanceSecretKey());
        // Fill data into sheet
        int startRow = 3;
        int orderNumber = 1;
        for (Transaction transaction : transactions) {
            Row currentRow = sheet.createRow(startRow++);
            fillDataIntoSheet(currentRow, orderNumber, transaction);
            orderNumber++;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + excelService.generateFileName("Transaction"));
        ByteArrayOutputStream outPut = new ByteArrayOutputStream();
        workbook.write(outPut);
        workbook.close();
        String base64String = Base64.getEncoder().encodeToString(outPut.toByteArray());
        log.error("BASE64 {}", base64String);
        ByteArrayResource byteArrayResource = new ByteArrayResource(outPut.toByteArray());
        return ResponseEntity.ok()
                .headers(headers)
                .body(byteArrayResource);
    }

    private void fillDataIntoSheet(Row row, int orderNumber, Transaction transaction) {
        try {
            CellStyle borderedCellStyle = excelService.createBorderCellStyle(row);
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            String formattedTransactionDate = dateFormat.format(DateUtils.convertUTCToVN(transaction.getTransactionDate()));
            excelService.createCell(row, 0, String.valueOf(orderNumber).trim(), borderedCellStyle);
            excelService.createCell(row, 1, formattedTransactionDate, borderedCellStyle);
            excelService.createCell(row, 2, transaction.getName(), borderedCellStyle);
            excelService.createCell(row, 3, excelService.mapTransactionKind(transaction.getKind()), borderedCellStyle);
            excelService.createCell(row, 4, Double.valueOf(transaction.getMoney()).intValue(), borderedCellStyle);
            excelService.createCell(row, 5, excelService.mapTransactionState(transaction.getState()), borderedCellStyle);
            excelService.createCell(row, 6, transaction.getNote(), borderedCellStyle);
        } catch (Exception e) {
            log.error("Error filling row {}: ", row.getRowNum(), e);
        }
    }

    @PostMapping("/import-excel")
    @PreAuthorize("hasRole('TR_I_E')")
    public ApiMessageDto<String> importExcel(@RequestParam("file") MultipartFile file) throws IOException {
        ZipSecureFile.setMinInflateRatio(0.000100);
        if (file.isEmpty()) {
            throw new RuntimeException("File not found");
        }
        List<Transaction> transactions = parseExcelFile(file);
        transactions = transactionMapper.fromDecryptEntityListToEncryptEntityList(transactions, keyService.getFinanceSecretKey());
        for (Transaction transaction : transactions) {
            transactionRepository.save(transaction);
            transactionService.createTransactionHistory(getCurrentUser(), transaction, transaction.getNote());
        }
        return makeSuccessResponse(null, "Imported " + transactions.size() + " records success");
    }

    private List<Transaction> parseExcelFile(MultipartFile file) throws IOException {
        List<Transaction> transactions = new ArrayList<>();
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            excelService.skipRows(rows, 3);
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                Transaction transaction = parseRow(currentRow);
                if (transaction != null) {
                    transactions.add(transaction);
                }
            }
        }
        return transactions;
    }

    private Transaction parseRow(Row row) {
        try {
            Transaction transaction = new Transaction();
            Date transactionDate = excelService.getCellDateValue(row, 1);
            String transactionName = row.getCell(2).toString();
            Integer kind = excelService.mapTransactionKind(row.getCell(3).toString());
            String money = ConvertUtils.convertDoubleToString(Double.valueOf(row.getCell(4).toString()));
            Integer state = excelService.mapTransactionState(row.getCell(5).toString());
            String note = row.getCell(6).toString();
            if (StringUtils.isNoneBlank(transactionName) && kind != null && state != null && StringUtils.isNoneBlank(money)) {
                transaction.setTransactionDate(transactionDate);
                transaction.setName(transactionName);
                transaction.setKind(kind);
                transaction.setState(state);
                transaction.setMoney(money);
                transaction.setNote(note);
                return transaction;
            }
        } catch (Exception e) {
            log.error("Error parsing row {}: ", row.getRowNum(), e);
        }
        return null;
    }
}
