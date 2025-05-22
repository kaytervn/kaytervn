package com.example.demo.repository;

import com.example.demo.dto.response.UserRoleResponse;
import com.example.demo.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);

    @Query("SELECT new com.example.demo.dto.response.UserRoleResponse(u.id, u.username, r.id, r.name) " +
            "FROM User u JOIN u.roles r " +
            "WHERE (LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "u.id LIKE :search OR " +
            "r.id LIKE :search)")
    Page<UserRoleResponse> findUserRoles(@Param("search") String search, Pageable pageable);
}
