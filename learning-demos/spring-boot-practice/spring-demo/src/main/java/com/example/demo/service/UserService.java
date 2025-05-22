package com.example.demo.service;

import com.example.demo.constant.AppConst;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.dto.response.UserRoleResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import io.micrometer.common.util.StringUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    SearchService searchService;

    @PersistenceContext
    EntityManager entityManager;

    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("user.error.not-found", HttpStatus.NOT_FOUND));
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("user.error.not-found", HttpStatus.NOT_FOUND));
    }

    public UserResponse createUser(UserCreationRequest request) {
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        HashSet<Role> roles = new HashSet<>();
        roleRepository.findByName(AppConst.ROLE_USER).ifPresent(roles::add);
        user.setRoles(roles);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public PageResponse<?> getUserRoles(Pageable pageable, String search) {
        Page<UserRoleResponse> userPage = userRepository.findUserRoles(search, pageable);
        return PageResponse.builder()
                .pageNo(userPage.getNumber())
                .pageSize(userPage.getSize())
                .totalPages(userPage.getTotalPages())
                .items(userPage.getContent())
                .build();
    }

    public PageResponse<?> getUsers(int pageNo, int pageSize, String... sorts) {
        List<Sort.Order> orders = new ArrayList<>();
        for (String sortBy : sorts) {
            if (StringUtils.isNotEmpty(sortBy)) {
                Pattern pattern = Pattern.compile("(\\w+?):(asc|desc)", Pattern.CASE_INSENSITIVE);
                Matcher matcher = pattern.matcher(sortBy);
                if (matcher.find()) {
                    String property = matcher.group(1);
                    Sort.Direction direction = matcher.group(2).equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
                    orders.add(new Sort.Order(direction, property));
                }
            }
        }

        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(orders));
        Page<User> usersPage = userRepository.findAll(pageable);
        List<User> users = usersPage.getContent();
        return PageResponse.builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalPages(usersPage.getTotalPages())
                .items(userMapper.toUserResponseList(users))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<?> getUsersAdvance(Pageable pageable, String[] user, String[] role) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();

        CriteriaQuery<User> query = builder.createQuery(User.class);
        Root<User> userRoot = query.from(User.class);
        Join<User, Role> roleRoot = userRoot.join("roles");

        Predicate userPre = searchService.buildPredicate(userRoot, builder, user);
        Predicate rolePre = searchService.buildPredicate(roleRoot, builder, role);
        Predicate finalPre = builder.and(userPre, rolePre);

        query.where(finalPre);
        searchService.applySort(pageable, userRoot, builder, query);

        // Count Total Pages
        CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        Root<User> countRoot = countQuery.from(User.class);
        Join<User, Role> countRoleRoot = countRoot.join("roles");

        Predicate countUserPre = searchService.buildPredicate(countRoot, builder, user);
        Predicate countRolePre = searchService.buildPredicate(countRoleRoot, builder, role);
        Predicate finalCountPre = builder.and(countUserPre, countRolePre);

        countQuery.select(builder.count(countRoot)).where(finalCountPre);
        long totalElements = entityManager.createQuery(countQuery).getSingleResult();
        int totalPages = (int) Math.ceil((double) totalElements / pageable.getPageSize());

        List<User> users = entityManager.createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        return PageResponse.builder()
                .pageNo(pageable.getPageNumber())
                .pageSize(pageable.getPageSize())
                .totalPages(totalPages)
                .items(userMapper.toUserResponseList(users))
                .build();
    }


    public UserResponse getUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("user.error.not-found", HttpStatus.NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    public UserResponse getMyInfo() {
        return userMapper.toUserResponse(getCurrentUser());
    }

    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("user.error.not-found", HttpStatus.NOT_FOUND));
        userMapper.updateUserFromDto(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        Set<Role> roles = roleRepository.findByNameIn(request.getRoles());
        user.setRoles(roles);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(String userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new AppException("user.error.not-found", HttpStatus.NOT_FOUND));
        userRepository.deleteById(userId);
    }
}
