package com.master.mapper;

import com.master.constant.MasterConstant;
import com.master.utils.AESUtils;
import org.mapstruct.*;

import java.text.DecimalFormat;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ABasicMapper {

    @Named("encrypt")
    default String encrypt(String secretKey, String value) {
        return AESUtils.encrypt(secretKey, value, MasterConstant.AES_ZIP_ENABLE);
    }

    @Named("decrypt")
    default String decrypt(String secretKey, String value) {
        return AESUtils.decrypt(secretKey, value, MasterConstant.AES_ZIP_ENABLE);
    }

    @Named("convertDoubleToString")
    default String convertDoubleToString(Double value) {
        DecimalFormat decimalFormat = new DecimalFormat("#");
        decimalFormat.setMaximumFractionDigits(0);
        return decimalFormat.format(value);
    }
}
