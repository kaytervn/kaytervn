package com.master.jwt;

import com.master.utils.ZipUtils;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;

@Slf4j
@Data
public class MasterJwt implements Serializable {
    public static final String DELIM = "\\|";
    public static final String EMPTY_STRING = "<>";

    private Long accountId = -1L;
    private Integer userKind = -1;
    private String username = EMPTY_STRING;
    private Boolean isSuperAdmin = false;
    private String secretKey = EMPTY_STRING;
    private String tenantName = EMPTY_STRING;

    public static MasterJwt decode(String input) {
        if (input == null || input.isEmpty()) {
            log.warn("Input token is null or empty.");
            return null;
        }
        MasterJwt result = null;
        try {
            String decoded = ZipUtils.unzipString(input);
            if (decoded == null) {
                log.warn("Decoded token is null.");
                return null;
            }
            String[] items = decoded.split(DELIM, -1);
            if (items.length < 5) {
                log.warn("Token format is invalid. Expected at least 4 parts but got {}", items.length);
                return null;
            }
            result = new MasterJwt();
            result.setAccountId(parserLong(items[0], -1L));
            result.setUserKind(parserInt(items[1], -1));
            result.setUsername(checkString(items[2]));
            result.setIsSuperAdmin(checkBoolean(items[3]));
            result.setSecretKey(checkString(items[4]));
            result.setTenantName(checkString(items[5]));

        } catch (Exception e) {
            log.error("Error decoding token: {}", e.getMessage(), e);
        }
        return result;
    }

    private static Long parserLong(String input, Long defaultValue) {
        try {
            return Long.parseLong(input);
        } catch (NumberFormatException e) {
            log.warn("Invalid Long format: {}", input);
        }
        return defaultValue;
    }

    private static Integer parserInt(String input, Integer defaultValue) {
        try {
            return Integer.parseInt(input);
        } catch (NumberFormatException e) {
            log.warn("Invalid Integer format: {}", input);
        }
        return defaultValue;
    }

    private static String checkString(String input) {
        return (input != null && !input.equals(EMPTY_STRING)) ? input : null;
    }

    private static Boolean checkBoolean(String input) {
        return "true".equalsIgnoreCase(input);
    }
}