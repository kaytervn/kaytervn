package com.example.demo.dto.request;

import com.example.demo.entity.User;
import com.example.demo.enums.Gender;
import com.example.demo.validator.DobConstraint;
import com.example.demo.validator.EnumConstraint;
import com.example.demo.validator.UniqueConstraint;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Date;

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
