package com.tenant.mapper;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.account.SubKeyWrapperDto;
import com.tenant.storage.tenant.repository.TaskRepository;
import com.tenant.utils.AESUtils;
import org.mapstruct.*;

import java.text.DecimalFormat;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EncryptDecryptMapper {
    @Named("encrypt")
    default String encrypt(String secretKey, String value) {
        return AESUtils.encrypt(secretKey, value, FinanceConstant.AES_ZIP_ENABLE);
    }

    @Named("decrypt")
    default String decrypt(String secretKey, String value) {
        return AESUtils.decrypt(secretKey, value, FinanceConstant.AES_ZIP_ENABLE);
    }

    @Named("decryptAndEncrypt")
    default String decryptAndEncrypt(KeyWrapperDto keyWrapper, String value) {
        String decryptValue = AESUtils.decrypt(keyWrapper.getDecryptKey(), value, FinanceConstant.AES_ZIP_ENABLE);
        return AESUtils.encrypt(keyWrapper.getEncryptKey(), decryptValue, FinanceConstant.AES_ZIP_ENABLE);
    }

    @Named("decryptAndEncryptSubKeyWrapper")
    default String decryptAndEncryptSubKeyWrapper(SubKeyWrapperDto keyWrapper, String value) {
        String decryptValue = AESUtils.decrypt(keyWrapper.getDecryptKey(), value, FinanceConstant.AES_ZIP_ENABLE);
        return AESUtils.encrypt(keyWrapper.getEncryptKey(), decryptValue, FinanceConstant.AES_ZIP_ENABLE);
    }

    @Named("convertDoubleToString")
    default String convertDoubleToString(Double value) {
        DecimalFormat decimalFormat = new DecimalFormat("#");
        decimalFormat.setMaximumFractionDigits(0);
        return decimalFormat.format(value);
    }

    @Named("countTotalTasksByProjectId")
    default Integer countTotalTasksByProjectId(Long projectId, @Context TaskRepository taskRepository) {
        return taskRepository.countTotalTasksByProjectId(projectId);
    }

    @Named("countTotalChildrenByParentId")
    default Integer countTotalChildrenByParentId(Long parentId, @Context TaskRepository taskRepository) {
        return taskRepository.countTotalChildrenByParentId(parentId);
    }

    @Named("encryptAndDecrypt")
    default String encryptAndDecrypt(KeyWrapperDto keyWrapper, String value) {
        String encryptValue = AESUtils.encrypt(keyWrapper.getEncryptKey(), value, FinanceConstant.AES_ZIP_ENABLE);
        return AESUtils.decrypt(keyWrapper.getEncryptKey(), encryptValue, FinanceConstant.AES_ZIP_ENABLE);
    }
}
