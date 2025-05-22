package com.example.demo.dto.request;

import com.example.demo.entity.Role;
import com.example.demo.validator.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleRequest {
    @NotBlank(message = "validation.not-blank")
    @UniqueConstraint(entity = Role.class, fieldName = "name")
    String name;
    Set<String> permissions;
}