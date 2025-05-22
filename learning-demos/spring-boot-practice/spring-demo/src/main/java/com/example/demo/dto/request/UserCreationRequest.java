package com.example.demo.dto.request;

import com.example.demo.entity.User;
import com.example.demo.enums.Gender;
import com.example.demo.validator.DobConstraint;
import com.example.demo.validator.EnumConstraint;
import com.example.demo.validator.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @UniqueConstraint(entity = User.class, fieldName = "username")
    @NotBlank(message = "validation.not-blank")
    String username;

    @NotBlank(message = "validation.not-blank")
    String password;

    @DobConstraint(min = 18)
    LocalDate dateOfBirth;

    @EnumConstraint(enumClass = Gender.class)
    String gender;

    int points;
}
