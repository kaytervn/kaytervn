package com.msa.mapper;

import com.msa.dto.auth.KeyWrapperDto;
import com.msa.dto.backupCode.BackupCodeDto;
import com.msa.storage.tenant.model.BackupCode;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {AccountMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BackupCodeMapper extends ABasicMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(target = "code", expression = "java(decryptAndEncrypt(keyWrapper, backupCode.getCode()))")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoAutoComplete")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToBackupCodeDto")
    BackupCodeDto fromEntityToBackupCodeDto(BackupCode backupCode, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = BackupCodeDto.class, qualifiedByName = "fromEntityToBackupCodeDto")
    List<BackupCodeDto> fromEntityListToBackupCodeDtoList(List<BackupCode> backupcodeList, @Context KeyWrapperDto keyWrapper);
}
