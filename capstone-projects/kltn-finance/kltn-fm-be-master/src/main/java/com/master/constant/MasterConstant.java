package com.master.constant;

public class MasterConstant {
    public static final String BACKEND_APP = "BACKEND_APP";
    public static final String APP_MASTER = "MASTER";
    public static final String APP_TENANT = "TENANT";
    public static final String DATE_FORMAT = "dd/MM/yyyy";
    public static final String DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm:ss";

    public static final String NAME_PATTERN = "^[\\p{L} ]+$";
    public static final String SCHEMA_PATTERN = "^[a-z0-9_]+$";
    public static final String USERNAME_PATTERN = "^[a-z0-9_]+$";
    public static final String PASSWORD_PATTERN = "^[a-zA-Z0-9!@#$%^&*()_+-=]+$";
    public static final String PHONE_PATTERN = "^0[35789][0-9]{8}$";
    public static final String EMAIL_PATTERN = "^(?!.*[.]{2,})[a-zA-Z0-9.%]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    public static final String HOST_PATTERN = "^(localhost|(([a-z0-9\\-]+\\.)*[a-z]{2,})|(\\d{1,3}\\.){3}\\d{1,3}|\\[([0-9a-f:]+)\\])$";
    public static final String PORT_PATTERN = "^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$";

    public static final String QR_CODE_PASSWORD = "ZHVjdHJvbmc=";

    public static final Integer USER_KIND_ADMIN = 1;
    public static final Integer USER_KIND_CUSTOMER = 2;
    public static final Integer USER_KIND_EMPLOYEE = 3;

    public static final Integer STATUS_ACTIVE = 1;
    public static final Integer STATUS_PENDING = 0;
    public static final Integer STATUS_LOCK = -1;
    public static final Integer STATUS_DELETE = -2;

    public static final Integer MAX_ATTEMPT_FORGET_PWD = 5;
    public static final int MAX_TIME_FORGET_PWD = 5 * 60 * 1000;
    public static final Integer MAX_ATTEMPT_LOGIN = 5;

    public static final Boolean AES_ZIP_ENABLE = false;
    public static final String MASTER_PRIVATE_KEY = "master_private_key";

    public static final Integer SORT_DATE_ASC = 1;
    public static final Integer SORT_DATE_DESC = 2;

    public static final Integer BOOLEAN_TRUE = 1;
    public static final Integer BOOLEAN_FALSE = 0;

    public static final String CMD_LOCK_DEVICE = "CMD_LOCK_DEVICE";
    public static final String CMD_DELETE_NOTIFICATION = "CMD_DELETE_NOTIFICATION";
    public static final String CMD_CREATE_PAYMENT_PERIOD = "CMD_CREATE_PAYMENT_PERIOD";
    public static final String CMD_SCHEDULE_SERVICE = "CMD_SCHEDULE_SERVICE";

    private MasterConstant() {
        throw new IllegalStateException("Utility class");
    }
}
