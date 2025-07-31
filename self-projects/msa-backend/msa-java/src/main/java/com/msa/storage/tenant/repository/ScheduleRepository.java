package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long>, JpaSpecificationExecutor<Schedule> {
    Boolean existsByName(String name);

    Boolean existsByNameAndIdNot(String name, Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Schedule tb SET tb.tag = NULL WHERE tb.tag.id = :id")
    void updateTagIdNull(@Param("id") Long id);

    @Query("SELECT s FROM Schedule s WHERE s.isSent = :isSent AND (s.type IS NULL OR s.type <> :type) AND s.dueDate >= :startDate AND s.dueDate <= :endDate")
    List<Schedule> findAllDueToday(@Param("isSent") Boolean isSent,
                                   @Param("type") Integer type,
                                   @Param("startDate") Date startDate,
                                   @Param("endDate") Date endDate);
}
