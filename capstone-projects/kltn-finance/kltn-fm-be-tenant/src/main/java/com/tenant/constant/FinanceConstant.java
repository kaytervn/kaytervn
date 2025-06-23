package com.tenant.constant;

public class FinanceConstant {
    public static final String BACKEND_APP = "BACKEND_APP";
    public static final String APP_MASTER = "MASTER";
    public static final String APP_TENANT = "TENANT";
    public static final String DATE_FORMAT = "dd/MM/yyyy";
    public static final String DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm:ss";

    public static final String CHAT_ROOM_SETTING_SAMPLE_DATA = "{\"member_permissions\":{\"allow_send_messages\":true,\"allow_update_chat_room\":true,\"allow_invite_members\":true}}";
    public static final String CHAT_ROOM_SETTING_ALLOW_UPDATE = "allow_update_chat_room";
    public static final String CHAT_ROOM_SETTING_ALLOW_SEND_MESSAGES = "allow_send_messages";
    public static final String CHAT_ROOM_SETTING_ALLOW_INVITE_MEMBERS = "allow_invite_members";

    public static final String CMD_DELETE_NOTIFICATION = "CMD_DELETE_NOTIFICATION";
    public static final String CMD_CREATE_PAYMENT_PERIOD = "CMD_CREATE_PAYMENT_PERIOD";
    public static final String CMD_SCHEDULE_SERVICE = "CMD_SCHEDULE_SERVICE";
    public static final String CMD_LOCK_DEVICE = "CMD_LOCK_DEVICE";
    public static final String CMD_LOGIN_QR_CODE = "CMD_LOGIN_QR_CODE";

    // CHAT SERVICE CMD
    public static final String CMD_CHAT_ROOM_CREATED = "CMD_CHAT_ROOM_CREATED";
    public static final String CMD_CHAT_ROOM_UPDATED = "CMD_CHAT_ROOM_UPDATED";
    public static final String CMD_CHAT_ROOM_DELETED = "CMD_CHAT_ROOM_DELETED";
    public static final String CMD_NEW_MESSAGE = "CMD_NEW_MESSAGE";
    public static final String CMD_MESSAGE_UPDATED = "CMD_MESSAGE_UPDATED";
    
    public static final String NAME_PATTERN = "^[\\p{L} ]+$";
    public static final String USERNAME_PATTERN = "^[a-z0-9_]+$";
    public static final String PASSWORD_PATTERN = "^[a-zA-Z0-9!@#$%^&*()_+-=]+$";
    public static final String PHONE_PATTERN = "^0[35789][0-9]{8}$";
    public static final String EMAIL_PATTERN = "^(?!.*[.]{2,})[a-zA-Z0-9.%]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    public static final String HEX_COLOR_PATTERN = "^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$";

    public static final Integer USER_KIND_ADMIN = 1;
    public static final Integer USER_KIND_MANAGER = 2;

    public static final Integer STATUS_ACTIVE = 1;
    public static final Integer STATUS_PENDING = 0;
    public static final Integer STATUS_LOCK = -1;
    public static final Integer STATUS_DELETE = -2;

    public static final Integer GROUP_KIND_ADMIN = 1;
    public static final Integer GROUP_KIND_MANAGER = 2;

    public static final Integer MAX_ATTEMPT_FORGET_PWD = 5;
    public static final int MAX_TIME_FORGET_PWD = 5 * 60 * 1000;
    public static final Integer MAX_ATTEMPT_LOGIN = 5;

    public static final Boolean AES_ZIP_ENABLE = false;

    public static final Integer CATEGORY_KIND_INCOME = 1;
    public static final Integer CATEGORY_KIND_EXPENDITURE = 2;

    public static final Integer TRANSACTION_KIND_INCOME = 1;
    public static final Integer TRANSACTION_KIND_EXPENDITURE = 2;

    public static final Integer TRANSACTION_STATE_CREATED = 1;
    public static final Integer TRANSACTION_STATE_APPROVE = 2;
    public static final Integer TRANSACTION_STATE_REJECT = 3;
    public static final Integer TRANSACTION_STATE_PAID = 4;

    public static final Integer SORT_DATE_ASC = 1;
    public static final Integer SORT_DATE_DESC = 2;
    public static final Integer SORT_TRANSACTION_DATE_ASC = 3;
    public static final Integer SORT_TRANSACTION_DATE_DESC = 4;
    public static final Integer SORT_DUE_DAYS_ASC = 3;
    public static final Integer SORT_DUE_DAYS_DESC = 4;

    public static final Integer SERVICE_PERIOD_KIND_FIX_DAY = 1;
    public static final Integer SERVICE_PERIOD_KIND_MONTH = 2;
    public static final Integer SERVICE_PERIOD_KIND_YEAR = 3;

    public static final Integer NOTIFICATION_STATE_SENT = 0;
    public static final Integer NOTIFICATION_STATE_READ = 1;

    public static final Integer KEY_INFORMATION_KIND_SERVER = 1;
    public static final Integer KEY_INFORMATION_KIND_WEB = 2;

    public static final String PRIVATE_KEY = "private_key";
    public static final String FINANCE_SECRET_KEY = "finance_secret_key";
    public static final String KEY_INFORMATION_SECRET_KEY = "key_information_secret_key";
    public static final String DECRYPT_PASSWORD_SECRET_KEY = "decrypt_password_secret_key";

    public static final String DEFAULT_TENANT_ID = "tenant_id_default";
    public static final String TENANT_MODEL_PACKAGE = "com.tenant.storage.tenant.model";
    public static final String TENANT_REPOSITORY_PACKAGE = "com.tenant.storage.tenant.repository";
    public static final String MASTER_MODEL_PACKAGE = "com.tenant.storage.master.model";
    public static final String MASTER_REPOSITORY_PACKAGE = "com.tenant.storage.master.repository";

    public static final Integer SERVICE_KIND_INCOME = 1;
    public static final Integer SERVICE_KIND_EXPENDITURE = 2;

    public static final Integer PAYMENT_PERIOD_STATE_CREATED = 1;
    public static final Integer PAYMENT_PERIOD_STATE_APPROVE = 2;

    public static final Integer TASK_STATE_PENDING = 1;
    public static final Integer TASK_STATE_DONE = 2;

    public static final Integer PERMISSION_KIND_ITEM = 1;
    public static final Integer PERMISSION_KIND_GROUP = 2;

    public static final Integer IS_PAGED_TRUE = 1;
    public static final Integer IS_PAGED_FALSE = 0;

    public static final Integer IGNORE_ENTITY_RELATIONSHIP_TRUE = 1;
    public static final Integer IGNORE_ENTITY_RELATIONSHIP_FALSE = 0;

    public static final Integer BOOLEAN_TRUE = 1;
    public static final Integer BOOLEAN_FALSE = 0;

    public static final Integer TAG_KIND_TRANSACTION = 1;
    public static final Integer TAG_KIND_SERVICE = 2;
    public static final Integer TAG_KIND_KEY_INFORMATION = 3;
    public static final Integer TAG_KIND_PROJECT = 4;

    public static final Integer CHATROOM_KIND_GROUP = 1;
    public static final Integer CHATROOM_KIND_DIRECT_MESSAGE = 2;

    public static final Integer MESSAGE_REACTION_KIND_LIKE = 1;
    public static final Integer MESSAGE_REACTION_KIND_HEART = 2;
    public static final Integer MESSAGE_REACTION_KIND_CRY = 3;
    public static final Integer MESSAGE_REACTION_KIND_JOY = 4;
    public static final Integer MESSAGE_REACTION_KIND_LAUGH = 5;

    public static final Integer CHAT_HISTORY_ROLE_USER = 1;
    public static final Integer CHAT_HISTORY_ROLE_MODEL = 2;

    private FinanceConstant() {
        throw new IllegalStateException("Utility class");
    }
}
