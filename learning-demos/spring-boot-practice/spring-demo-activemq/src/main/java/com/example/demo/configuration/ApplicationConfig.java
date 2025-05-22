package com.example.demo.configuration;

import com.example.demo.constant.AppConst;
import com.example.demo.entity.Permission;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.PermissionRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.LocaleResolver;

import java.util.HashSet;
import java.util.Set;

@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ApplicationConfig {
    @NonFinal
    @Value("${user.admin.username}")
    String ADMIN_USERNAME;

    @NonFinal
    @Value("${user.admin.password}")
    String ADMIN_PASSWORD;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository,
                                        RoleRepository roleRepository,
                                        PermissionRepository permissionRepository) {
        return args -> {
            if (userRepository.findByUsername(ADMIN_USERNAME).isEmpty()) {

                Set<Permission> permissions = new HashSet<>();
                permissions.add(Permission.builder()
                        .name(AppConst.CREATE_POST)
                        .description("User create a post")
                        .build());
                permissions.add(Permission.builder()
                        .name(AppConst.UPDATE_POST)
                        .description("User update a post")
                        .build());

                permissionRepository.saveAll(permissions);

                roleRepository.save(Role.builder()
                        .name(AppConst.ROLE_USER)
                        .permissions(permissions)
                        .build());
                Role adminRole = roleRepository.save(Role.builder()
                        .name(AppConst.ROLE_ADMIN)
                        .permissions(permissions)
                        .build());

                var roles = new HashSet<Role>();
                roles.add(adminRole);

                User user = User.builder()
                        .username(ADMIN_USERNAME)
                        .password(passwordEncoder().encode(ADMIN_PASSWORD))
                        .roles(roles)
                        .enabled(true)
                        .build();

                userRepository.save(user);
            }
        };
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
