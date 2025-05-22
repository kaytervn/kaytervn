package com.user_spring.dto.request;

import com.user_spring.enums.Gender;
import com.user_spring.entity.User;
import com.user_spring.validator.DobConstraint;
import com.user_spring.validator.EnumConstraint;
import com.user_spring.validator.UniqueValueConstraint;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @UniqueValueConstraint(entity = User.class, fieldName = "username")
    @Size(min = 5, message = "INVALID_FIELD_SIZE")
    String username;

    @Size(min = 3, message = "INVALID_FIELD_SIZE")
    String password;

    @DobConstraint(message = "INVALID_DOB", min = 18)
    LocalDate dateOfBirth;

    @UniqueValueConstraint(entity = User.class, fieldName = "phone")
    @Pattern(regexp = "^\\d{10}$", message = "INVALID_PHONE")
    String phone;

    @EnumConstraint(enumClass = Gender.class)
    String gender;
}
