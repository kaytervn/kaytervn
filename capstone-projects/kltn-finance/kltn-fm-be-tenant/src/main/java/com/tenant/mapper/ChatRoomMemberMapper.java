package com.tenant.mapper;
import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.chatroomMember.ChatRoomMemberDto;
import com.tenant.form.chatroomMember.CreateChatRoomMemberForm;
import com.tenant.form.chatroomMember.UpdateChatRoomMemberForm;
import com.tenant.storage.tenant.model.ChatRoomMember;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring", uses = {ChatRoomMapper.class, AccountMapper.class, MessageMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ChatRoomMemberMapper extends EncryptDecryptMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "member", target = "member", qualifiedByName = "fromEntityToAccountDtoAutoComplete")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToChatRoomMemberDto")
    ChatRoomMemberDto fromEntityToChatRoomMemberDto(ChatRoomMember chatroommember);

    @IterableMapping(elementTargetType = ChatRoomMemberDto.class, qualifiedByName = "fromEntityToChatRoomMemberDto")
    List<ChatRoomMemberDto> fromEntityListToChatRoomMemberDtoList(List<ChatRoomMember> chatroommemberList);
}