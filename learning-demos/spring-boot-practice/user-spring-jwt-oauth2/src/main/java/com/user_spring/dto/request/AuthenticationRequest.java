package com.user_spring.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {
    @NotBlank(message = "NOT_BLANK_FIELD")
    String username;
    @NotBlank(message = "NOT_BLANK_FIELD")
    String password;
}
