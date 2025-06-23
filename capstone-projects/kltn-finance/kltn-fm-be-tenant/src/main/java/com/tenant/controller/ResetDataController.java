package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.form.notification.CreateNotificationForm;
import com.tenant.form.paymentPeriod.CreatePaymentPeriodForm;
import com.tenant.mapper.NotificationMapper;
import com.tenant.mapper.PaymentPeriodMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.service.KeyService;
import com.tenant.service.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;

@RestController
@RequestMapping("/v1/reset-data")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class ResetDataController extends ABasicController{
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private KeyInformationRepository keyInformationRepository;
    @Autowired
    private KeyInformationGroupRepository keyInformationGroupRepository;
    @Autowired
    private TransactionHistoryRepository transactionHistoryRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private TransactionGroupRepository transactionGroupRepository;
    @Autowired
    private PaymentPeriodRepository paymentPeriodRepository;
    @Autowired
    private UserGroupNotificationRepository userGroupNotificationRepository;
    @Autowired
    private NotificationGroupRepository notificationGroupRepository;
    @Autowired
    private ServiceScheduleRepository serviceScheduleRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private ServiceGroupRepository serviceGroupRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private KeyService keyService;
    @Autowired
    private NotificationMapper notificationMapper;
    @Autowired
    private PaymentPeriodMapper paymentPeriodMapper;
    @Autowired
    private TransactionService transactionService;

    @ApiIgnore
    @GetMapping(value = "/database", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> resetDatabase() {
        if(!isCustomer()){
            return makeErrorResponse(null, "Not allowed reset database");
        }
        notificationRepository.deleteAll();
        keyInformationRepository.deleteAll();
        keyInformationGroupRepository.deleteAll();
        transactionHistoryRepository.deleteAll();
        transactionRepository.deleteAll();
        transactionGroupRepository.deleteAll();
        paymentPeriodRepository.deleteAll();
        userGroupNotificationRepository.deleteAll();
        notificationGroupRepository.deleteAll();
        serviceScheduleRepository.deleteAll();
        serviceRepository.deleteAll();
        serviceGroupRepository.deleteAll();
        categoryRepository.deleteAll();
        accountRepository.updateAllAccountByDepartmentToNull();
        departmentRepository.deleteAll();
        return makeSuccessResponse(null, "Reset database success");
    }

    @ApiIgnore
    @GetMapping(value = "/super-admin", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> resetSuperAdmin(@Param("id") Long id, @Param("isSuperAdmin") Boolean isSuperAdmin) {
        if(!isCustomer()){
            return makeErrorResponse(null, "Not allowed reset super admin");
        }
        accountRepository.updateAccountByIdAndIsSuperAdmin(id, isSuperAdmin);
        return makeSuccessResponse(null, "Reset super admin success");
    }

    @ApiIgnore
    @GetMapping(value = "/transaction", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> resetTransaction() {
        if(!isCustomer()){
            return makeErrorResponse(null, "Not allowed reset transaction");
        }
        transactionHistoryRepository.deleteAll();
        transactionRepository.deleteAll();
        return makeSuccessResponse(null, "Reset transaction success");
    }

    @ApiIgnore
    @GetMapping(value = "/key-information", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> resetKeyInformation() {
        if(!isCustomer()){
            return makeErrorResponse(null, "Not allowed reset key information");
        }
        keyInformationRepository.deleteAll();
        return makeSuccessResponse(null, "Reset key information success");
    }

    @PostMapping(value = "/notification-create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> createNotification(@Valid @RequestBody CreateNotificationForm createNotificationForm, BindingResult bindingResult) {
        Notification notification = notificationMapper.fromCreateNotificationFormToEntity(createNotificationForm);
        notificationRepository.save(notification);
        return makeSuccessResponse(null, "Create notification success");
    }

    @ApiIgnore
    @PostMapping(value = "/payment-period-create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> createPaymentPeriod(@Valid @RequestBody CreatePaymentPeriodForm createPaymentPeriodForm, BindingResult bindingResult) {
        if (createPaymentPeriodForm.getStartDate().after(createPaymentPeriodForm.getEndDate())) {
            return makeErrorResponse(ErrorCode.PAYMENT_PERIOD_ERROR_DATE_INVALID, "Start date must be before end date");
        }
        PaymentPeriod paymentPeriod = paymentPeriodMapper.fromCreatePaymentPeriodFormToEncryptEntity(createPaymentPeriodForm, keyService.getFinanceSecretKey());
        paymentPeriod.setState(FinanceConstant.PAYMENT_PERIOD_STATE_CREATED);
        paymentPeriodRepository.save(paymentPeriod);
        transactionRepository.updateAllByStateAndCreatedDate(paymentPeriod.getId(), FinanceConstant.TRANSACTION_STATE_APPROVE, paymentPeriod.getStartDate(), paymentPeriod.getEndDate());
        transactionService.recalculatePaymentPeriod(paymentPeriod.getId());
        return makeSuccessResponse(null, "Create payment period success");
    }
}
