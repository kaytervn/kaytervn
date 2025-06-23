package com.master.repository;

import com.master.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long>, JpaSpecificationExecutor<Group> {
   Optional<Group> findFirstByName(String name);
   Optional<Group> findFirstByKind(Integer kind);
   Optional<Group> findFirstByIdAndKind(Long id, Integer kind);
}
