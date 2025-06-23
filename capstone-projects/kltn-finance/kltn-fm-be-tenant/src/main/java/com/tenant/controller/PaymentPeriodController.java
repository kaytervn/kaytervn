package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.paymentPeriod.PaymentPeriodAdminDto;
import com.tenant.dto.paymentPeriod.PaymentPeriodDto;
import com.tenant.form.paymentPeriod.ApprovePaymentPeriodForm;
import com.tenant.form.paymentPeriod.RecalculatePaymentPeriodForm;
import com.tenant.mapper.PaymentPeriodMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.service.KeyService;
import com.tenant.service.TransactionService;
import com.tenant.utils.AESUtils;
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
@RequestMapping("/v1/payment-period")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class PaymentPeriodController extends ABasicController {
    @Autowired
    private PaymentPeriodRepository paymentPeriodRepository;
    @Autowired
    private PaymentPeriodMapper paymentPeriodMapper;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private KeyService keyService;
    @Autowired
    private TransactionService transactionService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PA_P_V')")
    public ApiMessageDto<PaymentPeriodAdminDto> get(@PathVariable("id") Long id) {
        PaymentPeriod paymentPeriod = paymentPeriodRepository.findById(id).orElse(null);
        if (paymentPeriod == null) {
            return makeErrorResponse(ErrorCode.PAYMENT_PERIOD_ERROR_NOT_FOUND, "Not found payment period");
        }
        PaymentPeriodAdminDto paymentPeriodAdminDto = paymentPeriodMapper.fromEncryptEntityToEncryptPaymentPeriodAdminDto(paymentPeriod, keyService.getFinanceKeyWrapper());
        return makeSuccessResponse(paymentPeriodAdminDto, "Get payment period success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PA_P_L')")
    public ApiMessageDto<ResponseListDto<List<PaymentPeriodAdminDto>>> list(PaymentPeriodCriteria paymentPeriodCriteria, Pageable pageable) {
        if (paymentPeriodCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)){
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<PaymentPeriod> paymentPeriods = paymentPeriodRepository.findAll(paymentPeriodCriteria.getCriteria(), pageable);
        ResponseListDto<List<PaymentPeriodAdminDto>> responseListObj = new ResponseListDto<>();
        List<PaymentPeriodAdminDto> paymentPeriodAdminDtos = paymentPeriodMapper.fromEncryptEntityListToEncryptPaymentPeriodAdminDtoList(paymentPeriods.getContent(), keyService.getFinanceKeyWrapper());
        responseListObj.setContent(paymentPeriodAdminDtos);
        responseListObj.setTotalPages(paymentPeriods.getTotalPages());
        responseListObj.setTotalElements(paymentPeriods.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list payment period success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<PaymentPeriodDto>>> autoComplete(PaymentPeriodCriteria paymentPeriodCriteria) {
        Pageable pageable = paymentPeriodCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        paymentPeriodCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        Page<PaymentPeriod> paymentPeriods = paymentPeriodRepository.findAll(paymentPeriodCriteria.getCriteria(), pageable);
        ResponseListDto<List<PaymentPeriodDto>> responseListObj = new ResponseListDto<>();
        List<PaymentPeriodDto> paymentPeriodDtos = paymentPeriodMapper.fromEncryptEntityListToEncryptPaymentPeriodDtoList(paymentPeriods.getContent(), keyService.getFinanceKeyWrapper());
        responseListObj.setContent(paymentPeriodDtos);
        responseListObj.setTotalPages(paymentPeriods.getTotalPages());
        responseListObj.setTotalElements(paymentPeriods.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list payment period success");
    }

    @PutMapping(value = "/approve", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PA_P_A')")
    public ApiMessageDto<String> changeState(@Valid @RequestBody ApprovePaymentPeriodForm approvePaymentPeriodForm, BindingResult bindingResult) {
        PaymentPeriod paymentPeriod = paymentPeriodRepository.findById(approvePaymentPeriodForm.getId()).orElse(null);
        if (paymentPeriod == null) {
            return makeErrorResponse(ErrorCode.PAYMENT_PERIOD_ERROR_NOT_FOUND, "Not found payment period");
        }
        if (paymentPeriod.getState().equals(FinanceConstant.PAYMENT_PERIOD_STATE_APPROVE)) {
            return makeErrorResponse(ErrorCode.PAYMENT_PERIOD_ERROR_NOT_ALLOW_UPDATE, "Payment period has already been approved");
        }
        paymentPeriod.setState(FinanceConstant.PAYMENT_PERIOD_STATE_APPROVE);
        paymentPeriodRepository.save(paymentPeriod);
        transactionRepository.updateStateAllByPaymentPeriodId(paymentPeriod.getId(), FinanceConstant.TRANSACTION_STATE_PAID);
        String encryptNote = AESUtils.encrypt(keyService.getFinanceSecretKey(), approvePaymentPeriodForm.getNote(), FinanceConstant.AES_ZIP_ENABLE);
        List<Transaction> transactions = transactionRepository.findAllByPaymentPeriodId(paymentPeriod.getId());
        transactions.forEach(transaction -> transactionService.createTransactionHistory(getCurrentUser(), transaction, encryptNote));
        return makeSuccessResponse(null, "Change state payment period success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PA_P_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        PaymentPeriod paymentPeriod = paymentPeriodRepository.findById(id).orElse(null);
        if (paymentPeriod == null) {
            return makeErrorResponse(ErrorCode.PAYMENT_PERIOD_ERROR_NOT_FOUND, "Not found payment period");
        }
        transactionRepository.updateAllByPaymentPeriodId(id);
        paymentPeriodRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete payment period success");
    }

    @PutMapping(value = "/recalculate", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PA_P_R')")
    public ApiMessageDto<String> recalculate(@Valid @RequestBody RecalculatePaymentPeriodForm recalculatePaymentPeriodForm, BindingResult bindingResult) {
        PaymentPeriod paymentPeriod = paymentPeriodRepository.findById(recalculatePaymentPeriodForm.getId()).orElse(null);
        if (paymentPeriod == null) {
            return makeErrorResponse(ErrorCode.PAYMENT_PERIOD_ERROR_NOT_FOUND, "Not found payment period");
        }
        if (paymentPeriod.getState().equals(FinanceConstant.PAYMENT_PERIOD_STATE_APPROVE)) {
            return makeErrorResponse(ErrorCode.PAYMENT_PERIOD_ERROR_NOT_ALLOW_RECALCULATE, "Payment period has already been approved");
        }
        transactionRepository.updateAllByPaymentPeriodId(paymentPeriod.getId());
        transactionRepository.updateAllByStateAndCreatedDate(paymentPeriod.getId(), FinanceConstant.TRANSACTION_STATE_APPROVE, paymentPeriod.getStartDate(), paymentPeriod.getEndDate());
        transactionService.recalculatePaymentPeriod(paymentPeriod.getId());
        return makeSuccessResponse(null, "Recalculate payment period success");
    }
}