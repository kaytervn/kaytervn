package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.paymentPeriod.PaymentPeriodAdminDto;
import com.tenant.dto.paymentPeriod.PaymentPeriodDto;
import com.tenant.form.paymentPeriod.CreatePaymentPeriodForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PaymentPeriodMapper extends EncryptDecryptMapper {
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "endDate", target = "endDate")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, createPaymentPeriodForm.getName()))")
    @BeanMapping(ignoreByDefault = true)
    PaymentPeriod fromCreatePaymentPeriodFormToEncryptEntity(CreatePaymentPeriodForm createPaymentPeriodForm, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "endDate", target = "endDate")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, paymentPeriod.getName()))")
    @Mapping(target = "totalIncome", expression = "java(decryptAndEncrypt(keyWrapper, paymentPeriod.getTotalIncome()))")
    @Mapping(target = "totalExpenditure", expression = "java(decryptAndEncrypt(keyWrapper, paymentPeriod.getTotalExpenditure()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptPaymentPeriodAdminDto")
    PaymentPeriodAdminDto fromEncryptEntityToEncryptPaymentPeriodAdminDto(PaymentPeriod paymentPeriod, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = PaymentPeriodAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptPaymentPeriodAdminDto")
    List<PaymentPeriodAdminDto> fromEncryptEntityListToEncryptPaymentPeriodAdminDtoList(List<PaymentPeriod> paymentPeriods, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "endDate", target = "endDate")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, paymentPeriod.getName()))")
    @Mapping(target = "totalIncome", expression = "java(decryptAndEncrypt(keyWrapper, paymentPeriod.getTotalIncome()))")
    @Mapping(target = "totalExpenditure", expression = "java(decryptAndEncrypt(keyWrapper, paymentPeriod.getTotalExpenditure()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptPaymentPeriodDto")
    PaymentPeriodDto fromEncryptEntityToEncryptPaymentPeriodDto(PaymentPeriod paymentPeriod, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = PaymentPeriodDto.class, qualifiedByName = "fromEncryptEntityToEncryptPaymentPeriodDto")
    List<PaymentPeriodDto> fromEncryptEntityListToEncryptPaymentPeriodDtoList(List<PaymentPeriod> paymentPeriods, @Context KeyWrapperDto keyWrapper);
}