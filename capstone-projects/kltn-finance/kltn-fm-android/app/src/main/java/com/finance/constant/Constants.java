package com.finance.constant;

import com.finance.data.model.api.response.account.AccountResponse;

public class Constants {
    public static final String PREF_NAME = "mvvm.app.food.prefs";
    public static final String VALUE_BEARER_TOKEN_DEFAULT="NULL";
    public static final String VALUE_ACCOUNT_DEFAULT="NULL";
    public static final AccountResponse VALUE_ACCOUNT_RESPONSE_DEFAULT= new AccountResponse(-1L);

    //Local Action manager
    public static final String ACTION_EXPIRED_TOKEN ="ACTION_EXPIRED_TOKEN";

    public static final String PERMISSIONS = "KEY_PERMISSIONS";

    //default app
    public static final String APP = "CLIENT_APP";
    public static final String LANG = "vi";
    public static final int PLATFORM = 0;
    public static final String VERSION = "1.0";

    //Settings
    public static String MONEY_UNIT = "đ";
    public static Integer UNIT_RATE = 23000;
    public static String GROUP_SEPARATOR = ",";
    public static String DECIMAL_SEPARATOR = ".";
    public static String DATE_TIME_FORMAT ="dd.MM.yyyy HH:mm:ss";
    public static final String DATE_FORMAT_FROM_API = "dd/MM/yyyy HH:mm:ss";

    //Fragment
    public static final String ACCOUNT_FRAGMENT = "account fragment";
    public static final String KEY_FRAGMENT = "key fragment";
    public static final String STATISTIC_FRAGMENT = "statistic fragment";
    public static final String HOME_FRAGMENT = "home fragment";
    public static final String NOTIFICATION_FRAGMENT = "notification fragment";
    public static final String INPUT_KEY_DIALOG = "inputKeyDialogFragment";
    public static final String CONFIRM_DIALOG ="confirmDialogFragment";
    public static final String YES_NO_DIALOG_FRAGMENT ="yesNoDialogFragment";


    //Permission
    public static final String PERMISSION_CATEGORY_LIST = "CA_L";
    public static final String PERMISSION_CATEGORY_CREATE = "CA_C";
    public static final String PERMISSION_CATEGORY_DELETE = "CA_D";
    public static final String PERMISSION_CATEGORY_UPDATE = "CA_U";
    public static final String PERMISSION_CATEGORY_GET = "CA_V";

    public static final String PERMISSION_DEPARTMENT_LIST = "DE_L";
    public static final String PERMISSION_DEPARTMENT_CREATE = "DE_C";
    public static final String PERMISSION_DEPARTMENT_DELETE = "DE_D";
    public static final String PERMISSION_DEPARTMENT_UPDATE = "DE_U";
    public static final String PERMISSION_DEPARTMENT_GET = "DE_V";

    public static final String PERMISSION_KEY_INFO_GROUP_LIST = "KE_I_G_L";
    public static final String PERMISSION_KEY_INFO_GROUP_CREATE = "KE_I_G_C";
    public static final String PERMISSION_KEY_INFO_GROUP_DELETE = "KE_I_G_D";
    public static final String PERMISSION_KEY_INFO_GROUP_UPDATE = "KE_I_G_U";
    public static final String PERMISSION_KEY_INFO_GROUP_GET = "KE_I_G_V";

    public static final String PERMISSION_KEY_INFO_LIST = "KE_I_L";
    public static final String PERMISSION_KEY_INFO_CREATE = "KE_I_C";
    public static final String PERMISSION_KEY_INFO_DELETE = "KE_I_D";
    public static final String PERMISSION_KEY_INFO_UPDATE = "KE_I_U";
    public static final String PERMISSION_KEY_INFO_GET = "KE_I_V";

    public static final String PERMISSION_GROUP_TRANSACTION_LIST = "TR_G_L";
    public static final String PERMISSION_GROUP_TRANSACTION_CREATE = "TR_G_C";
    public static final String PERMISSION_GROUP_TRANSACTION_DELETE = "TR_G_D";
    public static final String PERMISSION_GROUP_TRANSACTION_UPDATE = "TR_G_U";
    public static final String PERMISSION_GROUP_TRANSACTION_GET = "TR_G_V";

    public static final String PERMISSION_TRANSACTION_LIST = "TR_L";
    public static final String PERMISSION_TRANSACTION_CREATE = "TR_C";
    public static final String PERMISSION_TRANSACTION_DELETE = "TR_D";
    public static final String PERMISSION_TRANSACTION_UPDATE = "TR_U";
    public static final String PERMISSION_TRANSACTION_GET = "TR_V";
    public static final String PERMISSION_TRANSACTION_REJECT = "TR_R";
    public static final String PERMISSION_TRANSACTION_APPROVE = "TR_A";
    public static final String PERMISSION_TRANSACTION_CREATE_FULL_AUTHENTICATION = "TR_C_FA";
    public static final String PERMISSION_TRANSACTION_UPDATE_FULL_AUTHENTICATION = "TR_U_FA";
    public static final String PERMISSION_ORGANIZATION_LIST = "OR_L";
    public static final String PERMISSION_ORGANIZATION_CREATE = "OR_C";
    public static final String PERMISSION_ORGANIZATION_DELETE = "OR_D";
    public static final String PERMISSION_ORGANIZATION_UPDATE = "OR_U";
    public static final String PERMISSION_ORGANIZATION_GET = "OR_V";

    //TASK
    public static final String PERMISSION_TASK_LIST = "TA_L";
    public static final String PERMISSION_TASK_CREATE = "TA_C";
    public static final String PERMISSION_TASK_DELETE = "TA_D";
    public static final String PERMISSION_TASK_UPDATE = "TA_U";
    public static final String PERMISSION_TASK_GET = "TA_V";
    public static final String PERMISSION_TASK_CHANGE_STATE = "TA_C_S";

    //PROJECT
    public static final String PERMISSION_PROJECT_LIST = "PR_L";
    public static final String PERMISSION_PROJECT_CREATE = "PR_C";
    public static final String PERMISSION_PROJECT_DELETE = "PR_D";
    public static final String PERMISSION_PROJECT_UPDATE = "PR_U";
    public static final String PERMISSION_PROJECT_GET = "PR_V";

    public static final String EXPIRE_TIME = "KEY_EXPIRE_TIME";

    public static final String PERMISSION_SERVICE_LIST = "SE_L";
    public static final String PERMISSION_SERVICE_CREATE = "SE_C";
    public static final String PERMISSION_SERVICE_DELETE = "SE_D";
    public static final String PERMISSION_SERVICE_UPDATE = "SE_U";
    public static final String PERMISSION_SERVICE_RESOLVE = "SE_R";

    public static final String PERMISSION_GROUP_SERVICE_LIST = "SE_G_L";
    public static final String PERMISSION_GROUP_SERVICE_CREATE = "SE_G_C";
    public static final String PERMISSION_GROUP_SERVICE_DELETE = "SE_G_D";
    public static final String PERMISSION_GROUP_SERVICE_UPDATE = "SE_G_U";
    public static final String PERMISSION_GROUP_SERVICE_GET = "SE_G_V";
    public static final String PERMISSION_SERVICE_GET = "SE_V";


    //NOTIFICATION
    public static final String PERMISSION_NOTIFICATION_LIST = "NO_L";
    public static final String PERMISSION_NOTIFICATION_DELETE = "NO_D";
    //DEBIT
    public static final String PERMISSION_DEBIT_LIST = "DEB_L";
    public static final String PERMISSION_DEBIT_APPROVE = "DEB_A";
    public static final String PERMISSION_DEBIT_DELETE = "DEB_D";
    public static final String PERMISSION_DEBIT_UPDATE = "DEB_U";
    public static final String PERMISSION_DEBIT_GET = "DEB_V";
    public static final String PERMISSION_DEBIT_UPDATE_FULL_AUTHENTICATION = "DEB_U_FA";

    //TAG
    public static final String PERMISSION_TAG_LIST = "TAG_L";
    public static final String PERMISSION_TAG_CREATE = "TAG_C";
    public static final String PERMISSION_TAG_DELETE = "TAG_D";
    public static final String PERMISSION_TAG_UPDATE = "TAG_U";
    public static final String PERMISSION_TAG_GET = "TAG_V";

    //key intent
    public static final String CATEGORY_ID = "categoryId";
    public static final String IS_CREATE = "isCreate";
    public static final String CATEGORY = "category";
    public static final String DEPARTMENT_ID = "departmentId";
    public static final String DEPARTMENT = "department";
    public static final String KIND = "kind";
    public static final String KEY = "key";
    public static final String KEY_ID = "keyId";
    public static final String MONTH_YEAR = "monthYear";

    public static final String KEY_GROUP_ID = "key_group_id";
    public static final String KEY_GROUP = "keyGroup";
    public static final String FILE_DOWNLOAD = "v1/media/download/";
    public static final String TRANSACTION_ID = "transaction_id";
    public static final String SERVICE_ID = "service_id";
    public static final String FROM_NOTIFICATION = "from_notification";
    public static final String KEY_USER_ID = "userId";
    public static final String TRANSACTION_RESPONSE = "transaction_response";
    public static final String POSITION = "position";
    public static final String GROUP_TRANSACTION_ID = "group_transaction_id";
    public static final String GROUP_SERVICE_ID = "group_service_id";

    //api response error code
    public static final String KEY_FILE_NAME = "key_information_";
    public static final Object ERROR_ACCOUNT_RESET_PASS = "ERROR-ACCOUNT-0009";
    public static final String ERROR_FORGET_PASS = "ERROR-ACCOUNT-0006";
    public static final String ACCOUNT_RESPONSE = "account_response";
    public static final String UPDATE_PROFILE = "update_profile_request";
    public static final String ERROR_EMAIL_NOT_FOUND = "ERROR-ACCOUNT-0000";
    public static final String ERROR_CATEGORY_NAME_EXISTED = "ERROR-CATEGORY-0001";
    public static final String PAYMENT_PERIOD_ID = "payment_period_id";
    public static final String ORGANIZATION_ID = "organization_id";

    public static final String PROJECT_ID = "project_id";
    public static final String TASK_RESPONSE = "task_response";
    public static final String TASK_ID = "task_id";
    public static final String DEBIT_ID = "debit_id";

    public static final String DELETE_DIALOG = "deleteDialog";
    public static final String DEBIT_RESPONSE = "debit_response";

    //
    public static final int CLICK_ACTION_THRESHOLD = 120;
    public static final Integer KEY_EXPIRE_TIME = 2*60*60*1000;

    //notification

    public static final Integer NOTIFICATION_STATE_READ = 1;

    public static final int RESULT_CREATE = 200;
    public static final int RESULT_SUB_TASK = 119;

    public static final int STORAGE_REQUEST = 300;
    public static final int CAMERA_REQUEST = 301;
    public static final long DELAY_SHOW_DROP_DOWN = 304;
    public static final int FILTER = 6; //The letter "F" is the 6th in the English alphabet

    public static final String IS_SUB_TASK = "is_sub_task";
    public static final String IMAGE_URL = "image_url";
    public static final String IMAGE_NAME = "image_name";
    public static final String FROM_PROJECT = "from_project";
    public static final String PROJECT_RESPONSE = "project_response";
    public static final String TOTAL_TASKS = "total_tasks";
    public static final int RESULT_FROM_TASK = 2709;
    public static final String PROJECT_FRAGMENT = "project_fragment";
    public static final int RESULT_UPDATE = 2809;
    public static final String DOCUMENT = "document";
    public static final Integer TAG_KIND_TRANSACTION = 1;
    public static final Integer TAG_KIND_SERVICE = 2;
    public static final Integer TAG_KIND_KEY_INFORMATION = 3;
    public static final Integer TAG_KIND_PROJECT = 4;
    public static final String TAG_ID = "tag_id";
    public static final String TAG_KIND = "tag_kind";


    private Constants(){

    }
}
