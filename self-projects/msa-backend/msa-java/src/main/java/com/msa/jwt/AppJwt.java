package com.msa.jwt;

import com.msa.utils.ZipUtils;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;

@Slf4j
@Data
public class AppJwt implements Serializable {
    public static final String DELIM = "\\|";
    public static final String EMPTY_STRING = "<>";

    private Long accountId = -1L;
    private Integer userKind = -1;
    private String username = EMPTY_STRING;
    private Boolean isSuperAdmin = false;
    private String secretKey = EMPTY_STRING;
    private String sessionId = EMPTY_STRING;

    public static AppJwt decode(String input) {
        if (input == null || input.isEmpty()) {
            log.warn("Input token is null or empty.");
            return null;
        }
        AppJwt result = null;
        try {
            String decoded = ZipUtils.unzipString(input);
            if (decoded == null) {
                log.warn("Decoded token is null.");
                return null;
            }
            String[] items = decoded.split(DELIM, -1);
            if (items.length < 5) {
                log.warn("Token format is invalid. Expected at least 5 parts but got {}", items.length);
                return null;
            }
            result = new AppJwt();
            result.setAccountId(parserLong(items[0]));
            result.setUserKind(parserInt(items[1]));
            result.setUsername(checkString(items[2]));
            result.setIsSuperAdmin(checkBoolean(items[3]));
            result.setSecretKey(checkString(items[4]));
            result.setSessionId(checkString(items[5]));
        } catch (Exception e) {
            log.error("Error decoding token: {}", e.getMessage(), e);
        }
        return result;
    }

    private static Long parserLong(String input) {
        try {
            return Long.parseLong(input);
        } catch (NumberFormatException e) {
            log.warn("Invalid Long format: {}", input);
        }
        return -1L;
    }

    private static Integer parserInt(String input) {
        try {
            return Integer.parseInt(input);
        } catch (NumberFormatException e) {
            log.warn("Invalid Integer format: {}", input);
        }
        return -1;
    }

    private static String checkString(String input) {
        return (input != null && !input.equals(EMPTY_STRING)) ? input : null;
    }

    private static Boolean checkBoolean(String input) {
        return "true".equalsIgnoreCase(input);
    }
}
