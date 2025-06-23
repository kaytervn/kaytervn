package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.ChatRoomMember;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long>, JpaSpecificationExecutor<ChatRoomMember> {
    @Transactional
    void deleteAllByChatRoomId(Long id);
    boolean existsByChatRoomIdAndMemberId(Long chatroomId, Long memberId);

    @Transactional
    @Modifying
    @Query("UPDATE ChatRoomMember crm " +
            "SET crm.lastReadMessage = NULL " +
            "WHERE crm.lastReadMessage IS NOT NULL AND crm.chatRoom.id = :chatRoomId")
    void updateLastMessageNullByChatRoomId(@Param("chatRoomId") Long chatRoomId);

    @Transactional
    void deleteByChatRoomIdAndMemberId(Long chatroomId, Long memberId);

    @Query("SELECT CASE WHEN COUNT(m.id) > 0 THEN TRUE ELSE FALSE END " +
            "FROM ChatRoomMember m " +
            "WHERE m.chatRoom.id = :chatRoomId " +
            "AND m.member.id IN :accountIds")
    Boolean checkExistChatRoomMemberInAccountIds(
            @Param("accountIds") List<Long> accountIds,
            @Param("chatRoomId") Long chatRoomId
    );

    Optional<ChatRoomMember> findFirstByChatRoomIdAndMemberId(Long chatRoomId, Long memberId);

    @Query("SELECT DISTINCT crm.member.id FROM ChatRoomMember crm WHERE crm.chatRoom.id = :chatRoomId")
    List<Long> findAllMemberIdsByChatRoomId(@Param("chatRoomId") Long chatRoomId);

    Long countAllByChatRoomId(Long chatRoomId);

    @Query("SELECT DISTINCT crm.member.id FROM ChatRoomMember crm WHERE crm.chatRoom.id = :chatRoomId AND crm.member.id NOT IN :memberIds")
    List<Long> findAllMemberIdsByChatRoomIdAndNotIn(@Param("chatRoomId") Long chatRoomId, @Param("memberIds") List<Long> memberIds);

    Optional<ChatRoomMember> findFirstByIdOrMemberId(Long id, Long memberId);
}
