package com.master.controller;

import com.master.constant.MasterConstant;
import com.master.dto.ApiMessageDto;
import com.master.dto.ErrorCode;
import com.master.dto.ResponseListDto;
import com.master.dto.customer.CustomerAdminDto;
import com.master.dto.customer.CustomerDto;
import com.master.dto.location.LocationDto;
import com.master.exception.BadRequestException;
import com.master.form.account.RequestKeyForm;
import com.master.form.customer.CreateCustomerForm;
import com.master.form.customer.UpdateCustomerForm;
import com.master.form.customer.UpdateCustomerProfileForm;
import com.master.mapper.CustomerMapper;
import com.master.mapper.LocationMapper;
import com.master.model.*;
import com.master.model.criteria.CustomerCriteria;
import com.master.redis.CacheClientService;
import com.master.redis.RedisConstant;
import com.master.repository.*;
import com.master.service.MediaService;
import com.master.service.SessionService;
import com.master.service.impl.UserServiceImpl;
import com.master.utils.RSAUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
@RequestMapping("/v1/customer")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class CustomerController extends ABasicController {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private CustomerMapper customerMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private MediaService mediaService;
    @Autowired
    private LocationMapper locationMapper;
    @Autowired
    private BranchRepository branchRepository;
    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private SessionService sessionService;
    @Autowired
    private CacheClientService cacheClientService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CU_V')")
    public ApiMessageDto<CustomerAdminDto> get(@PathVariable("id") Long id) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer == null) {
            return makeErrorResponse(ErrorCode.CUSTOMER_ERROR_NOT_FOUND, "Not found customer");
        }
        CustomerAdminDto dto = customerMapper.fromEntityToCustomerAdminDto(customer);
        return makeSuccessResponse(dto, "Get customer success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<CustomerDto>>> autoComplete(CustomerCriteria customerCriteria) {
        Pageable pageable = customerCriteria.getIsPaged().equals(MasterConstant.BOOLEAN_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        customerCriteria.setStatus(MasterConstant.STATUS_ACTIVE);
        Page<Customer> customers = customerRepository.findAll(customerCriteria.getCriteria(), pageable);
        ResponseListDto<List<CustomerDto>> responseListDto = new ResponseListDto<>();
        responseListDto.setContent(customerMapper.fromEntityListToCustomerDtoList(customers.getContent()));
        responseListDto.setTotalPages(customers.getTotalPages());
        responseListDto.setTotalElements(customers.getTotalElements());
        return makeSuccessResponse(responseListDto, "Get list customer success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CU_L')")
    public ApiMessageDto<ResponseListDto<List<CustomerAdminDto>>> list(CustomerCriteria customerCriteria, Pageable pageable) {
        if (!isSuperAdmin()) {
            customerCriteria.setPermissionAccountId(getCurrentUser());
        }
        if (customerCriteria.getIsPaged().equals(MasterConstant.BOOLEAN_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<Customer> customers = customerRepository.findAll(customerCriteria.getCriteria(), pageable);
        ResponseListDto<List<CustomerAdminDto>> responseListDto = new ResponseListDto<>();
        List<CustomerAdminDto> dtos = customerMapper.fromEntityListToCustomerAdminDtoList(customers.getContent());
//        sessionService.mappingLastLoginForListCustomers(dtos);
        responseListDto.setContent(dtos);
        responseListDto.setTotalPages(customers.getTotalPages());
        responseListDto.setTotalElements(customers.getTotalElements());
        return makeSuccessResponse(responseListDto, "Get list customer success");
    }

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<CustomerDto> getCustomerProfile() {
        Customer customer = customerRepository.findById(getCurrentUser()).orElseThrow(
                () -> new BadRequestException(ErrorCode.CUSTOMER_ERROR_NOT_FOUND, "[Customer] Customer not found")
        );
        if (!MasterConstant.STATUS_ACTIVE.equals(customer.getStatus())) {
            throw new BadRequestException(ErrorCode.CUSTOMER_ERROR_NOT_ACTIVE, "Customer not active");
        }
        return makeSuccessResponse(customerMapper.fromEntityToCustomerDtoProfile(customer), "Get customer profile success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CU_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateCustomerForm createCustomerForm, BindingResult bindingResult) {
        if (accountRepository.findFirstByUsername(createCustomerForm.getUsername()).isPresent()) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_USERNAME_EXISTED, "Username existed");
        }
        if (accountRepository.findFirstByEmail(createCustomerForm.getEmail()).isPresent()) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_EMAIL_EXISTED, "Email existed");
        }
        if (accountRepository.findFirstByPhone(createCustomerForm.getPhone()).isPresent()) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_PHONE_EXISTED, "Phone existed");
        }
        Group group = groupRepository.findFirstByKind(MasterConstant.USER_KIND_CUSTOMER).orElse(null);
        if (group == null) {
            return makeErrorResponse(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        Branch branch = branchRepository.findById(createCustomerForm.getBranchId()).orElse(null);
        if (branch == null) {
            throw new BadRequestException(ErrorCode.BRANCH_ERROR_NOT_FOUND, "Branch not found");
        }
        Account account = customerMapper.fromCreateCustomerFormToAccountEntity(createCustomerForm);
        account.setPassword(passwordEncoder.encode(createCustomerForm.getPassword()));
        account.setKind(MasterConstant.USER_KIND_CUSTOMER);
        account.setGroup(group);
        accountRepository.save(account);
        Customer customer = customerMapper.fromCreateCustomerFormToEntity(createCustomerForm);
        customer.setAccount(account);
        customer.setBranch(branch);
        customerRepository.save(customer);
        return makeSuccessResponse(null, "Create customer success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CU_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateCustomerForm updateCustomerForm, BindingResult bindingResult) {
        Account account = accountRepository.findFirstByIdAndKind(updateCustomerForm.getId(), MasterConstant.USER_KIND_CUSTOMER).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (!updateCustomerForm.getEmail().equals(account.getEmail()) && accountRepository.findFirstByEmail(updateCustomerForm.getEmail()).isPresent()) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_EMAIL_EXISTED, "Email existed");
        }
        if (!updateCustomerForm.getPhone().equals(account.getPhone()) && accountRepository.findFirstByPhone(updateCustomerForm.getPhone()).isPresent()) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_PHONE_EXISTED, "Phone existed");
        }
        if (StringUtils.isNotBlank(updateCustomerForm.getAvatarPath())
                && !updateCustomerForm.getAvatarPath().equals(account.getAvatarPath())) {
            mediaService.deleteFile(account.getAvatarPath());
            account.setAvatarPath(updateCustomerForm.getAvatarPath());
        }
        boolean isLock = MasterConstant.STATUS_ACTIVE.equals(account.getStatus()) && !MasterConstant.STATUS_ACTIVE.equals(updateCustomerForm.getStatus());
        customerMapper.fromUpdateCustomerFormToAccountEntity(updateCustomerForm, account);
        if (StringUtils.isNotBlank(updateCustomerForm.getPassword())) {
            account.setPassword(passwordEncoder.encode(updateCustomerForm.getPassword()));
        }
        accountRepository.save(account);
        Customer customer = customerRepository.findById(updateCustomerForm.getId()).orElse(null);
        if (customer == null) {
            return makeErrorResponse(ErrorCode.CUSTOMER_ERROR_NOT_FOUND, "Not found customer");
        }
        customerMapper.fromUpdateCustomerFormToEntity(updateCustomerForm, customer);
        customer.setAccount(account);
        customerRepository.save(customer);
        if (isLock) {
            List<String> tenantNames = locationRepository.findAllDistinctTenantIdByCustomerId(customer.getId());
            sessionService.sendMessageLockCustomer(account.getUsername());
            tenantNames.forEach(tenant -> {
                sessionService.sendMessageLockAccountsByTenantId(RedisConstant.KEY_EMPLOYEE, tenant);
                sessionService.sendMessageLockAccountsByTenantId(RedisConstant.KEY_MOBILE, tenant);
            });
        }
        return makeSuccessResponse(null, "Update customer success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CU_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer == null) {
            return makeErrorResponse(ErrorCode.CUSTOMER_ERROR_NOT_FOUND, "Not found customer");
        }
        if (locationRepository.existsByCustomerId(id)) {
            return makeErrorResponse(ErrorCode.CUSTOMER_ERROR_NOT_ALLOW_DELETE, "Not allowed to delete customer");
        }
        String username = customer.getAccount().getUsername();
        accountRepository.deleteAllByCustomerId(id);
        customerRepository.deleteById(id);
        if (MasterConstant.STATUS_ACTIVE.equals(customer.getStatus())) {
            List<String> tenantNames = locationRepository.findAllDistinctTenantIdByCustomerId(customer.getId());
            sessionService.sendMessageLockCustomer(username);
            tenantNames.forEach(tenant -> {
                sessionService.sendMessageLockAccountsByTenantId(RedisConstant.KEY_EMPLOYEE, tenant);
                sessionService.sendMessageLockAccountsByTenantId(RedisConstant.KEY_MOBILE, tenant);
            });
        }
        return makeSuccessResponse(null, "Delete customer success");
    }

    @GetMapping(value = "/my-location", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<LocationDto> myLocations() {
        Location location = locationRepository.findFirstByTenantId(getCurrentTenantName()).orElse(null);
        userService.checkValidLocation(location);
        return makeSuccessResponse(locationMapper.fromEntityToLocationDto(location), "Get my location success");
    }

    @PutMapping(value = "/update-profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> updateCustomerProfile(@Valid @RequestBody UpdateCustomerProfileForm form, BindingResult bindingResult) {
        Customer customer = customerRepository.findById(getCurrentUser()).orElseThrow(
                () -> new BadRequestException(ErrorCode.CUSTOMER_ERROR_NOT_FOUND, "[Customer] Customer not found")
        );
        if (!MasterConstant.STATUS_ACTIVE.equals(customer.getStatus())) {
            throw new BadRequestException(ErrorCode.CUSTOMER_ERROR_NOT_ACTIVE, "Customer not active");
        }
        if (StringUtils.isNoneBlank(form.getNewPassword()) && StringUtils.isNoneBlank(form.getOldPassword())) {
            if (!passwordEncoder.matches(form.getOldPassword(), customer.getAccount().getPassword())) {
                throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_WRONG_PASSWORD, "[Customer] Wrong password");
            }
            if (form.getNewPassword().equals(form.getOldPassword())) {
                throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NEW_PASSWORD_SAME_OLD_PASSWORD, "[Customer] New password must be different from old password");
            }
            customer.getAccount().setPassword(passwordEncoder.encode(form.getNewPassword()));
        }
        String avatarPath = customer.getAccount().getAvatarPath();
        if (!Objects.equals(form.getAvatarPath(), avatarPath)) {
            mediaService.deleteFile(avatarPath);
        }
        customerMapper.mappingUpdateCustomerProfileFormToEntity(form, customer.getAccount());
        accountRepository.save(customer.getAccount());
        customerRepository.save(customer);
        return makeSuccessResponse(null, "Update customer profile success");
    }

    @PostMapping("/request-key")
    public ResponseEntity<Resource> requestKey(@Valid @RequestBody RequestKeyForm requestKeyForm, BindingResult bindingResult) {
        Customer customer = customerRepository.findById(getCurrentUser()).orElse(null);
        if (customer == null) {
            throw new BadRequestException(ErrorCode.CUSTOMER_ERROR_NOT_FOUND, "Not found customer");
        }
        if (!passwordEncoder.matches(requestKeyForm.getPassword(), customer.getAccount().getPassword())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_REQUEST_KEY, "Wrong password");
        }
        if (customer.getStatus() == MasterConstant.STATUS_PENDING) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_REQUEST_KEY, "Account status is currently pending");
        }
        if (customer.getStatus() == MasterConstant.STATUS_LOCK) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_REQUEST_KEY, "Account has already been locked");
        }
        KeyPair keyPair = RSAUtils.generateKeyPair();
        String publicKey = RSAUtils.keyToString(keyPair.getPublic());
        String privateKey = RSAUtils.keyToString(keyPair.getPrivate());
        StringBuilder contentBuilder = new StringBuilder();
        contentBuilder.append("-----BEGIN PRIVATE KEY-----").append("\n");
        contentBuilder.append(privateKey).append("\n");
        contentBuilder.append("-----END PRIVATE KEY-----").append("\n");
        String key = cacheClientService.getKeyString(RedisConstant.KEY_CUSTOMER, customer.getAccount().getUsername(), getCurrentTenantName());
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
}
