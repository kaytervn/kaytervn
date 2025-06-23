package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long>, JpaSpecificationExecutor<Account> {
    Optional<Account> findFirstByUsername(String username);
    Optional<Account> findFirstByEmail(String email);
    Optional<Account> findFirstByPhone(String phone);
    @Transactional
    @Modifying
    @Query("UPDATE Account SET department.id = NULL WHERE department.id = :departmentId")
    void updateAllByDepartmentId(@Param("departmentId") Long departmentId);
    @Transactional
    @Modifying
    @Query("UPDATE Account SET department.id = NULL")
    void updateAllAccountByDepartmentToNull();
    @Transactional
    @Modifying
    @Query("UPDATE Account SET isSuperAdmin = :isSuperAdmin WHERE id = :id")
    void updateAccountByIdAndIsSuperAdmin(@Param("id") Long id, @Param("isSuperAdmin") Boolean isSuperAdmin);
    @Query("SELECT COUNT(a) FROM Account a")
    Integer countAllAccounts();
    boolean existsByGroupId(Long groupId);
    List<Account> findAllByGroupId(Long groupId);
    Boolean existsByDepartmentId(Long id);

    List<Account> findAllByIdInAndStatus(List<Long> accountIds, Integer status);

    @Query("SELECT acc FROM Account acc " +
            "WHERE acc.id IN :accountIds " +
            "AND acc.status = :status " +
            "AND acc.id NOT IN ( SELECT crm.member.id FROM ChatRoomMember crm where crm.chatRoom.id = :chatRoomId) ")
    List<Account> findAllByIdInAndStatusAndNotInChatRoomId(@Param("accountIds") List<Long> accountIds,
                                                           @Param("status") Integer status,
                                                           @Param("chatRoomId") Long chatRoomId);

    List<Account> findAllByIdInAndStatusAndIdNot(List<Long> accountIds, Integer status, Long currentUserId);

    Optional<Account> findFirstByIdAndStatusAndIdNot(Long id, Integer status, Long currentUserId);
}
