package com.msa.constant;

import java.util.List;

public class SecurityConstant {
    public static final String DEFAULT_TENANT_ID = "tenant_id_default";
    public static final String DB_USER_PREFIX = "msa_user_";
    public static final String DB_SCHEMA_PREFIX = "msa_tenant_";
    public static final String REQUEST_TOKEN_PATH = "/api/token";
    public static final String FEIGN_URL = "FEIGN_URL";

    public static final String HEADER_AUTHORIZATION = "authorization";
    public static final String HEADER_X_API_KEY = "x-api-key";
    public static final String HEADER_TIMESTAMP = "timestamp";
    public static final String HEADER_MESSAGE_SIGNATURE = "message-signature";
    public static final String HEADER_CLIENT_REQUEST_ID = "client-request-id";
    public static final String HEADER_X_FINGERPRINT = "x-fingerprint";
    public static final String HEADER_ORIGIN = "origin";
    public static final String HEADER_REFERER = "referer";

    public static final List<String> ALLOWED_METHODS = List.of("GET", "POST", "PUT", "DELETE", "OPTIONS");
    public static final List<String> ALLOWED_HEADERS = List.of("Accept", "Content-Type", "Depth", "User-Agent", "If-Modified-Since", "Cache-Control", "Content-Disposition",
            HEADER_AUTHORIZATION,
            HEADER_ORIGIN,
            HEADER_REFERER,
            HEADER_X_API_KEY,
            HEADER_TIMESTAMP,
            HEADER_MESSAGE_SIGNATURE,
            HEADER_CLIENT_REQUEST_ID,
            HEADER_X_FINGERPRINT
    );

    public static final Integer USER_KIND_ADMIN = 1;
    public static final Integer USER_KIND_USER = 2;

    public static final String GRANT_TYPE_PASSWORD = "password";
    public static final String GRANT_TYPE_USER = "user";

    public static final int RESPONSE_CODE_SUCCESS = 200;
    public static final int RESPONSE_CODE_ERROR = 400;
}