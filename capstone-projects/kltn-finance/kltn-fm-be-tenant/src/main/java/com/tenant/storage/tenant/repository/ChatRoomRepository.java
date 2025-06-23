package com.tenant.storage.tenant.repository;

import com.tenant.dto.chatroom.ChatRoomLastMessageInterface;
import com.tenant.dto.chatroom.ChatRoomMemberCountInterface;
import com.tenant.dto.chatroom.ChatRoomUnreadCountInterface;
import com.tenant.dto.chatroom.OtherMemberInfoInterface;
import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long>, JpaSpecificationExecutor<ChatRoom> {
    boolean existsByIdAndOwnerId(@Param("chatroomId") Long chatroomId, @Param("accountId") Long accountId);

    @Query("SELECT cr.id as chatRoomId, COUNT(crm.id) as memberCount " +
            "FROM ChatRoom cr JOIN cr.chatRoomMembers crm " +
            "WHERE cr.id IN :chatRoomIds " +
            "GROUP BY cr.id")
    List<ChatRoomMemberCountInterface> countMembersByChatRoomIds(@Param("chatRoomIds") List<Long> chatRoomIds);

    @Query("SELECT m.chatRoom.id as chatRoomId, m as lastMessage " +
            "FROM Message m " +
            "WHERE m.chatRoom.id IN :chatRoomIds AND m.createdDate = " +
            "(SELECT MAX(m2.createdDate) FROM Message m2 WHERE m2.chatRoom.id = m.chatRoom.id)")
    List<ChatRoomLastMessageInterface> findLastMessagesByChatRoomIds(@Param("chatRoomIds") List<Long> chatRoomIds);

    @Query("SELECT crm.chatRoom.id as chatRoomId, COUNT(msg.id) as unreadCount " +
            "FROM ChatRoomMember crm JOIN crm.chatRoom.messages msg " +
            "WHERE crm.chatRoom.id IN :chatRoomIds AND crm.member.id = :userId " +
            "AND (crm.lastReadMessage IS NULL OR msg.createdDate > crm.lastReadMessage.createdDate) " +
            "GROUP BY crm.chatRoom.id")
    List<ChatRoomUnreadCountInterface> countUnreadMessages(@Param("chatRoomIds") List<Long> chatRoomIds,
                                                           @Param("userId") Long userId);

    @Query("SELECT crm.chatRoom.id as chatRoomId, a.id as memberId, a.fullName as fullName, a.avatarPath as avatar " +
            "FROM ChatRoomMember crm JOIN crm.member a " +
            "WHERE crm.chatRoom.id IN :chatRoomIds " +
            "AND crm.member.id != :currentUserId " +
            "AND crm.chatRoom.kind = :directMessageKind")
    List<OtherMemberInfoInterface> findOtherMembersInDirectMessages(
            @Param("chatRoomIds") List<Long> chatRoomIds,
            @Param("currentUserId") Long currentUserId,
            @Param("directMessageKind") Integer directMessageKind);

    @Query("SELECT COUNT(msg.id) " +
            "FROM ChatRoomMember crm JOIN crm.chatRoom.messages msg " +
            "WHERE crm.chatRoom.id = :chatRoomId AND crm.member.id = :userId " +
            "AND (crm.lastReadMessage IS NULL OR msg.createdDate > crm.lastReadMessage.createdDate) " +
            "GROUP BY crm.chatRoom.id")
    Long countUnreadMessagesByChatRoomId(@Param("chatRoomId") Long chatRoomId, @Param("userId") Long userId);

    @Query("SELECT a " +
            "FROM ChatRoomMember crm JOIN crm.member a " +
            "WHERE crm.chatRoom.id = :chatRoomId " +
            "AND crm.member.id != :currentUserId " +
            "AND crm.chatRoom.kind = :directMessageKind")
    Account findOtherMemberInDirectMessages(
            @Param("chatRoomId") Long chatRoomId,
            @Param("currentUserId") Long currentUserId,
            @Param("directMessageKind") Integer directMessageKind);

    @Query("SELECT crm.chatRoom.id, a FROM ChatRoomMember crm " +
            "JOIN crm.member a " +
            "WHERE crm.chatRoom.id IN :chatRoomIds " +
            "AND crm.member.id != :currentUserId " +
            "AND crm.chatRoom.kind = :directMessageKind")
    List<Object[]> findChatRoomAccounts(
            @Param("chatRoomIds") List<Long> chatRoomIds,
            @Param("currentUserId") Long currentUserId,
            @Param("directMessageKind") Integer directMessageKind);
}