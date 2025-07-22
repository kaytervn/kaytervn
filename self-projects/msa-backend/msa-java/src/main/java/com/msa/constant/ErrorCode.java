package com.msa.constant;

public class ErrorCode {
    /**
     * Starting error code General
     */
    public static final String GENERAL_ERROR_INVALID_USERNAME_OR_PASSWORD = "ERROR-GENERAL-0000";
    public static final String GENERAL_ERROR_TOTP_REQUIRED = "ERROR-GENERAL-0001";
    public static final String GENERAL_ERROR_ACCOUNT_NOT_SET_UP_2FA = "ERROR-GENERAL-0002";
    public static final String GENERAL_ERROR_VERIFY_TOTP_FAILED = "ERROR-GENERAL-0003";
    public static final String GENERAL_ERROR_CREATE_DATABASE = "ERROR-GENERAL-0004";
    public static final String GENERAL_ERROR_DELETE_DATABASE = "ERROR-GENERAL-0005";
    public static final String GENERAL_ERROR_INVALID_SESSION = "ERROR-INVALID-SESSION";
    public static final String GENERAL_ERROR_INVALID_DOMAIN = "ERROR-INVALID-DOMAIN";
    public static final String GENERAL_ERROR_INVALID_SIGNATURE = "ERROR-INVALID-SIGNATURE";

    /**
     * Starting error code Permission
     */
    public static final String PERMISSION_ERROR_PERMISSION_CODE_EXISTED = "ERROR-PERMISSION-0000";
    public static final String PERMISSION_ERROR_NAME_EXISTED = "ERROR-PERMISSION-0001";

    /**
     * Starting error code Group
     */
    public static final String GROUP_ERROR_NOT_FOUND = "ERROR-GROUP-0000";
    public static final String GROUP_ERROR_NAME_EXISTED = "ERROR-GROUP-0001";
    public static final String GROUP_ERROR_NOT_ALLOW_DELETE = "ERROR-GROUP-0002";

    /**
     * Starting error code User
     */
    public static final String USER_ERROR_NOT_FOUND = "ERROR-USER-0000";
    public static final String USER_ERROR_NOT_ACTIVE = "ERROR-USER-0001";
    public static final String USER_ERROR_INVALID_OTP = "ERROR-USER-0002";
    public static final String USER_ERROR_WRONG_PASSWORD = "ERROR-USER-0003";
    public static final String USER_ERROR_USERNAME_EXISTED = "ERROR-USER-0004";
    public static final String USER_ERROR_EMAIL_EXISTED = "ERROR-USER-0005";
    public static final String USER_ERROR_DB_CONFIG_EXISTED = "ERROR-USER-0006";

    /**
     * Starting error code Platform
     */
    public static final String PLATFORM_ERROR_NOT_FOUND = "ERROR-PLATFORM-0000";
    public static final String PLATFORM_ERROR_NAME_EXISTED = "ERROR-PLATFORM-0001";
    public static final String PLATFORM_ERROR_ACCOUNT_EXISTED = "ERROR-PLATFORM-0002";

    /**
     * Starting error code Account
     */
    public static final String ACCOUNT_ERROR_NOT_FOUND = "ERROR-ACCOUNT-0000";
    public static final String ACCOUNT_ERROR_CHILDREN_EXISTED = "ERROR-ACCOUNT-0001";
    public static final String ACCOUNT_ERROR_RECORD_EXISTED = "ERROR-ACCOUNT-0002";

    /**
     * Starting error code Backup Code
     */
    public static final String BACKUP_CODE_ERROR_NOT_FOUND = "ERROR-BACKUP-CODE-0000";
    public static final String BACKUP_CODE_ERROR_CODE_EXISTED = "ERROR-BACKUP-CODE-0001";
}
