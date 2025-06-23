package com.tenant.mapper;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.chatHistory.ChatHistoryDto;
import com.tenant.form.chatHistory.CreateChatHistoryForm;
import com.tenant.multitenancy.dto.ChatHistoryForm;
import com.tenant.multitenancy.dto.PartDto;
import com.tenant.storage.tenant.model.ChatHistory;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ChatHistoryMapper extends EncryptDecryptMapper {
    @Mapping(target = "message", expression = "java(decryptAndEncrypt(keyWrapper, createChatHistoryForm.getMessage()))")
    @BeanMapping(ignoreByDefault = true)
    ChatHistory fromCreateChatHistoryFormToEntity(CreateChatHistoryForm createChatHistoryForm, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "role", target = "role")
    @Mapping(target = "message", expression = "java(decryptAndEncrypt(keyWrapper, chatHistory.getMessage()))")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToChatHistoryDto")
    ChatHistoryDto fromEntityToChatHistoryDto(ChatHistory chatHistory, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = ChatHistoryDto.class, qualifiedByName = "fromEntityToChatHistoryDto")
    List<ChatHistoryDto> fromEntityListToChatHistoryDtoList(List<ChatHistory> chathistoryList, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "role", target = "role", qualifiedByName = "mapRoleToString")
    @Mapping(target = "parts", expression = "java(mapMessageToListPartDto(decrypt(secretKey, chatHistory.getMessage())))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToChatHistoryForm")
    ChatHistoryForm fromEntityToChatHistoryForm(ChatHistory chatHistory, @Context String secretKey);

    @IterableMapping(elementTargetType = ChatHistoryForm.class, qualifiedByName = "fromEntityToChatHistoryForm")
    List<ChatHistoryForm> fromEntityListToChatHistoryFormList(List<ChatHistory> chatHistoryList, @Context String secretKey);

    @Named("mapRoleToString")
    default String mapRoleToString(Integer role) {
        return FinanceConstant.CHAT_HISTORY_ROLE_USER.equals(role) ? "user" : "model";
    }

    default List<PartDto> mapMessageToListPartDto(String message) {
        PartDto partDto = new PartDto();
        partDto.setText(message);
        return List.of(partDto);
    }
}
