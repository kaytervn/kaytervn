package com.msa.constant;

public class AppConstant {
    public static final String TENANT_MODEL_PACKAGE = "com.msa.storage.tenant.model";
    public static final String TENANT_REPOSITORY_PACKAGE = "com.msa.storage.tenant.repository";
    public static final String MASTER_MODEL_PACKAGE = "com.msa.storage.master.model";
    public static final String MASTER_REPOSITORY_PACKAGE = "com.msa.storage.master.repository";

    public static final String ID_GENERATOR_STRATEGY = "com.msa.service.id.IdGenerator";
    public static final String ID_GENERATOR_NAME = "idGenerator";
    public static final String THREAD_POOL_EXECUTOR = "threadPoolExecutor";
    public static final String USER_SERVICE = "userService";

    public static final Integer MAX_TIME_FORGET_PWD = 60 * 1000; // 60s
    public static final Integer MAX_TIME_ACTIVE_ACCOUNT = 3 * 24 * 60 * 60; // 3 days
    public static final String DATE_FORMAT = "dd/MM/yyyy";
    public static final String DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm:ss";
    public static final String USERNAME_PATTERN = "^[a-z0-9](?:[a-z0-9._-]{2,28}[a-z0-9])?$";
    public static final String EMAIL_PATTERN = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$";

    public static final String CMD_LOCK_DEVICE = "CMD_LOCK_DEVICE";
    public static final String CMD_CLIENT_PING = "CMD_CLIENT_PING";

    public static final String TEMPLATE_RESET_PASSWORD = "mail-sender-test.html";
    public static final String TEMPLATE_ACTIVE_ACCOUNT = "account-activation.html";

    public static final Integer STATUS_ACTIVE = 1;
    public static final Integer STATUS_PENDING = 0;
    public static final Integer STATUS_LOCK = -1;
    public static final Integer STATUS_DELETE = -2;

    public static final Integer BOOLEAN_TRUE = 1;
    public static final Integer BOOLEAN_FALSE = 0;

    public static final Integer ACCOUNT_KIND_ROOT = 1;
    public static final Integer ACCOUNT_KIND_LINK = 2;

    public static final int ACCOUNT_SORT_CREATED_DATE_DESC = 1;
    public static final int ACCOUNT_SORT_CHILDREN_DESC = 2;
    public static final int ACCOUNT_SORT_BACKUP_CODES_DESC = 3;

    public static final int PLATFORM_SORT_CREATED_DATE_DESC = 1;
    public static final int PLATFORM_SORT_ACCOUNTS_DESC = 2;

    private AppConstant() {
        throw new IllegalStateException("Utility class");
    }
}
