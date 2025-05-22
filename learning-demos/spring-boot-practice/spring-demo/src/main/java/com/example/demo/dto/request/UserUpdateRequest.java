package com.example.demo.dto.request;

import com.example.demo.enums.Gender;
import com.example.demo.validator.DobConstraint;
import com.example.demo.validator.EnumConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @NotBlank(message = "validation.not-blank")
    String password;

    @DobConstraint(min = 18)
    LocalDate dateOfBirth;

    @EnumConstraint(enumClass = Gender.class)
    String gender;

    int points;

    @NotNull(message = "validation.not-null")
    Set<String> roles;
}