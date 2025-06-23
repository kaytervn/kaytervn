package com.master.dto;

public class ErrorCode {
    /**
     * Starting error code General
     */
    public static final String GENERAL_ERROR_INVALID_USERNAME_OR_PASSWORD = "ERROR-GENERAL-0000";
    public static final String GENERAL_ERROR_INVALID_TOKEN = "ERROR-GENERAL-0001";
    public static final String GENERAL_ERROR_INTERNAL_SERVER = "ERROR-GENERAL-0002";
    public static final String GENERAL_ERROR_INVALID_LOGIN_BY_EMPLOYEE = "ERROR-GENERAL-0003";
    public static final String GENERAL_ERROR_TOTP_REQUIRED = "ERROR-GENERAL-0004";
    public static final String GENERAL_ERROR_ACCOUNT_NOT_SET_UP_2FA = "ERROR-GENERAL-0005";
    public static final String GENERAL_ERROR_VERIFY_TOTP_FAILED = "ERROR-GENERAL-0006";
    public static final String GENERAL_ERROR_LOCATION_DOES_NOT_HAVE_DB_CONFIG = "ERROR-GENERAL-0007";
    public static final String GENERAL_ERROR_INVALID_SESSION = "ERROR-INVALID-SESSION";
    public static final String GENERAL_ERROR_INVALID_API_KEY = "ERROR-INVALID-API-KEY";

    /**
     * Starting error code Account
     */
    public static final String ACCOUNT_ERROR_NOT_FOUND = "ERROR-ACCOUNT-0000";
    public static final String ACCOUNT_ERROR_USERNAME_EXISTED = "ERROR-ACCOUNT-0001";
    public static final String ACCOUNT_ERROR_EMAIL_EXISTED = "ERROR-ACCOUNT-0002";
    public static final String ACCOUNT_ERROR_WRONG_PASSWORD = "ERROR-ACCOUNT-0003";
    public static final String ACCOUNT_ERROR_NOT_ALLOW_DELETE_SUPPER_ADMIN = "ERROR-ACCOUNT-0004";
    public static final String ACCOUNT_ERROR_EXCEEDED_NUMBER_OF_INPUT_ATTEMPT_OTP = "ERROR-ACCOUNT-0005";
    public static final String ACCOUNT_ERROR_OTP_INVALID = "ERROR-ACCOUNT-0006";
    public static final String ACCOUNT_ERROR_LOGIN_FAILED = "ERROR-ACCOUNT-0007";
    public static final String ACCOUNT_ERROR_PRIVATE_KEY_INVALID = "ERROR-PRIVATE-KEY-INVALID";
    public static final String ACCOUNT_ERROR_PASSWORD_INVALID = "ERROR-ACCOUNT-0008";
    public static final String ACCOUNT_ERROR_NEW_PASSWORD_INVALID = "ERROR-ACCOUNT-0009";
    public static final String ACCOUNT_ERROR_BIRTHDATE_INVALID = "ERROR-ACCOUNT-0010";
    public static final String ACCOUNT_ERROR_PHONE_EXISTED = "ERROR-ACCOUNT-0011";
    public static final String ACCOUNT_ERROR_NOT_ALLOW_DELETE_YOURSELF = "ERROR-ACCOUNT-0012";
    public static final String ACCOUNT_ERROR_NOT_ALLOW_REQUEST_KEY = "ERROR-ACCOUNT-0013";
    public static final String ACCOUNT_ERROR_KIND_NOT_MATCH = "ERROR-ACCOUNT-0014";
    public static final String ACCOUNT_ERROR_NOT_ALLOW_DISABLE_2FA = "ERROR-ACCOUNT-0015";
    public static final String ACCOUNT_ERROR_WRONG_CREDENTIAL = "ERROR-ACCOUNT-0016";
    public static final String ACCOUNT_ERROR_NEW_PASSWORD_SAME_OLD_PASSWORD = "ERROR-ACCOUNT-0017";
    public static final String ACCOUNT_ERROR_NOT_ACTIVE = "ERROR-ACCOUNT-0018";

    /**
     * Starting error code Group
     */
    public static final String GROUP_ERROR_NOT_FOUND = "ERROR-GROUP-0000";
    public static final String GROUP_ERROR_NAME_EXISTED = "ERROR-GROUP-0001";
    public static final String GROUP_ERROR_NOT_ALLOW_UPDATE = "ERROR-GROUP-0002";
    public static final String GROUP_ERROR_NOT_ALLOW_DELETE = "ERROR-GROUP-0003";
    public static final String GROUP_ERROR_NOT_ALLOW_DELETE_SYSTEM_ROLE = "ERROR-GROUP-0004";

    /**
     * Starting error code Permission
     */
    public static final String PERMISSION_ERROR_NAME_EXISTED = "ERROR-PERMISSION-0000";
    public static final String PERMISSION_ERROR_PERMISSION_CODE_EXISTED = "ERROR-PERMISSION-0001";

    /**
     * Starting error code Server Provider
     */
    public static final String SERVER_PROVIDER_ERROR_NOT_FOUND = "ERROR-SERVER-PROVIDER-0000";
    public static final String SERVER_PROVIDER_ERROR_URL_EXISTED = "ERROR-SERVER-PROVIDER-0001";
    public static final String SERVER_PROVIDER_ERROR_NOT_ALLOW_DELETE = "ERROR-SERVER-PROVIDER-0002";
    public static final String SERVER_PROVIDER_ERROR_NOT_ALLOW_UPDATE = "ERROR-SERVER-PROVIDER-0003";

    /**
     * Starting error code Db Config
     */
    public static final String DB_CONFIG_ERROR_NOT_FOUND = "ERROR-DB-CONFIG-0000";
    public static final String DB_CONFIG_ERROR_LOCATION_EXISTED = "ERROR-DB-CONFIG-0001";
    public static final String DB_CONFIG_ERROR_USERNAME_EXISTED = "ERROR-DB-CONFIG-0002";
    public static final String DB_CONFIG_ERROR_URL_EXISTED = "ERROR-DB-CONFIG-0003";
    public static final String DB_CONFIG_ERROR_CREATE_DATABASE = "ERROR-DB-CONFIG-0004";
    public static final String DB_CONFIG_ERROR_DELETE_DATABASE = "ERROR-DB-CONFIG-0005";
    public static final String DB_CONFIG_ERROR_REACHED_LIMIT = "ERROR-DB-CONFIG-0006";

    /**
     * Starting error code Customer
     */
    public static final String CUSTOMER_ERROR_NOT_FOUND = "ERROR-CUSTOMER-0000";
    public static final String CUSTOMER_ERROR_NOT_ALLOW_DELETE = "ERROR-CUSTOMER-0001";
    public static final String CUSTOMER_ERROR_NOT_ACTIVE = "ERROR-CUSTOMER-0002";

    /**
     * Starting error code Location
     */
    public static final String LOCATION_ERROR_NOT_FOUND = "ERROR-LOCATION-0000";
    public static final String LOCATION_ERROR_TENANT_ID_EXISTED = "ERROR-LOCATION-0001";
    public static final String LOCATION_ERROR_NAME_EXISTED = "ERROR-LOCATION-0002";
    public static final String LOCATION_ERROR_NOT_ACTIVE = "ERROR-LOCATION-0003";
    public static final String LOCATION_ERROR_EXPIRED = "ERROR-LOCATION-0004";

    /**
     * Starting error code Branch
     */
    public static final String BRANCH_ERROR_NOT_FOUND = "ERROR-BRANCH-0000";
    public static final String BRANCH_ERROR_CUSTOMER_EXISTED = "ERROR-BRANCH-0001";
    public static final String BRANCH_ERROR_ACCOUNT_EXISTED = "ERROR-BRANCH-0002";

    /**
     * Starting error code Tag
     */
    public static final String TAG_ERROR_NOT_FOUND = "ERROR-TAG-0000";
    public static final String TAG_ERROR_COLOR_EXISTED = "ERROR-TAG-0001";

    /**
     * Starting error code Account Branch
     */
    public static final String ACCOUNT_BRANCH_ERROR_NOT_FOUND = "ERROR-ACCOUNT-BRANCH-0000";
    public static final String ACCOUNT_BRANCH_ERROR_EXISTED = "ERROR-ACCOUNT-BRANCH-0001";
}
