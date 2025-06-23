package com.finance.data.model.api.response.key;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServerKey {
    private String host;
    private String port;
    private String privateKey;
    private String username;
    private String password;
}
