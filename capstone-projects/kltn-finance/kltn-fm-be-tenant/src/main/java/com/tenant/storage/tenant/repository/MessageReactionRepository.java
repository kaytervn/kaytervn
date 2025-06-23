package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.MessageReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface MessageReactionRepository extends JpaRepository<MessageReaction, Long>, JpaSpecificationExecutor<MessageReaction> {
    @Transactional
    void deleteAllByMessageId(Long messageId);

    @Transactional
    void deleteAllByMessageChatRoomId(Long chatRoomId);

    @Transactional
    void deleteAllByAccountIdAndMessageId(Long accountId, Long messageId);
}
