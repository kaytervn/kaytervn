package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long>, JpaSpecificationExecutor<Message> {
    @Transactional
    void deleteAllByChatRoomId(Long id);

    @Query("SELECT mess FROM Message mess WHERE mess.chatRoom.id = :chatroomId " +
            "AND mess.createdDate = (SELECT MAX(m.createdDate) FROM Message m WHERE m.chatRoom.id = :chatroomId)")
    Optional<Message> findLastMessageByChatRoomId(@Param("chatroomId") Long chatroomId);

    Optional<Message> findFirstByIdAndChatRoomId(Long messageId, Long chatroomId);
}