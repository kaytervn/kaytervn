package com.tenant.mapper;

import com.tenant.dto.chatroom.ChatRoomDto;
import com.tenant.form.chatroom.CreateChatRoomForm;
import com.tenant.form.chatroom.UpdateChatRoomForm;
import com.tenant.storage.tenant.model.ChatRoom;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {AccountMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ChatRoomMapper {
    @Mapping(source = "name", target = "name")
    @Mapping(source = "avatar", target = "avatar")
    @BeanMapping(ignoreByDefault = true)
    ChatRoom fromCreateChatRoomFormToEntity(CreateChatRoomForm createChatRoomForm);

    @Mapping(source = "name", target = "name")
    @Mapping(source = "avatar", target = "avatar")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateChatRoomFormToEntity(UpdateChatRoomForm updateChatRoomForm, @MappingTarget ChatRoom chatroom);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "avatar", target = "avatar")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "owner", target = "owner", qualifiedByName = "fromEntityToAccountDtoAutoComplete")
    @Mapping(target = "totalUnreadMessages", ignore = true)
    @Mapping(source = "settings", target = "settings")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToChatRoomDto")
    ChatRoomDto fromEntityToChatRoomDto(ChatRoom chatroom);

    @IterableMapping(elementTargetType = ChatRoomDto.class, qualifiedByName = "fromEntityToChatRoomDto")
    List<ChatRoomDto> fromEntityListToChatRoomDtoList(List<ChatRoom> chatroomList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "kind", target = "kind")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToChatRoomDtoAutoComplete")
    ChatRoomDto fromEntityToChatRoomDtoAutoComplete(ChatRoom chatroom);

    @IterableMapping(elementTargetType = ChatRoomDto.class, qualifiedByName = "fromEntityToChatRoomDtoAutoComplete")
    List<ChatRoomDto> fromEntityListToChatRoomDtoListAutoComplete(List<ChatRoom> chatroomList);

}