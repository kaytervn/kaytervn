package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long>, JpaSpecificationExecutor<ChatHistory> {
    List<ChatHistory> findAllByAccountIdOrderByCreatedDateAsc(Long accountId);
}
