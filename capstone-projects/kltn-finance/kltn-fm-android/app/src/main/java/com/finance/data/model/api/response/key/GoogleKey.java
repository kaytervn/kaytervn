package com.finance.data.model.api.response.key;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleKey {
    private String username;
    private String password;
    private String phoneNumber;
}
