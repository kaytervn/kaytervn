package com.tenant.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.keyInformation.DecryptedValueDto;
import com.tenant.dto.keyInformation.KeyInformationAdminDto;
import com.tenant.dto.keyInformation.KeyInformationDto;
import com.tenant.form.keyInformation.CreateKeyInformationForm;
import com.tenant.form.keyInformation.EncryptedValueForm;
import com.tenant.form.keyInformation.ExportExcelKeyInformationForm;
import com.tenant.form.keyInformation.UpdateKeyInformationForm;
import com.tenant.mapper.KeyInformationMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.service.DocumentService;
import com.tenant.service.ExcelService;
import com.tenant.utils.AESUtils;
import com.tenant.service.KeyService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.openxml4j.util.ZipSecureFile;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/v1/key-information")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class KeyInformationController extends ABasicController {
    @Autowired
    private KeyInformationRepository keyInformationRepository;
    @Autowired
    private KeyInformationGroupRepository keyInformationGroupRepository;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private KeyInformationMapper keyInformationMapper;
    @Autowired
    private ResourceLoader resourceLoader;
    @Autowired
    private ExcelService excelService;
    @Autowired
    private KeyService keyService;
    @Qualifier("objectMapper")
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private DocumentService documentService;
    @Autowired
    private TagRepository tagRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_V')")
    public ApiMessageDto<KeyInformationAdminDto> get(@PathVariable("id") Long id) {
        KeyInformation keyInformation = keyInformationRepository.findById(id).orElse(null);
        if (keyInformation == null) {
            return makeErrorResponse(ErrorCode.KEY_INFORMATION_ERROR_NOT_FOUND, "Not found key information");
        }
        KeyInformationAdminDto keyInformationAdminDto = keyInformationMapper.fromEncryptEntityToEncryptKeyInformationAdminDto(keyInformation, keyService.getKeyInformationKeyWrapper(), keyService.getFinanceSubKeyWrapper());
        return makeSuccessResponse(keyInformationAdminDto, "Get key information success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_L')")
    public ApiMessageDto<ResponseListDto<List<KeyInformationAdminDto>>> list(KeyInformationCriteria keyInformationCriteria, Pageable pageable) {
        if (keyInformationCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        if (!isCustomer()) {
            keyInformationCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<KeyInformation> keyInformations = keyInformationRepository.findAll(keyInformationCriteria.getCriteria(), pageable);
        ResponseListDto<List<KeyInformationAdminDto>> responseListObj = new ResponseListDto<>();
        List<KeyInformationAdminDto> keyInformationAdminDtos = keyInformationMapper.fromEncryptEntityListToEncryptKeyInformationAdminDtoList(keyInformations.getContent(), keyService.getKeyInformationKeyWrapper(), keyService.getFinanceSubKeyWrapper());
        responseListObj.setContent(keyInformationAdminDtos);
        responseListObj.setTotalPages(keyInformations.getTotalPages());
        responseListObj.setTotalElements(keyInformations.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list key information success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<KeyInformationDto>>> autoComplete(KeyInformationCriteria keyInformationCriteria) {
        Pageable pageable = keyInformationCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        keyInformationCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        if (!isCustomer()) {
            keyInformationCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<KeyInformation> keyInformations = keyInformationRepository.findAll(keyInformationCriteria.getCriteria(), pageable);
        ResponseListDto<List<KeyInformationDto>> responseListObj = new ResponseListDto<>();
        List<KeyInformationDto> keyInformationDtos = keyInformationMapper.fromEncryptEntityListToKeyInformationDtoAutoCompleteList(keyInformations.getContent(), keyService.getKeyInformationKeyWrapper());
        responseListObj.setContent(keyInformationDtos);
        responseListObj.setTotalPages(keyInformations.getTotalPages());
        responseListObj.setTotalElements(keyInformations.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list key information success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateKeyInformationForm createKeyInformationForm, BindingResult bindingResult) {
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (!isCustomer() && account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        KeyInformation keyInformation = keyInformationMapper.fromCreateKeyInformationFormToEncryptEntity(createKeyInformationForm, keyService.getKeyInformationSecretKey());
        keyInformation.setAccount(account);
        if (createKeyInformationForm.getKeyInformationGroupId() != null) {
            KeyInformationGroup keyInformationGroup = keyInformationGroupRepository.findById(createKeyInformationForm.getKeyInformationGroupId()).orElse(null);
            if (keyInformationGroup == null) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_GROUP_ERROR_NOT_FOUND, "Not found key information group");
            }
            keyInformation.setKeyInformationGroup(keyInformationGroup);
        }
        if (createKeyInformationForm.getOrganizationId() != null) {
            Organization organization = organizationRepository.findById(createKeyInformationForm.getOrganizationId()).orElse(null);
            if (organization == null) {
                return makeErrorResponse(ErrorCode.ORGANIZATION_ERROR_NOT_FOUND, "Not found organization");
            }
            keyInformation.setOrganization(organization);
        }
        if (createKeyInformationForm.getTagId() != null) {
            Tag tag = tagRepository.findById(createKeyInformationForm.getTagId()).orElse(null);
            if (tag == null) {
                return makeErrorResponse(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            if (!FinanceConstant.TAG_KIND_KEY_INFORMATION.equals(tag.getKind())) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_ERROR_TAG_INVALID, "Tag kind does not match");
            }
            keyInformation.setTag(tag);
        }
        if (createKeyInformationForm.getDocument() != null){
            if (documentService.isNotValidCreateDocumentString(createKeyInformationForm.getDocument())) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_ERROR_DOCUMENT_INVALID, "Document name or url cannot be null");
            }
        }
        keyInformationRepository.save(keyInformation);
        return makeSuccessResponse(null, "Create key information success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateKeyInformationForm updateKeyInformationForm, BindingResult bindingResult) {
        KeyInformation keyInformation = keyInformationRepository.findById(updateKeyInformationForm.getId()).orElse(null);
        if (keyInformation == null) {
            return makeErrorResponse(ErrorCode.KEY_INFORMATION_ERROR_NOT_FOUND, "Not found key information");
        }
        if (keyInformation.getDocument() != null){
            if (documentService.isNotValidUpdateDocumentString(updateKeyInformationForm.getDocument(), keyInformation.getDocument(), keyService.getKeyInformationSecretKey())) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_ERROR_DOCUMENT_INVALID, "Document name or url cannot be null");
            }
        }
        keyInformationMapper.fromUpdateKeyInformationFormToEncryptEntity(updateKeyInformationForm, keyInformation, keyService.getKeyInformationSecretKey());
        if (updateKeyInformationForm.getKeyInformationGroupId() != null) {
            KeyInformationGroup keyInformationGroup = keyInformationGroupRepository.findById(updateKeyInformationForm.getKeyInformationGroupId()).orElse(null);
            if (keyInformationGroup == null) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_GROUP_ERROR_NOT_FOUND, "Not found key information group");
            }
            keyInformation.setKeyInformationGroup(keyInformationGroup);
        } else {
            keyInformation.setKeyInformationGroup(null);
        }
        if (updateKeyInformationForm.getOrganizationId() != null) {
            Organization organization = organizationRepository.findById(updateKeyInformationForm.getOrganizationId()).orElse(null);
            if (organization == null) {
                return makeErrorResponse(ErrorCode.ORGANIZATION_ERROR_NOT_FOUND, "Not found organization");
            }
            keyInformation.setOrganization(organization);
        } else {
            keyInformation.setOrganization(null);
        }
        if (updateKeyInformationForm.getTagId() != null) {
            Tag tag = tagRepository.findById(updateKeyInformationForm.getTagId()).orElse(null);
            if (tag == null) {
                return makeErrorResponse(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            if (!FinanceConstant.TAG_KIND_KEY_INFORMATION.equals(tag.getKind())) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_ERROR_TAG_INVALID, "Tag kind does not match");
            }
            keyInformation.setTag(tag);
        } else {
            keyInformation.setTag(null);
        }
        keyInformationRepository.save(keyInformation);
        return makeSuccessResponse(null, "Update key information success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        KeyInformation keyInformation = keyInformationRepository.findById(id).orElse(null);
        if (keyInformation == null) {
            return makeErrorResponse(ErrorCode.KEY_INFORMATION_ERROR_NOT_FOUND, "Not found key information");
        }
        documentService.deleteDocument(keyInformation.getDocument(), keyService.getKeyInformationSecretKey());
        keyInformationRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete key information success");
    }

    @PostMapping("/export-to-excel")
    @PreAuthorize("hasRole('KE_I_E_E')")
    public ResponseEntity<Resource> exportToExcel(@Valid @RequestBody ExportExcelKeyInformationForm exportExcelKeyInformationForm, BindingResult bindingResult) throws IOException {
        KeyInformationCriteria keyInformationCriteria = new KeyInformationCriteria();
        keyInformationCriteria.setKeyInformationIds(exportExcelKeyInformationForm.getKeyInformationIds());
        List<KeyInformation> keyInformations = keyInformationRepository.findAll(keyInformationCriteria.getCriteria());
        keyInformations = keyInformationMapper.fromEncryptEntityListToDecryptEntityList(keyInformations, keyService.getKeyInformationSecretKey());
        Resource resource = resourceLoader.getResource("classpath:templates/export_list_key_information_template.xlsx");
        try (InputStream inputStream = resource.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream);
             ByteArrayOutputStream outPut = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.getSheetAt(0);
            Integer kind = exportExcelKeyInformationForm.getKind();
            if (kind == null) {
                throw new RuntimeException("Please provide a valid kind");
            }
            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            style.setFont(font);
            Row dateRow = sheet.createRow(1);
            Cell dateCell = dateRow.createCell(0);
            dateCell.setCellStyle(style);
            dateCell.setCellValue("Ngày xuất: " + new SimpleDateFormat("dd/MM/yyyy").format(new Date()));

            Set<String> allKeys = new LinkedHashSet<>();
            Row headerRow = sheet.createRow(2);
            CellStyle borderCellStyle = excelService.createBorderCellStyle(headerRow);
            Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            borderCellStyle.setFont(boldFont);
            List<String> rowHeaders = new ArrayList<>(Arrays.asList("STT", "Tên tài khoản", "Loại", "Mô tả"));
            if (kind.equals(FinanceConstant.KEY_INFORMATION_KIND_SERVER)) {
                allKeys.addAll(Arrays.asList("host", "port", "privateKey", "username", "password"));
                rowHeaders.addAll(Arrays.asList("Host", "Port", "Private Key", "Username", "Password"));
            } else {
                allKeys.addAll(Arrays.asList("username", "password", "phoneNumber"));
                rowHeaders.addAll(Arrays.asList("Username", "Password", "Phone Number"));
            }
            for (int i = 0; i < rowHeaders.size(); i++) {
                excelService.createCell(headerRow, i, rowHeaders.get(i), borderCellStyle);
            }

            // Fill data into sheet
            for (int i = 0; i < keyInformations.size(); i++) {
                KeyInformation keyInformation = keyInformations.get(i);
                Row currentRow = sheet.createRow(i + 3);
                fillDataIntoSheet(currentRow, i + 1, keyInformation);
                Map<String, String> jsonMap = null;
                if (keyInformation.getAdditionalInformation() != null) {
                    jsonMap = objectMapper.readValue(keyInformation.getAdditionalInformation(), new TypeReference<>() {});
                }
                CellStyle borderedCellStyle = excelService.createBorderCellStyle(currentRow);
                int columnIndex = 4;
                for (String key : allKeys) {
                    String value = (jsonMap != null) ? jsonMap.get(key) : null;
                    if ("password".equals(key) || "privateKey".equals(key)) {
                        value = AESUtils.encrypt(keyService.getDecryptPasswordSecretKey(), value, FinanceConstant.AES_ZIP_ENABLE);
                    }
                    excelService.createCell(currentRow, columnIndex++, value, borderedCellStyle);
                }
            }
            workbook.write(outPut);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + excelService.generateFileName("KeyInformation"));
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(new ByteArrayResource(outPut.toByteArray()));
        }
    }

    private void fillDataIntoSheet(Row row, int orderNumber, KeyInformation keyInformation) {
        try {
            CellStyle borderedCellStyle = excelService.createBorderCellStyle(row);
            excelService.createCell(row, 0, String.valueOf(orderNumber).trim(), borderedCellStyle);
            excelService.createCell(row, 1, keyInformation.getName(), borderedCellStyle);
            excelService.createCell(row, 2, excelService.mapKeyInformationKind(keyInformation.getKind()), borderedCellStyle);
            excelService.createCell(row, 3, keyInformation.getDescription(), borderedCellStyle);
        } catch (Exception e) {
            log.error("Error filling row {}: ", row.getRowNum(), e);
        }
    }

    @PostMapping("/import-excel")
    @PreAuthorize("hasRole('KE_I_I_E')")
    public ApiMessageDto<String> importExcel(@RequestParam("file") MultipartFile file) throws IOException {
        ZipSecureFile.setMinInflateRatio(0.000100);
        if (file.isEmpty()) {
            throw new RuntimeException("File not found");
        }
        List<KeyInformation> keyInformations = new ArrayList<>();
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            excelService.skipRows(rows, 3);
            Row headerRow = sheet.getRow(2);
            Map<String, Integer> headerMap = new HashMap<>();
            for (Cell cell : headerRow) {
                headerMap.put(cell.getStringCellValue(), cell.getColumnIndex());
            }
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                String keyInformationName = currentRow.getCell(1).toString();
                Integer kind = excelService.mapKeyInformationKind(currentRow.getCell(2).toString());
                String description = currentRow.getCell(3).toString();
                Account account = accountRepository.findById(getCurrentUser()).orElse(null);
                if (StringUtils.isNoneBlank(keyInformationName) && kind != null) {
                    List<String> allKeys = new ArrayList<>();
                    if (kind.equals(FinanceConstant.KEY_INFORMATION_KIND_SERVER)) {
                        allKeys.addAll(Arrays.asList("host", "port", "privateKey", "username", "password"));
                    } else {
                        allKeys.addAll(Arrays.asList("username", "password", "phoneNumber"));
                    }
                    KeyInformation keyInformation = new KeyInformation();
                    keyInformation.setAccount(account);
                    keyInformation.setName(keyInformationName);
                    keyInformation.setKind(kind);
                    keyInformation.setDescription(description);
                    Map<String, String> additionalInfo = new HashMap<>();
                    headerMap.forEach((key, columnIndex) -> {
                        if (columnIndex < 4 || currentRow.getCell(columnIndex) == null) {
                            return;
                        }
                        String value = currentRow.getCell(columnIndex).toString();
                        try {
                            value = String.valueOf((int) Double.parseDouble(value));
                        } catch (NumberFormatException ignored) {}
                        if (StringUtils.isNotBlank(value)) {
                            String infoKey = allKeys.get(columnIndex - 4);
                            if (infoKey != null) {
                                if ("password".equals(infoKey) || "privateKey".equals(infoKey)) {
                                    value = AESUtils.decrypt(keyService.getDecryptPasswordSecretKey(), value, FinanceConstant.AES_ZIP_ENABLE);
                                }
                                additionalInfo.put(infoKey, value);
                            }
                        }
                    });
                    keyInformation.setAdditionalInformation(objectMapper.writeValueAsString(additionalInfo));
                    keyInformations.add(keyInformation);
                }
            }
        }
        keyInformationRepository.saveAll(keyInformationMapper.fromDecryptEntityListToEncryptEntityList(keyInformations, keyService.getKeyInformationSecretKey()));
        return makeSuccessResponse(null, "Imported " + keyInformations.size() + " records success");
    }

    @PostMapping(value = "/decrypt", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<DecryptedValueDto> verifyKey(@Valid @RequestBody EncryptedValueForm encryptedValueForm, BindingResult bindingResult){
        String decryptedValue = AESUtils.decrypt(keyService.getDecryptPasswordSecretKey(), encryptedValueForm.getValue(), FinanceConstant.AES_ZIP_ENABLE);
        if (decryptedValue == null) {
            return makeErrorResponse(null, "Decrypt failed");
        }
        DecryptedValueDto dto = new DecryptedValueDto();
        dto.setDecryptedValue(decryptedValue);
        return makeSuccessResponse(dto, "Decrypt success");
    }
}
