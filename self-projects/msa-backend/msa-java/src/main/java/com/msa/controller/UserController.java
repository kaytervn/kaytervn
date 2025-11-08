package com.msa.controller;

import com.msa.cache.CacheService;
import com.msa.cache.SessionService;
import com.msa.cloudinary.CloudinaryService;
import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.constant.SecurityConstant;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.user.*;
import com.msa.exception.BadRequestException;
import com.msa.form.user.*;
import com.msa.mapper.UserMapper;
import com.msa.multitenancy.tenant.TenantService;
import com.msa.service.BasicApiService;
import com.msa.service.TotpManager;
import com.msa.service.encryption.EncryptionService;
import com.msa.service.mail.MailServiceImpl;
import com.msa.storage.master.model.Group;
import com.msa.storage.master.model.User;
import com.msa.storage.master.model.criteria.UserCriteria;
import com.msa.storage.master.repository.DbConfigRepository;
import com.msa.storage.master.repository.FileRepository;
import com.msa.storage.master.repository.GroupRepository;
import com.msa.storage.master.repository.UserRepository;
import com.msa.utils.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/v1/user")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController extends ABasicController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TotpManager totpManager;
    @Autowired
    private FileRepository fileRepository;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private SessionService sessionService;
    @Autowired
    private EncryptionService encryptionService;
    @Autowired
    private BasicApiService basicApiService;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private DbConfigRepository dbConfigRepository;
    @Autowired
    private TenantService tenantService;
    @Autowired
    private CacheService cacheService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('US_V')")
    public ApiMessageDto<UserDto> get(@PathVariable("id") Long id) {
        User user = userRepository.findFirstByIdAndIsSuperAdminAndIdNot(id, Boolean.FALSE, getCurrentUser()).orElse(null);
        if (user == null) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_FOUND, "Not found user");
        }
        return makeSuccessResponse(userMapper.fromEntityToUserDto(user), "Get user success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('US_L')")
    public ApiMessageDto<ResponseListDto<List<UserDto>>> list(UserCriteria userCriteria, Pageable pageable) {
        Page<User> listUser = userRepository.findAll(userCriteria.getCriteria(), pageable);
        ResponseListDto<List<UserDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(userMapper.fromEntityListToUserDtoList(listUser.getContent()));
        responseListObj.setTotalPages(listUser.getTotalPages());
        responseListObj.setTotalElements(listUser.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list user success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<UserDto>>> autoComplete(UserCriteria userCriteria, @PageableDefault Pageable pageable) {
        userCriteria.setStatus(AppConstant.STATUS_ACTIVE);
        Page<User> listUser = userRepository.findAll(userCriteria.getCriteria(), pageable);
        ResponseListDto<List<UserDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(userMapper.fromEntityListToUserDtoListAutoComplete(listUser.getContent()));
        responseListObj.setTotalPages(listUser.getTotalPages());
        responseListObj.setTotalElements(listUser.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete user success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('US_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateUserForm form, BindingResult bindingResult) {
        if (userRepository.existsByUsername(form.getUsername())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_USERNAME_EXISTED, "Username existed");
        }
        if (userRepository.existsByEmail(form.getEmail())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_EMAIL_EXISTED, "Email existed");
        }
        Integer kind = SecurityConstant.USER_KIND_USER;
        User user = userMapper.fromCreateUserFormToEntity(form);
        user.setKind(kind);
        Group group = groupRepository.findFirstByIdAndKindAndIsSystem(form.getGroupId(), kind, Boolean.FALSE).orElse(null);
        if (group == null) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        user.setGroup(group);
        user.setPassword(passwordEncoder.encode(form.getPassword()));
        if (StringUtils.isNotBlank(user.getAvatarPath())) {
            fileRepository.deleteAllByUrl(user.getAvatarPath());
        }
        userRepository.save(user);
//        createDbConfig(user);
        return makeSuccessResponse(null, "Create user success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('US_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateUserForm form, BindingResult bindingResult) {
        User user = userRepository.findFirstByIdAndIsSuperAdminAndIdNot(form.getId(), Boolean.FALSE, getCurrentUser()).orElse(null);
        if (user == null) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_FOUND, "Not found user");
        }
        if (userRepository.existsByEmailAndIdNot(form.getEmail(), user.getId())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_EMAIL_EXISTED, "Email existed");
        }
        boolean isChangedToInactive = AppConstant.STATUS_ACTIVE.equals(user.getStatus()) && !AppConstant.STATUS_ACTIVE.equals(form.getStatus());
        boolean isLock = !Objects.equals(user.getStatus(), form.getStatus()) && AppConstant.STATUS_LOCK.equals(form.getStatus());
        boolean isGroupChanged = !Objects.equals(form.getGroupId(), user.getGroup().getId());
        userMapper.fromUpdateUserFormToEntity(form, user);
        Group group = groupRepository.findFirstByIdAndKindAndIsSystem(form.getGroupId(), user.getKind(), Boolean.FALSE).orElse(null);
        if (group == null) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        user.setGroup(group);
        userRepository.save(user);
        if (isChangedToInactive || isGroupChanged) {
            sessionService.sendMessageLockUser(user.getKind(), user.getUsername());
        }
        if (isLock) {
            mailService.sendMsgLockAccount(user.getEmail());
        }
        return makeSuccessResponse(null, "Update user success");
    }

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<UserDto> profile() {
        User user = userRepository.findById(getCurrentUser()).orElse(null);
        if (user == null) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_FOUND, "Not found user");
        }
        if (!AppConstant.STATUS_ACTIVE.equals(user.getStatus())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_ACTIVE, "Account not active");
        }
        return makeSuccessResponse(userMapper.fromEntityToUserDtoForProfile(user), "Get profile success");
    }

    @PutMapping(value = "/update-profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> updateProfile(@Valid @RequestBody UpdateProfileForm form, BindingResult bindingResult) {
        User user = userRepository.findById(getCurrentUser()).orElse(null);
        if (user == null) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_FOUND, "Not found user");
        }
        if (!AppConstant.STATUS_ACTIVE.equals(user.getStatus())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_ACTIVE, "Account not active");
        }
        if (!passwordEncoder.matches(form.getOldPassword(), user.getPassword())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_WRONG_PASSWORD, "Old password is incorrect");
        }
        boolean isAvatarChanged = !Objects.equals(form.getAvatarPath(), user.getAvatarPath());
        if (isAvatarChanged) {
            cloudinaryService.deleteFile(user.getAvatarPath());
            fileRepository.deleteAllByUrl(form.getAvatarPath());
        }
        userMapper.fromUpdateProfileFormToEntity(form, user);
        userRepository.save(user);
        return makeSuccessResponse(null, "Update profile success");
    }

    @PostMapping(value = "/verify-credential", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<VerifyCredentialDto> verifyCredential(@Valid @RequestBody VerifyCredentialForm verifyCredentialForm, BindingResult bindingResult) {
        User user = userRepository.findFirstByUsername(verifyCredentialForm.getUsername()).orElse(null);
        if (user == null || !passwordEncoder.matches(verifyCredentialForm.getPassword(), user.getPassword())) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_INVALID_USERNAME_OR_PASSWORD, "Username or password is invalid");
        }
        if (!AppConstant.STATUS_ACTIVE.equals(user.getStatus())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_ACTIVE, "User is  not active");
        }
        VerifyCredentialDto verifyCredentialDto = new VerifyCredentialDto();
        if (!user.getIsMfa()) {
            String secret = totpManager.generateSecret();
            String label = user.getUsername() != null ? user.getUsername() : user.getEmail();
            String qrCodeUrl = totpManager.getUriForImage(secret, label);
            verifyCredentialDto.setQrCodeUrl(qrCodeUrl);
            user.setSecretKey(encryptionService.serverEncrypt(secret));
            userRepository.save(user);
        }
        return makeSuccessResponse(verifyCredentialDto, "Verify credential success");
    }

    @PostMapping(value = "/request-forgot-password", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<UserForgetPasswordDto> requestForgetPassword(@Valid @RequestBody RequestForgetPasswordForm form, BindingResult bindingResult) {
        User user = userRepository.findFirstByEmail(form.getEmail()).orElse(null);
        if (user == null) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_FOUND, "Not found user");
        }
        String otp = basicApiService.getOTPForgetPassword();
        user.setResetPwdCode(otp);
        user.setResetPwdTime(new Date());
        userRepository.save(user);
        mailService.sendVerificationMail(user.getEmail(), otp, user.getFullName());
        UserForgetPasswordDto accountForgetPasswordDto = new UserForgetPasswordDto();
        String zipUserId = ZipUtils.zipString(user.getId() + ";" + otp);
        accountForgetPasswordDto.setUserId(zipUserId);
        return makeSuccessResponse(accountForgetPasswordDto, "Request forget password successful, please check email");
    }

    @PostMapping(value = "/reset-password", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> forgetPassword(@Valid @RequestBody ResetPasswordForm form, BindingResult bindingResult) {
        String[] unzip = Objects.requireNonNull(ZipUtils.unzipString(form.getUserId())).split(";", 2);
        Long id = ConvertUtils.convertStringToLong(unzip[0]);
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_FOUND, "Not found user");
        }
        if (!user.getResetPwdCode().equals(form.getOtp()) || (new Date().getTime() - user.getResetPwdTime().getTime() >= AppConstant.MAX_TIME_FORGET_PWD)) {
            throw new BadRequestException(ErrorCode.USER_ERROR_INVALID_OTP, "OTP code invalid or has expired");
        }
        user.setResetPwdTime(null);
        user.setResetPwdCode(null);
        user.setPassword(passwordEncoder.encode(form.getNewPassword()));
        userRepository.save(user);
        return makeSuccessResponse(null, "Reset password success");
    }

    @PutMapping(value = "/change-password", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> changeProfilePassword(@Valid @RequestBody ChangePasswordForm form, BindingResult bindingResult) {
        User user = userRepository.findById(getCurrentUser()).orElse(null);
        if (user == null) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_FOUND, "Not found user");
        }
        if (!passwordEncoder.matches(form.getOldPassword(), user.getPassword())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_WRONG_PASSWORD, "Old password is incorrect");
        }
        if (form.getNewPassword().equals(form.getOldPassword())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_WRONG_PASSWORD, "New password must be different from old password");
        }
        user.setPassword(passwordEncoder.encode(form.getNewPassword()));
        userRepository.save(user);
        return makeSuccessResponse(null, "Change password success");
    }

    @PutMapping(value = "/reset-mfa", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('US_R_M')")
    public ApiMessageDto<String> resetMfa(@Valid @RequestBody ResetMfaForm form, BindingResult bindingResult) {
        User user = userRepository.findById(form.getId()).orElseThrow(() -> new BadRequestException(ErrorCode.USER_ERROR_NOT_FOUND, "User not found"));
        user.setSecretKey(null);
        user.setIsMfa(false);
        userRepository.save(user);
        return makeSuccessResponse(null, "Reset MFA success");
    }

    @PostMapping("/request-key")
    public ResponseEntity<Resource> requestKey(@Valid @RequestBody RequestKeyForm form, BindingResult bindingResult) {
        User user = userRepository.findFirstByIdAndKind(getCurrentUser(), SecurityConstant.USER_KIND_USER).orElse(null);
        if (user == null) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_FOUND, "Not found user");
        }
        if (!passwordEncoder.matches(form.getPassword(), user.getPassword())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_WRONG_PASSWORD, "Invalid password");
        }
        if (!AppConstant.STATUS_ACTIVE.equals(user.getStatus())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_ACTIVE, "Account not active");
        }
        KeyPair keyPair = RSAUtils.generateKeyPair();
        String publicKey = RSAUtils.keyToString(keyPair.getPublic());
        String privateKey = RSAUtils.keyToString(keyPair.getPrivate());
        String contentBuilder = encryptionService.clientEncryptInjectNonce(privateKey);
        String key = sessionService.getKeyString(user.getKind(), user.getUsername());
        sessionService.putPublicKey(key, publicKey);
        byte[] contentBytes = contentBuilder.getBytes(StandardCharsets.UTF_8);
        ByteArrayResource byteArrayResource = new ByteArrayResource(contentBytes);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        String timeStamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("ddMMyyyyHHmmss"));
        String filename = "\"request_key_" + timeStamp + ".txt\"";
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);
        return ResponseEntity.ok().headers(headers).body(byteArrayResource);
    }

    @GetMapping(value = "/my-key", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<MyKeyDto> myKey() {
        User user = userRepository.findFirstByIdAndKind(getCurrentUser(), SecurityConstant.USER_KIND_USER).orElse(null);
        if (user == null) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_FOUND, "Not found user");
        }
        if (!AppConstant.STATUS_ACTIVE.equals(user.getStatus())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_ACTIVE, "Account not active");
        }
        String encryptSecretKey = RSAUtils.encrypt(encryptionService.getUserPublicKey(), encryptionService.getUserSecretKey());
        MyKeyDto myKeyDto = new MyKeyDto();
        myKeyDto.setSecretKey(encryptSecretKey);
        return makeSuccessResponse(myKeyDto, "Get my key success");
    }

    @PostMapping(value = "/activate-account", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> activateAccount(@Valid @RequestBody ActivateUserForm form, BindingResult bindingResult) {
        String username;
        Date date;
        try {
            String token = encryptionService.serverDecrypt(form.getToken());
            List<String> parts = List.of(Objects.requireNonNull(ZipUtils.unzipString(token)).split(";"));
            username = parts.get(0);
            date = DateUtils.converDate(parts.get(2));
        } catch (Exception e) {
            throw new BadRequestException("Invalid token");
        }
        if (DateUtils.verifyTimestamp(date, Long.valueOf(AppConstant.MAX_TIME_ACTIVE_ACCOUNT))) {
            throw new BadRequestException("Request expired");
        }
        User user = userRepository.findFirstByUsername(username).orElse(null);
        if (user == null) {
            throw new BadRequestException(ErrorCode.USER_ERROR_NOT_FOUND, "Not found user");
        }
        if (!passwordEncoder.matches(form.getPassword(), user.getPassword())) {
            throw new BadRequestException(ErrorCode.USER_ERROR_WRONG_PASSWORD, "Invalid password");
        }
        if (!AppConstant.STATUS_PENDING.equals(user.getStatus())) {
            throw new BadRequestException("Account is not on pending state");
        }
        user.setStatus(AppConstant.STATUS_ACTIVE);
        userRepository.save(user);
        return makeSuccessResponse(null, "Activate account success");
    }
}