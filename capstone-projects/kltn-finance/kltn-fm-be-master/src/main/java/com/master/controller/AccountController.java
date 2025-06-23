package com.master.controller;

import com.master.constant.MasterConstant;
import com.master.dto.ApiResponse;
import com.master.dto.account.*;
import com.master.exception.BadRequestException;
import com.master.feign.service.FeignTenantService;
import com.master.form.account.*;
import com.master.mapper.AccountMapper;
import com.master.model.Account;
import com.master.model.Customer;
import com.master.model.Location;
import com.master.redis.RedisConstant;
import com.master.repository.*;
import com.master.service.*;
import com.master.service.impl.UserServiceImpl;
import com.master.service.mail.MailServiceImpl;
import com.master.utils.*;
import com.master.dto.ApiMessageDto;
import com.master.dto.ErrorCode;
import com.master.dto.ResponseListDto;
import com.master.model.Group;
import com.master.model.criteria.AccountCriteria;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/v1/account")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class AccountController extends ABasicController{
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private MasterApiService masterApiService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private MediaService mediaService;
    @Value("${mfa.enabled}")
    private Boolean isMfaEnable;
    @Value("${tenant.api-key}")
    private String tenantApiKey;
    @Autowired
    private TotpManager totpManager;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private FeignTenantService feignTenantService;
    @Autowired
    private SessionService sessionService;
    @Autowired
    private Oauth2JWTService oauth2JWTService;
    @Autowired
    private AccountBranchRepository accountBranchRepository;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private UserServiceImpl userService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_V')")
    public ApiMessageDto<AccountAdminDto> get(@PathVariable("id") Long id) {
        Account account = accountRepository.findFirstByIdAndKind(id, MasterConstant.USER_KIND_ADMIN).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        AccountAdminDto dto = accountMapper.fromEntityToAccountAdminDto(account);
        return makeSuccessResponse(dto, "Get account success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_L')")
    public ApiMessageDto<ResponseListDto<List<AccountAdminDto>>> list(AccountCriteria accountCriteria, Pageable pageable) {
        accountCriteria.setKind(MasterConstant.USER_KIND_ADMIN);
        if (accountCriteria.getIsPaged().equals(MasterConstant.BOOLEAN_FALSE)){
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
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
        Pageable pageable = accountCriteria.getIsPaged().equals(MasterConstant.BOOLEAN_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        accountCriteria.setKind(MasterConstant.USER_KIND_ADMIN);
        accountCriteria.setStatus(MasterConstant.STATUS_ACTIVE);
        Page<Account> accounts = accountRepository.findAll(accountCriteria.getCriteria(), pageable);
        ResponseListDto<List<AccountDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(accountMapper.fromEntityListToAccountDtoListAutoComplete(accounts.getContent()));
        responseListObj.setTotalPages(accounts.getTotalPages());
        responseListObj.setTotalElements(accounts.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list account success");
    }

    @PostMapping(value = "/create-admin", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_C_AD')")
    public ApiMessageDto<String> createAdmin(@Valid @RequestBody CreateAccountAdminForm createAccountAdminForm, BindingResult bindingResult) {
        Account accountByUsername = accountRepository.findFirstByUsername(createAccountAdminForm.getUsername()).orElse(null);
        if (accountByUsername != null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_USERNAME_EXISTED, "Username existed");
        }
        Account accountByEmail = accountRepository.findFirstByEmail(createAccountAdminForm.getEmail()).orElse(null);
        if (accountByEmail != null){
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_EMAIL_EXISTED, "Email existed");
        }
        Account accountByPhone = accountRepository.findFirstByPhone(createAccountAdminForm.getPhone()).orElse(null);
        if (accountByPhone != null){
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_PHONE_EXISTED, "Phone existed");
        }
        Account account = accountMapper.fromCreateAccountAdminFormToEntity(createAccountAdminForm);
        account.setPassword(passwordEncoder.encode(createAccountAdminForm.getPassword()));
        account.setKind(MasterConstant.USER_KIND_ADMIN);
        Group group = groupRepository.findFirstByIdAndKind(createAccountAdminForm.getGroupId(), MasterConstant.USER_KIND_ADMIN).orElse(null);
        if (group == null) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NOT_FOUND, "Group not found");
        }
        account.setGroup(group);
        accountRepository.save(account);
        return makeSuccessResponse(null, "Create account admin success");
    }

    @PutMapping(value = "/update-admin", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_U_AD')")
    public ApiMessageDto<String> updateAdmin(@Valid @RequestBody UpdateAccountAdminForm updateAccountAdminForm, BindingResult bindingResult) {
        Account account = accountRepository.findFirstByIdAndKind(updateAccountAdminForm.getId(), MasterConstant.USER_KIND_ADMIN).orElse(null);
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
        if (StringUtils.isNoneBlank(updateAccountAdminForm.getAvatarPath())) {
            if (!updateAccountAdminForm.getAvatarPath().equals(account.getAvatarPath())) {
                mediaService.deleteFile(account.getAvatarPath());
            }
            account.setAvatarPath(updateAccountAdminForm.getAvatarPath());
        }
        boolean isLock = MasterConstant.STATUS_ACTIVE.equals(account.getStatus()) && !MasterConstant.STATUS_ACTIVE.equals(updateAccountAdminForm.getStatus());
        boolean isGroupChanged = !Objects.equals(updateAccountAdminForm.getGroupId(), account.getGroup().getId());
        accountMapper.fromUpdateAccountAdminFormToEntity(updateAccountAdminForm, account);
        Group group = groupRepository.findFirstByIdAndKind(updateAccountAdminForm.getGroupId(), MasterConstant.USER_KIND_ADMIN).orElse(null);
        if (group == null) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NOT_FOUND, "Group not found");
        }
        account.setGroup(group);
        if (StringUtils.isNotBlank(updateAccountAdminForm.getPassword())) {
            account.setPassword(passwordEncoder.encode(updateAccountAdminForm.getPassword()));
        }
        accountRepository.save(account);
        if (isLock || isGroupChanged) {
            sessionService.sendMessageLockAdmin(account.getUsername());
        }
        return makeSuccessResponse(null, "Update account admin success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Account account = accountRepository.findFirstByIdAndKind(id, MasterConstant.USER_KIND_ADMIN).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (!MasterConstant.USER_KIND_ADMIN.equals(account.getKind())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (account.getIsSuperAdmin()) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_DELETE_SUPPER_ADMIN, "Not allow to delete super admin");
        }
        if (Long.valueOf(getCurrentUser()).equals(account.getId())){
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_DELETE_YOURSELF, "Not allow to delete yourself");
        }
        accountBranchRepository.deleteAllByAccountId(id);
        mediaService.deleteFile(account.getAvatarPath());
        customerRepository.deleteAllByAccountId(id);
        accountRepository.deleteById(id);
        if (MasterConstant.STATUS_ACTIVE.equals(account.getStatus())) {
            sessionService.sendMessageLockAdmin(account.getUsername());
        }
        return makeSuccessResponse(null, "Delete account success");
    }

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<AccountDto> profile() {
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (!MasterConstant.STATUS_ACTIVE.equals(account.getStatus())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_ACTIVE, "Account not active");
        }
        if (MasterConstant.USER_KIND_CUSTOMER.equals(account.getKind())) {
            Customer customer = customerRepository.findById(getCurrentUser()).orElseThrow(
                    () -> new BadRequestException(ErrorCode.CUSTOMER_ERROR_NOT_FOUND, "[Customer] Customer not found")
            );
            if (!MasterConstant.STATUS_ACTIVE.equals(customer.getStatus())) {
                throw new BadRequestException(ErrorCode.CUSTOMER_ERROR_NOT_ACTIVE, "Customer not active");
            }
        }
        return makeSuccessResponse(accountMapper.fromEntityToAccountDtoProfile(account), "Get profile success");
    }

    @PutMapping(value = "/update-profile-admin", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> updateProfileAdmin(@Valid @RequestBody UpdateProfileAdminForm updateProfileAdminForm, BindingResult bindingResult) {
        Account account = accountRepository.findFirstByIdAndKind(getCurrentUser(), MasterConstant.USER_KIND_ADMIN).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (!passwordEncoder.matches(updateProfileAdminForm.getOldPassword(), account.getPassword())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_WRONG_PASSWORD, "Old password is incorrect");
        }
        if (StringUtils.isNoneBlank(updateProfileAdminForm.getAvatarPath())) {
            if (!updateProfileAdminForm.getAvatarPath().equals(account.getAvatarPath())) {
                mediaService.deleteFile(account.getAvatarPath());
            }
            account.setAvatarPath(updateProfileAdminForm.getAvatarPath());
        }
        accountMapper.fromUpdateProfileAdminFormToEntity(updateProfileAdminForm, account);
        accountRepository.save(account);
        return makeSuccessResponse(null, "Update profile success");
    }

    @PostMapping(value = "/request-forget-password", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<AccountForgetPasswordDto> requestForgetPassword(@Valid @RequestBody RequestForgetPasswordForm forgetForm, BindingResult bindingResult){
        Account account = accountRepository.findFirstByEmail(forgetForm.getEmail()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        String otp = masterApiService.getOTPForgetPassword();
        account.setAttemptCode(0);
        account.setResetPwdCode(otp);
        account.setResetPwdTime(new Date());
        accountRepository.save(account);
        mailService.sendVerificationMail(account.getEmail(), otp, account.getFullName());
        AccountForgetPasswordDto accountForgetPasswordDto = new AccountForgetPasswordDto();
        String zipUserId = ZipUtils.zipString(account.getId()+ ";" + otp);
        accountForgetPasswordDto.setUserId(zipUserId);
        return makeSuccessResponse(accountForgetPasswordDto, "Request forget password successful, please check email");
    }

    @PostMapping(value = "/reset-password", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> forgetPassword(@Valid @RequestBody ResetPasswordForm resetPasswordForm, BindingResult bindingResult){
        String[] unzip = ZipUtils.unzipString(resetPasswordForm.getUserId()).split(";", 2);
        Long id = ConvertUtils.convertStringToLong(unzip[0]);
        Account account = accountRepository.findById(id).orElse(null);
        if (account == null ) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if(account.getAttemptCode() >= MasterConstant.MAX_ATTEMPT_FORGET_PWD){
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_EXCEEDED_NUMBER_OF_INPUT_ATTEMPT_OTP, "Exceeded number of input attempt OTP");
        }
        if(!account.getResetPwdCode().equals(resetPasswordForm.getOtp()) ||
                (new Date().getTime() - account.getResetPwdTime().getTime() >= MasterConstant.MAX_TIME_FORGET_PWD)){
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

    @PutMapping(value = "/change-profile-password", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> changeProfilePassword(@Valid @RequestBody ChangeProfilePasswordAccountForm changeProfilePasswordAccountForm, BindingResult bindingResult) {
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if(!passwordEncoder.matches(changeProfilePasswordAccountForm.getOldPassword(), account.getPassword())){
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_WRONG_PASSWORD, "Old password is incorrect");
        }
        if (changeProfilePasswordAccountForm.getNewPassword().equals(changeProfilePasswordAccountForm.getOldPassword())) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NEW_PASSWORD_INVALID, "New password must be different from old password");
        }
        account.setPassword(passwordEncoder.encode(changeProfilePasswordAccountForm.getNewPassword()));
        accountRepository.save(account);
        return makeSuccessResponse(null, "Change profile password success");
    }

    @PutMapping(value = "/reset-mfa", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_R_MFA')")
    public ApiMessageDto<String> resetMfa(@Valid @RequestBody UpdateMfaForm updateMfaForm, BindingResult bindingResult) {
        if (!isSuperAdmin()) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_DISABLE_2FA, "[Account] Only super admin can disable MFA");
        }
        Account account = accountRepository.findById(updateMfaForm.getId()).orElseThrow(() -> new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "[Account] Account not found"));
        account.setSecretKey(null);
        account.setIsMfa(false);
        accountRepository.save(account);
        return makeSuccessResponse(null, "Reset MFA success");
    }

    @PostMapping(value = "/verify-credential", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<VerifyCredentialDto> verifyCredential(@Valid @RequestBody VerifyCredentialForm verifyCredentialForm, BindingResult bindingResult) {
        ApiResponse<VerifyCredentialDto> apiMessageDto = new ApiResponse<>();
        Account account = accountRepository.findFirstByUsername(verifyCredentialForm.getUsername()).orElse(null);
        if (account == null || !passwordEncoder.matches(verifyCredentialForm.getPassword(), account.getPassword())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_WRONG_CREDENTIAL, "[Account] Username or password is wrong!");
        }
        if (MasterConstant.USER_KIND_CUSTOMER.equals(account.getKind())) {
            Location location = locationRepository.findFirstByTenantId(verifyCredentialForm.getTenantId()).orElse(null);
            userService.checkValidLocation(location);
        }
        VerifyCredentialDto verifyCredentialDto = new VerifyCredentialDto();
        verifyCredentialDto.setIsMfaEnable(isMfaEnable);
        verifyCredentialDto.setIsMfa(account.getIsMfa());
        if (!account.getIsMfa() && isMfaEnable) {
            String secret = totpManager.generateSecret();
            String label = account.getUsername() != null ? account.getUsername() : account.getPhone();
            String qrCodeUrl = totpManager.getUriForImage(secret, label);
            verifyCredentialDto.setQrUrl(qrCodeUrl);
            account.setSecretKey(secret);
            accountRepository.save(account);
        }
        apiMessageDto.setData(verifyCredentialDto);
        return apiMessageDto;
    }

    @PostMapping(value = "/input-key", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_I_K')")
    public ApiMessageDto<String> inputMasterKey(@Valid @RequestBody InputKeyForm inputKeyForm, BindingResult bindingResult) {
        return feignTenantService.inputKey(tenantApiKey, inputKeyForm);
    }

    @PostMapping(value = "/clear-key", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_C_K')")
    public ApiMessageDto<String> clearMasterKey(@Valid @RequestBody ClearKeyForm form, BindingResult bindingResult) {
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (account == null || !MasterConstant.STATUS_ACTIVE.equals(account.getStatus())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (!MasterConstant.USER_KIND_ADMIN.equals(account.getKind())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_KIND_NOT_MATCH, "Current user is not admin");
        }
        if (!passwordEncoder.matches(form.getPassword(), account.getPassword())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_PASSWORD_INVALID, "Invalid password");
        }
        return feignTenantService.clearKey(tenantApiKey);
    }

    @PostMapping(value = "/login-employee", produces = MediaType.APPLICATION_JSON_VALUE)
    public OAuth2AccessToken loginEmployee(@Valid @RequestBody LoginEmployeeForm form, BindingResult bindingResult) {
        Location location = locationRepository.findFirstByTenantId(form.getTenantId()).orElse(null);
        userService.checkValidLocation(location);
        return oauth2JWTService.getAccessTokenForEmployee(form);
    }
}
