package com.tenant.mapper;

import com.tenant.dto.message.reation.MessageReactionDto;
import com.tenant.form.message.reaction.ReactMessageReactionForm;
import com.tenant.storage.tenant.model.MessageReaction;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring", uses = {AccountMapper.class, MessageMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface MessageReactionMapper {
    @Mapping(source = "kind", target = "kind")
    @BeanMapping(ignoreByDefault = true)
    MessageReaction fromCreateMessageReactionFormToEntity(ReactMessageReactionForm reactMessageReactionForm);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoAutoComplete")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToMessageReactionDto")
    MessageReactionDto fromEntityToMessageReactionDto(MessageReaction messagereaction);

    @IterableMapping(elementTargetType = MessageReactionDto.class, qualifiedByName = "fromEntityToMessageReactionDto")
    @Named("fromEntityListToMessageReactionDtoList")
    List<MessageReactionDto> fromEntityListToMessageReactionDtoList(List<MessageReaction> messagereactionList);
}