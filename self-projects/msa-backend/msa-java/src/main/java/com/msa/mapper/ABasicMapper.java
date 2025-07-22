package com.msa.mapper;

import com.msa.dto.auth.KeyWrapperDto;
import com.msa.utils.AESUtils;
import com.msa.utils.ConvertUtils;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ABasicMapper {
    @Named("encrypt")
    default String encrypt(String secretKey, String value) {
        return AESUtils.encrypt(secretKey, value);
    }

    @Named("decrypt")
    default String decrypt(String secretKey, String value) {
        return AESUtils.decrypt(secretKey, value);
    }

    @Named("decryptAndEncrypt")
    default String decryptAndEncrypt(KeyWrapperDto keyWrapper, String value) {
        String decryptValue = AESUtils.decrypt(keyWrapper.getDecryptKey(), value);
        return AESUtils.encrypt(keyWrapper.getEncryptKey(), decryptValue);
    }

    @Named("convertDoubleToString")
    default String convertDoubleToString(Double value) {
        return ConvertUtils.convertDoubleToString(value);
    }

    @Named("encryptAndDecrypt")
    default String encryptAndDecrypt(KeyWrapperDto keyWrapper, String value) {
        String encryptValue = AESUtils.encrypt(keyWrapper.getEncryptKey(), value);
        return AESUtils.decrypt(keyWrapper.getEncryptKey(), encryptValue);
    }
}
