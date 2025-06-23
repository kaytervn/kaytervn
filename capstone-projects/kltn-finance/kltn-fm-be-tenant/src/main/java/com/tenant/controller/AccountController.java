package com.tenant.controller;

import com.tenant.cache.CacheClientService;
import com.tenant.cache.CacheConstant;
import com.tenant.cache.SessionService;
import com.tenant.constant.FinanceConstant;
import com.tenant.constant.SecurityConstant;
import com.tenant.dto.account.*;
import com.tenant.exception.BadRequestException;
import com.tenant.form.account.*;
import com.tenant.mapper.AccountMapper;
import com.tenant.multitenancy.feign.FeignDbConfigAuthService;
import com.tenant.multitenancy.tenant.TenantDBContext;
import com.tenant.rabbit.RabbitService;
import com.tenant.rabbit.form.ProcessTenantForm;
import com.tenant.service.QrCodeService;
import com.tenant.service.impl.UserServiceImpl;
import com.tenant.service.mail.MailServiceImpl;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.service.FinanceApiService;
import com.tenant.service.KeyService;
import com.tenant.utils.*;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/account")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class AccountController extends ABasicController {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private KeyInformationRepository keyInformationRepository;
    @Autowired
    private TransactionHistoryRepository transactionHistoryRepository;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private FinanceApiService financeApiService;
    @Autowired
    private KeyService keyService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Value("${aes.secret-key.key-information}")
    private String keyInformationSecretKey;
    @Value("${aes.secret-key.finance}")
    private String financeSecretKey;
    @Value("${aes.secret-key.decrypt-password}")
    private String encryptPasswordSecretKey;
    @Autowired
    private CacheClientService cacheClientService;
    @Autowired
    private SessionService sessionService;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private GroupPermissionRepository groupPermissionRepository;
    @Autowired
    private FeignDbConfigAuthService feignDbConfigAuthService;
    @Value("${master.api-key}")
    private String masterApiKey;
    @Autowired
    private QrCodeService qrCodeService;
    @Value("${qr.validity}")
    private Integer qrValidity;
    @Autowired
    private UserServiceImpl userService;
    @Value("${rabbitmq.queue.notification}")
    private String notificationQueue;
    @Autowired
    private RabbitService rabbitService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('EMP_V')")
    public ApiMessageDto<AccountAdminDto> get(@PathVariable("id") Long id) {
        Account account = accountRepository.findById(id).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        return makeSuccessResponse(accountMapper.fromEntityToAccountAdminDto(account), "Get account success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('EMP_L')")
    public ApiMessageDto<ResponseListDto<List<AccountAdminDto>>> list(AccountCriteria accountCriteria, Pageable pageable) {
        if (accountCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        if (FinanceConstant.BOOLEAN_TRUE.equals(accountCriteria.getIgnoreDirectMessageChatRoom())
                || FinanceConstant.BOOLEAN_TRUE.equals(accountCriteria.getIgnoreCurrentUser())) {
            accountCriteria.setIgnoreCurrentUserId(getCurrentUser());
        }
        Page<Account> accounts = accountRepository.findAll(accountCriteria.getCriteria(), pageable);
        ResponseListDto<List<AccountAdminDto>> responseListObj = new ResponseListDto<>();
        List<AccountAdminDto> dtos = accountMapper.fromEntityListToAccountAdminDtoList(accounts.getContent());
//        sessionService.mappingLastLoginForListAccounts(dtos);
        responseListObj.setContent(dtos);
        responseListObj.setTotalPages(accounts.getTotalPages());
        responseListObj.setTotalElements(accounts.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list account success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<AccountDto>>> autoComplete(AccountCriteria accountCriteria) {
        if (FinanceConstant.BOOLEAN_TRUE.equals(accountCriteria.getIgnoreDirectMessageChatRoom())
                || FinanceConstant.BOOLEAN_TRUE.equals(accountCriteria.getIgnoreCurrentUser())) {
            accountCriteria.setIgnoreCurrentUserId(getCurrentUser());
        }
        Pageable pageable = accountCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        accountCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        Page<Account> accounts = accountRepository.findAll(accountCriteria.getCriteria(), pageable);
        ResponseListDto<List<AccountDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(accountMapper.fromEntityListToAccountDtoListAutoComplete(accounts.getContent()));
        responseListObj.setTotalPages(accounts.getTotalPages());
        responseListObj.setTotalElements(accounts.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list account success");
    }

    @PostMapping(value = "/create-admin", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('EMP_C_AD')")
    public ApiMessageDto<String> createAdmin(@Valid @RequestBody CreateAccountAdminForm createAccountAdminForm, BindingResult bindingResult) {
        Account accountByUsername = accountRepository.findFirstByUsername(createAccountAdminForm.getUsername()).orElse(null);
        if (accountByUsername != null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_USERNAME_EXISTED, "Username existed");
        }
        Account accountByEmail = accountRepository.findFirstByEmail(createAccountAdminForm.getEmail()).orElse(null);
        if (accountByEmail != null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_EMAIL_EXISTED, "Email existed");
        }
        Account accountByPhone = accountRepository.findFirstByPhone(createAccountAdminForm.getPhone()).orElse(null);
        if (accountByPhone != null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_PHONE_EXISTED, "Phone existed");
        }
        if (createAccountAdminForm.getBirthDate() != null && createAccountAdminForm.getBirthDate().after(new Date())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_BIRTHDATE_INVALID, "Birthdate is invalid");
        }
        Group group = groupRepository.findById(createAccountAdminForm.getGroupId()).orElse(null);
        if (group == null) {
            return makeErrorResponse(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        Department department = departmentRepository.findById(createAccountAdminForm.getDepartmentId()).orElse(null);
        if (department == null) {
            return makeErrorResponse(ErrorCode.DEPARTMENT_ERROR_NOT_FOUND, "Not found department");
        }
        Account account = accountMapper.fromCreateAccountAdminFormToEntity(createAccountAdminForm);
        account.setPassword(passwordEncoder.encode(createAccountAdminForm.getPassword()));
        account.setGroup(group);
        account.setDepartment(department);
        accountRepository.save(account);
        return makeSuccessResponse(null, "Create account admin success");
    }

    @PutMapping(value = "/update-admin", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('EMP_U_AD')")
    public ApiMessageDto<String> updateAdmin(@Valid @RequestBody UpdateAccountAdminForm updateAccountAdminForm, BindingResult bindingResult) {
        Account account = accountRepository.findById(updateAccountAdminForm.getId()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (updateAccountAdminForm.getEmail() != null && !updateAccountAdminForm.getEmail().equals(account.getEmail())) {
            Account accountByEmail = accountRepository.findFirstByEmail(updateAccountAdminForm.getEmail()).orElse(null);
            if (accountByEmail != null) {
                return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_EMAIL_EXISTED, "Email existed");
            }
        }
        if (updateAccountAdminForm.getPhone() != null && !updateAccountAdminForm.getPhone().equals(account.getPhone())) {
            Account accountByPhone = accountRepository.findFirstByPhone(updateAccountAdminForm.getPhone()).orElse(null);
            if (accountByPhone != null) {
                return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_PHONE_EXISTED, "Phone existed");
            }
        }
        boolean isGroupChanged = !Objects.equals(updateAccountAdminForm.getGroupId(), account.getGroup().getId());
        Group group = groupRepository.findById(updateAccountAdminForm.getGroupId()).orElse(null);
        if (group == null) {
            return makeErrorResponse(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        Department department = departmentRepository.findById(updateAccountAdminForm.getDepartmentId()).orElse(null);
        if (department == null) {
            return makeErrorResponse(ErrorCode.DEPARTMENT_ERROR_NOT_FOUND, "Not found department");
        }
        if (StringUtils.isNoneBlank(updateAccountAdminForm.getAvatarPath())) {
            if (!updateAccountAdminForm.getAvatarPath().equals(account.getAvatarPath())) {
                financeApiService.deleteFile(account.getAvatarPath());
            }
            account.setAvatarPath(updateAccountAdminForm.getAvatarPath());
        }
        if (updateAccountAdminForm.getBirthDate() != null && updateAccountAdminForm.getBirthDate().after(new Date())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_BIRTHDATE_INVALID, "Birthdate is invalid");
        }
        boolean isLock = FinanceConstant.STATUS_ACTIVE.equals(account.getStatus()) && !FinanceConstant.STATUS_ACTIVE.equals(updateAccountAdminForm.getStatus());
        accountMapper.fromUpdateAccountAdminFormToEntity(updateAccountAdminForm, account);
        account.setGroup(group);
        account.setDepartment(department);
        accountRepository.save(account);
        if (isLock || isGroupChanged) {
            sessionService.sendMessageLockAccount(CacheConstant.KEY_EMPLOYEE, account.getUsername());
            sessionService.sendMessageLockAccount(CacheConstant.KEY_MOBILE, account.getUsername());
        }
        return makeSuccessResponse(null, "Update account admin success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('EMP_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Account account = accountRepository.findById(id).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (account.getIsSuperAdmin()) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_DELETE_SUPPER_ADMIN, "Not allow to delete super admin");
        }
        if (Long.valueOf(getCurrentUser()).equals(account.getId())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_DELETE_YOURSELF, "Not allow to delete yourself");
        }
        financeApiService.deleteFile(account.getAvatarPath());
        transactionHistoryRepository.deleteAllByAccountId(id);
        keyInformationRepository.updateAllByAccountId(id);
        accountRepository.deleteById(id);
        if (FinanceConstant.STATUS_ACTIVE.equals(account.getStatus())) {
            sessionService.sendMessageLockAccount(CacheConstant.KEY_EMPLOYEE, account.getUsername());
            sessionService.sendMessageLockAccount(CacheConstant.KEY_MOBILE, account.getUsername());
        }
        return makeSuccessResponse(null, "Delete account success");
    }

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<AccountDto> profile() {
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        return makeSuccessResponse(accountMapper.fromEntityToAccountDto(account), "Get profile success");
    }

    @PutMapping(value = "/update-profile-admin", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> updateProfileAdmin(@Valid @RequestBody UpdateProfileAdminForm updateProfileAdminForm, BindingResult bindingResult) {
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (!passwordEncoder.matches(updateProfileAdminForm.getOldPassword(), account.getPassword())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_WRONG_PASSWORD, "Old password is incorrect");
        }
        if (StringUtils.isNoneBlank(updateProfileAdminForm.getAvatarPath())) {
            if (!updateProfileAdminForm.getAvatarPath().equals(account.getAvatarPath())) {
                //delete old image
                financeApiService.deleteFile(account.getAvatarPath());
            }
            account.setAvatarPath(updateProfileAdminForm.getAvatarPath());
        }
        if (updateProfileAdminForm.getBirthDate() != null && updateProfileAdminForm.getBirthDate().after(new Date())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_BIRTHDATE_INVALID, "Birthdate is invalid");
        }
        accountMapper.fromUpdateProfileAdminFormToEntity(updateProfileAdminForm, account);
        accountRepository.save(account);
        return makeSuccessResponse(null, "Update profile success");
    }

    @PostMapping(value = "/request-forget-password", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<AccountForgetPasswordDto> requestForgetPassword(@Valid @RequestBody RequestForgetPasswordForm forgetForm, BindingResult bindingResult) {
        Account account = accountRepository.findFirstByEmail(forgetForm.getEmail()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        String otp = financeApiService.getOTPForgetPassword();
        account.setAttemptCode(0);
        account.setResetPwdCode(otp);
        account.setResetPwdTime(new Date());
        accountRepository.save(account);
        mailService.sendVerificationMail(account.getEmail(), otp, account.getFullName());
        AccountForgetPasswordDto accountForgetPasswordDto = new AccountForgetPasswordDto();
        String zipUserId = ZipUtils.zipString(account.getId() + ";" + otp);
        accountForgetPasswordDto.setUserId(zipUserId);
        return makeSuccessResponse(accountForgetPasswordDto, "Request forget password successful, please check email");
    }

    @PostMapping(value = "/reset-password", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> forgetPassword(@Valid @RequestBody ResetPasswordForm resetPasswordForm, BindingResult bindingResult) {
        String[] unzip = ZipUtils.unzipString(resetPasswordForm.getUserId()).split(";", 2);
        Long id = ConvertUtils.convertStringToLong(unzip[0]);
        Account account = accountRepository.findById(id).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (account.getAttemptCode() >= FinanceConstant.MAX_ATTEMPT_FORGET_PWD) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_EXCEEDED_NUMBER_OF_INPUT_ATTEMPT_OTP, "Exceeded number of input attempt OTP");
        }
        if (!account.getResetPwdCode().equals(resetPasswordForm.getOtp()) ||
                (new Date().getTime() - account.getResetPwdTime().getTime() >= FinanceConstant.MAX_TIME_FORGET_PWD)) {
            account.setAttemptCode(account.getAttemptCode() + 1);
            accountRepository.save(account);
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_OTP_INVALID, "OTP code invalid or has expired");
        }
        account.setResetPwdTime(null);
        account.setResetPwdCode(null);
        account.setAttemptCode(null);
        account.setPassword(passwordEncoder.encode(resetPasswordForm.getNewPassword()));
        accountRepository.save(account);
        return makeSuccessResponse(null, "Reset password success");
    }

    @GetMapping(value = "/my-key", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<MyKeyDto> myKey() {
        String encryptSecretKey = RSAUtils.encrypt(keyService.getUserPublicKey(), keyService.getUserSecretKey());
        MyKeyDto myKeyDto = new MyKeyDto();
        myKeyDto.setSecretKey(encryptSecretKey);
        return makeSuccessResponse(myKeyDto, "My key success");
    }

    @PostMapping("/request-key")
    public ResponseEntity<Resource> requestKey(@Valid @RequestBody RequestKeyForm requestKeyForm, BindingResult bindingResult) {
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (account == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (!passwordEncoder.matches(requestKeyForm.getPassword(), account.getPassword())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_REQUEST_KEY, "Wrong password");
        }
        if (account.getStatus() == FinanceConstant.STATUS_PENDING) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_REQUEST_KEY, "Account status is currently pending");
        }
        if (account.getStatus() == FinanceConstant.STATUS_LOCK) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_REQUEST_KEY, "Account has already been locked");
        }
        KeyPair keyPair = RSAUtils.generateKeyPair();
        String publicKey = RSAUtils.keyToString(keyPair.getPublic());
        String privateKey = RSAUtils.keyToString(keyPair.getPrivate());
        StringBuilder contentBuilder = new StringBuilder();
        contentBuilder.append("-----BEGIN PRIVATE KEY-----").append("\n");
        contentBuilder.append(privateKey).append("\n");
        contentBuilder.append("-----END PRIVATE KEY-----").append("\n");
        String key;
        String tenantName = TenantDBContext.getCurrentTenant();
        if (SecurityConstant.GRANT_TYPE_EMPLOYEE.equals(getCurrentGrantType())) {
            key = cacheClientService.getKeyString(CacheConstant.KEY_EMPLOYEE, account.getUsername(), tenantName);
        } else {
            key = cacheClientService.getKeyString(CacheConstant.KEY_MOBILE, account.getUsername(), tenantName);
        }
        cacheClientService.putPublicKey(key, publicKey);
        byte[] contentBytes = contentBuilder.toString().getBytes(StandardCharsets.UTF_8);
        ByteArrayResource byteArrayResource = new ByteArrayResource(contentBytes);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        String timeStamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("ddMMyyyyHHmmss"));
        String filename = "\"key_information_" + timeStamp + ".txt\"";
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);
        return ResponseEntity.ok()
                .headers(headers)
                .body(byteArrayResource);
    }

    @PutMapping(value = "/change-profile-password", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> changeProfilePassword(@Valid @RequestBody ChangeProfilePasswordAccountForm changeProfilePasswordAccountForm, BindingResult bindingResult) {
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (!passwordEncoder.matches(changeProfilePasswordAccountForm.getOldPassword(), account.getPassword())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_WRONG_PASSWORD, "Old password is incorrect");
        }
        if (changeProfilePasswordAccountForm.getNewPassword().equals(changeProfilePasswordAccountForm.getOldPassword())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NEW_PASSWORD_INVALID, "New password must be different from old password");
        }
        account.setPassword(passwordEncoder.encode(changeProfilePasswordAccountForm.getNewPassword()));
        accountRepository.save(account);
        return makeSuccessResponse(null, "Change profile password success");
    }

    @PostMapping(value = "/input-key", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> inputMasterKey(@Valid @RequestBody InputKeyForm inputKeyForm, BindingResult bindingResult) {
        String decryptFinanceSecretKey = RSAUtils.decrypt(inputKeyForm.getPrivateKey(), financeSecretKey);
        String decryptKeyInformationSecretKey = RSAUtils.decrypt(inputKeyForm.getPrivateKey(), keyInformationSecretKey);
        String decryptPasswordSecretKey = RSAUtils.decrypt(inputKeyForm.getPrivateKey(), encryptPasswordSecretKey);
        if (decryptFinanceSecretKey == null || decryptKeyInformationSecretKey == null || decryptPasswordSecretKey == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_PRIVATE_KEY_INVALID, "Private key invalid");
        }
        keyService.setMasterKey(inputKeyForm.getPrivateKey());
        return makeSuccessResponse(null, "Input key success");
    }

    @GetMapping(value = "/clear-key", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> clearMasterKey() {
        keyService.clearConcurrentMap();
        return makeSuccessResponse(null, "Clear key success");
    }

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public OAuth2AccessToken login(@Valid @RequestBody LoginEmployeeForm loginEmployeeForm, BindingResult bindingResult) {
        Account employee = accountRepository.findFirstByUsername(loginEmployeeForm.getUsername()).orElse(null);
        if (employee == null || !passwordEncoder.matches(loginEmployeeForm.getPassword(), employee.getPassword())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_LOGIN_FAILED, "Invalid username or password");
        }
        if (!FinanceConstant.STATUS_ACTIVE.equals(employee.getStatus())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_ACTIVE, "Employee is not active");
        }
        loginEmployeeForm.setTenantId(TenantDBContext.getCurrentTenant());
        loginEmployeeForm.setUserId(employee.getId());
        List<GroupPermission> permissions = groupPermissionRepository.findAllByGroupId(employee.getGroup().getId());
        List<Long> permissionIds = permissions.stream().map(GroupPermission::getPermissionId).collect(Collectors.toList());
        loginEmployeeForm.setPermissionIds(permissionIds);
        employee.setLastLogin(new Date());
        accountRepository.save(employee);
        return feignDbConfigAuthService.loginEmployee(masterApiKey, loginEmployeeForm);
    }

    @PostMapping(value = "/request-login-qr-code", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> requestLoginQrCode(@Valid @RequestBody RequestLoginQrCodeForm form, BindingResult bindingResult) {
        String value = qrCodeService.encryptAndZip(form.getClientId());
        return makeSuccessResponse(value, "Get request qr code success");
    }

    @PostMapping(value = "/verify-login-qr-code", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> verifyQrCode(@Valid @RequestBody VerifyQrCodeForm verifyQrCodeForm, BindingResult bindingResult) {
        Map<String, Object> attributes = userService.getAttributesFromToken();
        String grantType = String.valueOf(attributes.get("grant_type"));
        String tenantName = String.valueOf(attributes.get("tenant_name"));
        long userId;
        try {
            userId = Long.parseLong(String.valueOf(attributes.get("user_id")));
        } catch (Exception e) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        Account employee = accountRepository.findById(userId).orElse(null);
        if (employee == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (!FinanceConstant.STATUS_ACTIVE.equals(employee.getStatus())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_ACTIVE, "Account status is not active");
        }
        if (!SecurityConstant.GRANT_TYPE_MOBILE.equals(grantType)) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_INVALID_GRANT_TYPE, "Not allow to verify qr code");
        }
        QrCodeDto qrCodeDto = qrCodeService.decryptAndUnzip(verifyQrCodeForm.getQrCode());
        Date expiredDate = new Date(qrCodeDto.getCurrentTime().getTime() + qrValidity * 1000); // 60s
        if (expiredDate.before(new Date())) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_QR_CODE_EXPIRED, "QR code is expired!");
        }
        LoginEmployeeForm loginEmployeeForm = new LoginEmployeeForm();
        loginEmployeeForm.setUsername(employee.getUsername());
        loginEmployeeForm.setTenantId(tenantName);
        loginEmployeeForm.setUserId(employee.getId());
        loginEmployeeForm.setGrantType(SecurityConstant.GRANT_TYPE_EMPLOYEE);
        List<GroupPermission> permissions = groupPermissionRepository.findAllByGroupId(employee.getGroup().getId());
        List<Long> permissionIds = permissions.stream().map(GroupPermission::getPermissionId).collect(Collectors.toList());
        loginEmployeeForm.setPermissionIds(permissionIds);
        employee.setLastLogin(new Date());
        accountRepository.save(employee);
        String accessToken = feignDbConfigAuthService.loginEmployee(masterApiKey, loginEmployeeForm).getValue();
        SendAccessTokenForm dataForm = new SendAccessTokenForm();
        dataForm.setAccessToken(accessToken);
        dataForm.setClientId(qrCodeDto.getClientId());
        ProcessTenantForm<SendAccessTokenForm> form = new ProcessTenantForm<>();
        form.setAppName(FinanceConstant.BACKEND_APP);
        form.setQueueName(notificationQueue);
        form.setCmd(FinanceConstant.CMD_LOGIN_QR_CODE);
        form.setData(dataForm);
        rabbitService.handleSendMsg(form);
        return makeSuccessResponse(null, "Verify qr code success");
    }
}
