package com.user_spring.dto.request;

import com.user_spring.entity.Permission;
import com.user_spring.validator.UniqueValueConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionRequest {
    @NotBlank(message = "NOT_BLANK_FIELD")
    @UniqueValueConstraint(entity = Permission.class, fieldName = "name")
    String name;
    @NotBlank(message = "NOT_BLANK_FIELD")
    String description;
}
