package com.tenant.dto;

public class ErrorCode {
    /**
     * Starting error code Account
     */
    public static final String GENERAL_ERROR_NOT_ALLOWED_DELETE = "ERROR-NOT-ALLOWED-DELETE";
    public static final String GENERAL_ERROR_SYSTEM_NOT_READY = "ERROR-SYSTEM-NOT-READY";
    public static final String GENERAL_ERROR_INVALID_SESSION = "ERROR-INVALID-SESSION";
    public static final String GENERAL_ERROR_INVALID_API_KEY = "ERROR-INVALID-API-KEY";
    public static final String GENERAL_ERROR_QR_CODE_EXPIRED = "GENERAL_ERROR_QR_CODE_EXPIRED";
    public static final String GENERAL_ERROR_INVALID_GRANT_TYPE = "GENERAL_ERROR_INVALID_GRANT_TYPE";
    public static final String GENERAL_ERROR_INVALID_FACE_ID = "GENERAL_ERROR_INVALID_FACE_ID";

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
    public static final String ACCOUNT_ERROR_NOT_ACTIVE = "ERROR-ACCOUNT-0014";

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
     * Starting error code Category
     */
    public static final String CATEGORY_ERROR_NOT_FOUND = "ERROR-CATEGORY-0000";
    public static final String CATEGORY_ERROR_NAME_EXISTED = "ERROR-CATEGORY-0001";

    /**
     * Starting error code Department
     */
    public static final String DEPARTMENT_ERROR_NOT_FOUND = "ERROR-DEPARTMENT-0000";
    public static final String DEPARTMENT_ERROR_NAME_EXISTED = "ERROR-DEPARTMENT-0001";

    /**
     * Starting error code Transaction
     */
    public static final String TRANSACTION_ERROR_NOT_FOUND = "ERROR-TRANSACTION-0000";
    public static final String TRANSACTION_ERROR_KIND_INVALID = "ERROR-TRANSACTION-0001";
    public static final String TRANSACTION_ERROR_NOT_ALLOW_UPDATE = "ERROR-TRANSACTION-0002";
    public static final String TRANSACTION_ERROR_NOT_ALLOW_DELETE = "ERROR-TRANSACTION-0003";
    public static final String TRANSACTION_ERROR_DOCUMENT_INVALID = "ERROR-TRANSACTION-0004";
    public static final String TRANSACTION_ERROR_NOT_ALLOW_CREATE = "ERROR-TRANSACTION-0005";
    public static final String TRANSACTION_ERROR_TAG_INVALID = "ERROR-TRANSACTION-0006";

    /**
     * Starting error code Service
     */
    public static final String SERVICE_ERROR_NOT_FOUND = "ERROR-SERVICE-0000";
    public static final String SERVICE_ERROR_NAME_EXISTED = "ERROR-SERVICE-0001";
    public static final String SERVICE_ERROR_KIND_INVALID = "ERROR-SERVICE-0002";
    public static final String SERVICE_ERROR_DATE_INVALID = "ERROR-SERVICE-0003";
    public static final String SERVICE_ERROR_ALREADY_PAID = "ERROR-SERVICE-0004";
    public static final String SERVICE_ERROR_TAG_INVALID = "ERROR-SERVICE-0005";

    /**
     * Starting error code Service Schedule
     */
    public static final String SERVICE_SCHEDULE_ERROR_NOT_FOUND = "ERROR-SERVICE-SCHEDULE-0000";
    public static final String SERVICE_SCHEDULE_ERROR_NUMBER_OF_DUE_DAYS_EXISTED = "ERROR-SERVICE-SCHEDULE-0001";

    /**
     * Starting error code Notification Group
     */
    public static final String NOTIFICATION_GROUP_ERROR_NOT_FOUND = "ERROR-NOTIFICATION-GROUP-0000";
    public static final String NOTIFICATION_GROUP_ERROR_NAME_EXISTED = "ERROR-NOTIFICATION-GROUP-0001";

    /**
     * Starting error code User Group Notification
     */
    public static final String USER_GROUP_NOTIFICATION_ERROR_NOT_FOUND = "ERROR-USER-GROUP-NOTIFICATION-0000";
    public static final String USER_GROUP_NOTIFICATION_ERROR_ACCOUNT_AND_NOTIFICATION_GROUP_EXISTED = "ERROR-USER-GROUP-NOTIFICATION-0001";

    /**
     * Starting error code Notification
     */
    public static final String NOTIFICATION_ERROR_NOT_FOUND = "ERROR-NOTIFICATION-0000";
    public static final String NOTIFICATION_ERROR_ALREADY_READ = "ERROR-NOTIFICATION-0001";

    /**
     * Starting error code Transaction History
     */
    public static final String TRANSACTION_HISTORY_ERROR_NOT_FOUND = "ERROR-TRANSACTION-HISTORY-0000";

    /**
     * Starting error code Key Information
     */
    public static final String KEY_INFORMATION_ERROR_NOT_FOUND = "ERROR-KEY-INFORMATION-0000";
    public static final String KEY_INFORMATION_ERROR_DOCUMENT_INVALID = "ERROR-KEY-INFORMATION-0002";
    public static final String KEY_INFORMATION_ERROR_TAG_INVALID = "ERROR-TAG-0003";

    /**
     * Starting error code Key Information Group
     */
    public static final String KEY_INFORMATION_GROUP_ERROR_NOT_FOUND = "ERROR-KEY-INFORMATION-GROUP-0000";
    public static final String KEY_INFORMATION_GROUP_ERROR_NAME_EXISTED = "ERROR-KEY-INFORMATION-GROUP-0001";

    /**
     * Starting error code Transaction Group
     */
    public static final String TRANSACTION_GROUP_ERROR_NOT_FOUND = "ERROR-TRANSACTION-GROUP-0000";
    public static final String TRANSACTION_GROUP_ERROR_NAME_EXISTED = "ERROR-TRANSACTION-GROUP-0001";

    /**
     * Starting error code Service Group
     */
    public static final String SERVICE_GROUP_ERROR_NOT_FOUND = "ERROR-SERVICE-GROUP-0000";
    public static final String SERVICE_GROUP_ERROR_NAME_EXISTED = "ERROR-SERVICE-GROUP-0001";

    /**
     * Starting error code Payment Period
     */
    public static final String PAYMENT_PERIOD_ERROR_NOT_FOUND = "ERROR-PAYMENT-PERIOD-0000";
    public static final String PAYMENT_PERIOD_ERROR_DATE_INVALID = "ERROR-PAYMENT-PERIOD-0001";
    public static final String PAYMENT_PERIOD_ERROR_NOT_ALLOW_UPDATE = "ERROR-PAYMENT-PERIOD-0002";
    public static final String PAYMENT_PERIOD_ERROR_NOT_ALLOW_RECALCULATE = "ERROR-PAYMENT-PERIOD-0003";

    /**
     * Starting error code Setting
     */
    public static final String SETTING_ERROR_NOT_FOUND = "ERROR-SETTING-0000";
    public static final String SETTING_ERROR_EXISTED_GROUP_NAME_AND_KEY_NAME = "ERROR-SETTING-0001";

    /**
     * Starting error code Service Notification Group
     */
    public static final String SERVICE_NOTIFICATION_GROUP_ERROR_NOT_FOUND = "ERROR-SERVICE-NOTIFICATION-GROUP-0000";
    public static final String SERVICE_NOTIFICATION_GROUP_ERROR_SERVICE_AND_NOTIFICATION_GROUP_EXISTED = "ERROR-SERVICE-NOTIFICATION-GROUP-0001";

    /**
     * Starting error code Organization
     */
    public static final String ORGANIZATION_ERROR_NOT_FOUND = "ERROR-ORGANIZATION-0000";
    public static final String ORGANIZATION_ERROR_NAME_EXISTED = "ERROR-ORGANIZATION-0001";

    /**
     * Starting error code Project
     */
    public static final String PROJECT_ERROR_NOT_FOUND = "ERROR-PROJECT-0000";
    public static final String PROJECT_ERROR_NAME_EXISTED = "ERROR-PROJECT-0001";
    public static final String PROJECT_ERROR_TAG_INVALID = "ERROR-PROJECT-0002";

    /**
     * Starting error code Task
     */
    public static final String TASK_ERROR_NOT_FOUND = "ERROR-TASK-0000";
    public static final String TASK_ERROR_NOT_ALLOW_CHANGE_STATE = "ERROR-TASK-0001";
    public static final String TASK_ERROR_DOCUMENT_INVALID = "ERROR-TASK-0002";
    public static final String TASK_ERROR_NOT_ALLOW_ADD_PARENT = "ERROR-TASK-0003";

    /**
     * Starting error code Transaction Permission
     */
    public static final String TRANSACTION_PERMISSION_ERROR_NOT_FOUND = "ERROR-TRANSACTION-PERMISSION-0000";
    public static final String TRANSACTION_PERMISSION_ERROR_ACCOUNT_AND_TRANSACTION_EXISTED = "ERROR-TRANSACTION-PERMISSION-0001";
    public static final String TRANSACTION_PERMISSION_ERROR_ACCOUNT_AND_TRANSACTION_GROUP_EXISTED = "ERROR-TRANSACTION-PERMISSION-0002";

    /**
     * Starting error code Key Information Permission
     */
    public static final String KEY_INFORMATION_PERMISSION_ERROR_NOT_FOUND = "ERROR-KEY-INFORMATION-PERMISSION-0000";
    public static final String KEY_INFORMATION_PERMISSION_ERROR_ACCOUNT_AND_KEY_INFORMATION_EXISTED = "ERROR-KEY-INFORMATION-PERMISSION-0001";
    public static final String KEY_INFORMATION_PERMISSION_ERROR_ACCOUNT_AND_KEY_INFORMATION_GROUP_EXISTED = "ERROR-KEY-INFORMATION-PERMISSION-0002";

    /**
     * Starting error code Task Permission
     */
    public static final String TASK_PERMISSION_ERROR_NOT_FOUND = "ERROR-TASK-PERMISSION-0000";
    public static final String TASK_PERMISSION_ERROR_ACCOUNT_AND_TASK_EXISTED = "ERROR-TASK-PERMISSION-0001";
    public static final String TASK_PERMISSION_ERROR_ACCOUNT_AND_PROJECT_EXISTED = "ERROR-TASK-PERMISSION-0002";

    /**
     * Starting error code Organization Permission
     */
    public static final String ORGANIZATION_PERMISSION_ERROR_NOT_FOUND = "ERROR-ORGANIZATION-PERMISSION-0000";
    public static final String ORGANIZATION_PERMISSION_ERROR_ACCOUNT_AND_ORGANIZATION_EXISTED = "ERROR-ORGANIZATION-PERMISSION-0001";

    /**
     * Starting error code Debit
     */
    public static final String DEBIT_ERROR_NOT_FOUND = "ERROR-DEBIT-0000";
    public static final String DEBIT_ERROR_NOT_ALLOW_DELETE = "ERROR-DEBIT-0001";
    public static final String DEBIT_ERROR_NOT_ALLOW_UPDATE = "ERROR-DEBIT-0002";
    public static final String DEBIT_ERROR_KIND_INVALID = "ERROR-DEBIT-0003";
    public static final String DEBIT_ERROR_DOCUMENT_INVALID = "ERROR-DEBIT-0004";
    public static final String DEBIT_ERROR_TAG_INVALID = "ERROR-DEBIT-0005";

    /**
     * Starting error code Service Permission
     */
    public static final String SERVICE_PERMISSION_ERROR_NOT_FOUND = "ERROR-SERVICE-PERMISSION-0000";
    public static final String SERVICE_PERMISSION_ERROR_ACCOUNT_AND_SERVICE_EXISTED = "ERROR-SERVICE-PERMISSION-0001";
    public static final String SERVICE_PERMISSION_ERROR_ACCOUNT_AND_SERVICE_GROUP_EXISTED = "ERROR-SERVICE-PERMISSION-0002";

    /**
     * Starting error code Tag
     */
    public static final String TAG_ERROR_NOT_FOUND = "ERROR-TAG-0000";
    public static final String TAG_ERROR_NAME_EXISTED = "ERROR-TAG-0001";

    /**
     * Starting error code Chatroom
     */
    public static final String CHAT_ROOM_ERROR_NOT_FOUND = "ERROR-CHAT-ROOM-0000";
    public static final String CHAT_ROOM_ERROR_NO_OWNER = "ERROR-CHAT-ROOM-0001";
    public static final String CHAT_ROOM_ERROR_DIRECT_MESSAGE_NOT_UPDATE = "ERROR-CHAT-ROOM-MEMBER-0002";
    public static final String CHAT_ROOM_ERROR_UNABLE_INVITE_NEW_MEMBERS = "ERROR-CHAT-ROOM-MEMBER-0004";
    public static final String CHAT_ROOM_ERROR_NOT_KIND_GROUP = "ERROR-CHAT-ROOM-0005";

    /**
     * Starting error code Chat Room Member
     */
    public static final String CHAT_ROOM_MEMBER_ERROR_NOT_FOUND = "ERROR-CHAT-ROOM-MEMBER-0000";
    public static final String CHAT_ROOM_MEMBER_ERROR_NO_JOIN = "ERROR-CHAT-ROOM-MEMBER-0001";
    public static final String CHAT_ROOM_MEMBER_ERROR_IS_NOT_OWNER_AND_NOT_ALLOW_UPDATE = "ERROR-CHAT-ROOM-MEMBER-0002";
    public static final String CHAT_ROOM_MEMBER_ERROR_KIND_GROUP_HAS_MORE_THAN_3 = "ERROR-CHAT-ROOM-MEMBER-0003";
    public static final String CHAT_ROOM_MEMBER_ERROR_NEW_CHAT_ROOM_MEMBERS_EMPTY = "ERROR-CHAT-ROOM-MEMBER-0004";
    public static final String CHAT_ROOM_MEMBER_IS_OWNER = "ERROR-CHAT-ROOM-MEMBER-0005";
    public static final String CHAT_ROOM_MEMBER_ERROR_EXISTED_IN_CHAT_ROOM = "ERROR-CHAT-ROOM-MEMBER-0006";
    public static final String CHAT_ROOM_MEMBER_ERROR_IS_NOT_SEND_MESSAGES = "ERROR-CHAT-ROOM-MEMBER-0007";

    /**
     * Starting error code Message
     */
    public static final String MESSAGE_ERROR_NOT_FOUND = "ERROR-MESSAGE-0000";
    public static final String MESSAGE_ERROR_NO_OWNER = "ERROR-MESSAGE-0001";
    public static final String MESSAGE_REACTION_ERROR_REACTED = "ERROR-MESSAGE-0002";
    public static final String MESSAGE_ERROR_DELETED = "ERROR-MESSAGE-0003";

    /**
     * Starting error code Chat History
     */
    public static final String CHAT_HISTORY_ERROR_NOT_FOUND = "ERROR-CHAT-HISTORY-0000";
}
