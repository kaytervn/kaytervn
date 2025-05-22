package com.example.demo.dto.request;

import com.example.demo.entity.User;
import com.example.demo.validator.EmailConstraint;
import com.example.demo.validator.PasswordMatches;
import com.example.demo.validator.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {

    @NotBlank(message = "validation.not-blank")
    @EmailConstraint
    @UniqueConstraint(entity = User.class, fieldName = "email")
    String email;

    @NotBlank(message = "validation.not-blank")
    @UniqueConstraint(entity = User.class, fieldName = "username")
    String username;

    @NotBlank(message = "validation.not-blank")
    String password;

    @NotBlank(message = "validation.not-blank")
    String matchingPassword;
}
