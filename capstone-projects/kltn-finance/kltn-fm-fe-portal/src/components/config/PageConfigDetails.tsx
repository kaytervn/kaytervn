import Category from "../../pages/category/Category";
import Debit from "../../pages/debit/Debit";
import UpdateDebit from "../../pages/debit/UpdateDebit";
import ViewDebit from "../../pages/debit/ViewDebit";
import Department from "../../pages/department/Department";
import CreateEmployee from "../../pages/employee/CreateEmployee";
import Employee from "../../pages/employee/Employee";
import UpdateEmployee from "../../pages/employee/UpdateEmployee";
import CreateKeyInformation from "../../pages/keyInformation/CreateKeyInformation";
import KeyInformation from "../../pages/keyInformation/KeyInformation";
import UpdateKeyInformation from "../../pages/keyInformation/UpdateKeyInformation";
import ViewKeyInformation from "../../pages/keyInformation/ViewKeyInformation";
import KeyInformationGroup from "../../pages/keyInformationGroup/KeyInformationGroup";
import KeyInformationGroupPermission from "../../pages/keyInformationGroupPermission/KeyInformationGroupPermission";
import KeyInformationTag from "../../pages/keyInformationTag/KeyInformationTag";
import UpdateLocationByCustomer from "../../pages/location/UpdateLocationByCustomer";
import NotificationGroup from "../../pages/notificationGroup/NotificationGroup";
import Organization from "../../pages/organization/Organization";
import OrganizationPermission from "../../pages/organizationPermission/OrganizationPermission";
import DetailPaymentPeriod from "../../pages/paymentPeriod/DetailPaymentPeriod";
import PaymentPeriod from "../../pages/paymentPeriod/PaymentPeriod";
import ViewTransactionPeriod from "../../pages/paymentPeriod/ViewTransactionPeriod";
import ChangePassword from "../../pages/profile/ChangePassword";
import CreateProject from "../../pages/project/CreateProject";
import Project from "../../pages/project/Project";
import UpdateProject from "../../pages/project/UpdateProject";
import ProjectPermission from "../../pages/projectPermission/ProjectPermission";
import ProjectTag from "../../pages/projectTag/ProjectTag";
import CreateRole from "../../pages/role/CreateRole";
import Role from "../../pages/role/Role";
import UpdateRole from "../../pages/role/UpdateRole";
import CreateService from "../../pages/service/CreateService";
import Service from "../../pages/service/Service";
import UpdateService from "../../pages/service/UpdateService";
import ServiceGroup from "../../pages/serviceGroup/ServiceGroup";
import ServiceGroupPermission from "../../pages/serviceGroupPermission/ServiceGroupPermission";
import ServiceNotificationGroup from "../../pages/serviceNotificationGroup/ServiceNotificationGroup";
import ServiceSchedule from "../../pages/serviceSchedule/ServiceSchedule";
import ServiceTag from "../../pages/serviceTag/ServiceTag";
import CreateTask from "../../pages/task/CreateTask";
import Task from "../../pages/task/Task";
import UpdateTask from "../../pages/task/UpdateTask";
import ViewTask from "../../pages/task/ViewTask";
import CreateTransaction from "../../pages/transaction/CreateTransaction";
import Transaction from "../../pages/transaction/Transaction";
import UpdateTransaction from "../../pages/transaction/UpdateTransaction";
import ViewTransaction from "../../pages/transaction/ViewTransaction";
import TransactionGroup from "../../pages/transactionGroup/TransactionGroup";
import TransactionGroupPermission from "../../pages/transactionGroupPermission/TransactionGroupPermission";
import TransactionTag from "../../pages/transactionTag/TransactionTag";
import UserNotificationGroup from "../../pages/userNotificationGroup/UserNotificationGroup";
import RedirecProfile from "../redirect/RedirectProfile";

const TRANSACTION_CONFIG = {
  TRANSACTION: {
    name: "transaction",
    label: "Giao dịch",
    path: "/transaction",
    role: "TR_L",
    element: <Transaction />,
  },
  CREATE_TRANSACTION: {
    label: "Thêm mới giao dịch",
    path: "/transaction/create",
    role: "TR_C",
    element: <CreateTransaction />,
  },
  UPDATE_TRANSACTION: {
    label: "Cập nhật giao dịch",
    path: "/transaction/update/:id",
    role: "TR_U",
    element: <UpdateTransaction />,
  },
  DELETE_TRANSACTION: {
    label: "Xóa giao dịch",
    role: "TR_D",
  },
  REMOVE_TRANSACTION_FROM_PERIOD: {
    label: "Gỡ giao dịch khỏi kỳ thanh toán",
    role: "TR_R_F_P",
  },
  APPROVE_TRANSACTION: {
    label: "Chấp nhận giao dịch",
    role: "TR_A",
  },
  REJECT_TRANSACTION: {
    label: "Từ chối giao dịch",
    role: "TR_R",
  },
  IMPORT_EXCEL_TRANSACTION: {
    label: "Tải lên tệp Excel giao dịch",
    role: "TR_I_E",
  },
  EXPORT_EXCEL_TRANSACTION: {
    label: "Xuất tệp Excel giao dịch",
    role: "TR_E_E",
  },
  VIEW_TRANSACTION: {
    label: "Xem chi tiết giao dịch",
    path: "/transaction/view/:id",
    role: "TR_V",
    element: <ViewTransaction />,
  },
};

const TRANSACTION_GROUP_CONFIG = {
  TRANSACTION_GROUP: {
    name: "transaction_group",
    label: "Nhóm giao dịch",
    path: "/transaction-group",
    role: "TR_G_L",
    element: <TransactionGroup />,
  },
  CREATE_TRANSACTION_GROUP: {
    label: "Thêm mới nhóm giao dịch",
    role: "TR_G_C",
  },
  UPDATE_TRANSACTION_GROUP: {
    label: "Cập nhật nhóm giao dịch",
    role: "TR_G_U",
  },
  DELETE_TRANSACTION_GROUP: {
    label: "Xóa nhóm giao dịch",
    role: "TR_G_D",
  },
};

const TRANSACTION_GROUP_PERMISSION_CONFIG = {
  TRANSACTION_GROUP_PERMISSION: {
    label: "Phân quyền nhóm giao dịch",
    path: "/transaction-group/permission/:transactionGroupId",
    role: "TR_P_L",
    element: <TransactionGroupPermission />,
  },
  CREATE_TRANSACTION_GROUP_PERMISSION: {
    label: "Thêm quyền nhóm giao dịch",
    role: "TR_P_C",
  },
  DELETE_TRANSACTION_GROUP_PERMISSION: {
    label: "Xóa quyền nhóm giao dịch",
    role: "TR_P_D",
  },
};

const SERVICE_GROUP_CONFIG = {
  SERVICE_GROUP: {
    name: "service_group",
    label: "Nhóm dịch vụ",
    path: "/service-group",
    role: "SE_G_L",
    element: <ServiceGroup />,
  },
  CREATE_SERVICE_GROUP: {
    label: "Thêm mới nhóm dịch vụ",
    role: "SE_G_C",
  },
  UPDATE_SERVICE_GROUP: {
    label: "Cập nhật nhóm dịch vụ",
    role: "SE_G_U",
  },
  DELETE_SERVICE_GROUP: {
    label: "Xóa nhóm dịch vụ",
    role: "SE_G_D",
  },
};

const SERVICE_GROUP_PERMISSION_CONFIG = {
  SERVICE_GROUP_PERMISSION: {
    label: "Phân quyền nhóm dịch vụ",
    path: "/service-group/permission/:serviceGroupId",
    role: "SER_P_L",
    element: <ServiceGroupPermission />,
  },
  CREATE_SERVICE_GROUP_PERMISSION: {
    label: "Thêm quyền nhóm dịch vụ",
    role: "SER_P_C",
  },
  DELETE_SERVICE_GROUP_PERMISSION: {
    label: "Xóa quyền nhóm dịch vụ",
    role: "SER_P_D",
  },
};

const KEY_INFORMATION_GROUP_CONFIG = {
  KEY_INFORMATION_GROUP: {
    name: "key_information_group",
    label: "Nhóm key",
    path: "/key-information-group",
    role: "KE_I_G_L",
    element: <KeyInformationGroup />,
  },
  CREATE_KEY_INFORMATION_GROUP: {
    label: "Thêm mới nhóm key",
    role: "KE_I_G_C",
  },
  UPDATE_KEY_INFORMATION_GROUP: {
    label: "Cập nhật nhóm key",
    role: "KE_I_G_U",
  },
  DELETE_KEY_INFORMATION_GROUP: {
    label: "Xóa nhóm key",
    role: "KE_I_G_D",
  },
};

const KEY_INFORMATION_GROUP_PERMISSION_CONFIG = {
  KEY_INFORMATION_GROUP_PERMISSION: {
    label: "Phân quyền nhóm key",
    path: "/key-information-group/permission/:keyInformationGroupId",
    role: "KE_I_P_L",
    element: <KeyInformationGroupPermission />,
  },
  CREATE_KEY_INFORMATION_GROUP_PERMISSION: {
    label: "Thêm quyền nhóm key",
    role: "KE_I_P_C",
  },
  DELETE_KEY_INFORMATION_GROUP_PERMISSION: {
    label: "Xóa quyền nhóm key",
    role: "KE_I_P_D",
  },
};

const ROLE_CONFIG = {
  ROLE: {
    name: "role",
    label: "Quyền hạn",
    path: "/role",
    role: "RO_L",
    element: <Role />,
  },
  UPDATE_ROLE: {
    label: "Cập nhật quyền hạn",
    path: "/role/update/:id",
    role: "RO_U",
    element: <UpdateRole />,
  },
  CREATE_ROLE: {
    label: "Thêm mới quyền hạn",
    path: "/role/create",
    role: "RO_C",
    element: <CreateRole />,
  },
  DELETE_ROLE: {
    label: "Xóa quyền hạn",
    role: "RO_D",
  },
};

const EMPLOYEE_CONFIG = {
  EMPLOYEE: {
    name: "employee",
    label: "Nhân viên",
    path: "/employee",
    role: "EMP_L",
    element: <Employee />,
  },
  CREATE_EMPLOYEE: {
    label: "Thêm mới nhân viên",
    path: "/employee/create",
    role: "EMP_C_AD",
    element: <CreateEmployee />,
  },
  UPDATE_EMPLOYEE: {
    label: "Cập nhật nhân viên",
    path: "/employee/update/:id",
    role: "EMP_U_AD",
    element: <UpdateEmployee />,
  },
  DELETE_EMPLOYEE: {
    label: "Xóa nhân viên",
    role: "EMP_D",
  },
};

const DEPARTMENT_CONFIG = {
  DEPARTMENT: {
    name: "department",
    label: "Phòng ban",
    path: "/department",
    role: "DE_L",
    element: <Department />,
  },
  CREATE_DEPARTMENT: {
    label: "Thêm mới phòng ban",
    role: "DE_C",
  },
  UPDATE_DEPARTMENT: {
    label: "Cập nhật phòng ban",
    role: "DE_U",
  },
  DELETE_DEPARTMENT: {
    label: "Xóa phòng ban",
    role: "DE_D",
  },
};

const PROFILE_CONFIG = {
  LOCATION: {
    label: "Khu vực của tôi",
    path: "/location",
    element: <UpdateLocationByCustomer />,
  },
  PROFILE: {
    label: "Hồ sơ",
    path: "/profile",
    element: <RedirecProfile />,
  },
  CHANGE_PASSWORD: {
    label: "Đổi mật khẩu",
    path: "/change-password",
    element: <ChangePassword />,
  },
};

const ORGANIZATION_CONFIG = {
  ORGANIZATION: {
    name: "organization",
    label: "Công ty",
    path: "/organization",
    role: "OR_L",
    element: <Organization />,
  },
  CREATE_ORGANIZATION: {
    label: "Thêm mới công ty",
    role: "OR_C",
  },
  UPDATE_ORGANIZATION: {
    label: "Cập nhật công ty",
    role: "OR_U",
  },
  DELETE_ORGANIZATION: {
    label: "Xóa công ty",
    role: "OR_D",
  },
};

const ORGANIZATION_PERMISSION_CONFIG = {
  ORGANIZATION_PERMISSION: {
    label: "Phân quyền công ty",
    path: "/organization/permission/:organizationId",
    role: "OR_P_L",
    element: <OrganizationPermission />,
  },
  CREATE_ORGANIZATION_PERMISSION: {
    label: "Thêm quyền công ty",
    role: "OR_P_C",
  },
  DELETE_ORGANIZATION_PERMISSION: {
    label: "Xóa quyền công ty",
    role: "OR_P_D",
  },
};

const CATEGORY_CONFIG = {
  CATEGORY: {
    name: "category",
    label: "Danh mục",
    path: "/category",
    role: "CA_L",
    element: <Category />,
  },
  CREATE_CATEGORY: {
    label: "Thêm mới danh mục",
    role: "CA_C",
  },
  UPDATE_CATEGORY: {
    label: "Cập nhật danh mục",
    role: "CA_U",
  },
  DELETE_CATEGORY: {
    label: "Xóa danh mục",
    role: "CA_D",
  },
};

const TRANSACTION_TAG_CONFIG = {
  TRANSACTION_TAG: {
    name: "transaction_tag",
    label: "Thẻ giao dịch",
    path: "/transaction-tag",
    role: "TAG_L",
    element: <TransactionTag />,
  },
  CREATE_TRANSACTION_TAG: {
    label: "Thêm mới thẻ giao dịch",
    role: "TAG_C",
  },
  UPDATE_TRANSACTION_TAG: {
    label: "Cập nhật thẻ giao dịch",
    role: "TAG_U",
  },
  DELETE_TRANSACTION_TAG: {
    label: "Xóa thẻ giao dịch",
    role: "TAG_D",
  },
};

const SERVICE_TAG_CONFIG = {
  SERVICE_TAG: {
    name: "service_tag",
    label: "Thẻ dịch vụ",
    path: "/service-tag",
    role: "TAG_L",
    element: <ServiceTag />,
  },
  CREATE_SERVICE_TAG: {
    label: "Thêm mới thẻ dịch vụ",
    role: "TAG_C",
  },
  UPDATE_SERVICE_TAG: {
    label: "Cập nhật thẻ dịch vụ",
    role: "TAG_U",
  },
  DELETE_SERVICE_TAG: {
    label: "Xóa thẻ dịch vụ",
    role: "TAG_D",
  },
};

const KEY_INFORMATION_TAG_CONFIG = {
  KEY_INFORMATION_TAG: {
    name: "key_information_tag",
    label: "Thẻ key",
    path: "/key-information-tag",
    role: "TAG_L",
    element: <KeyInformationTag />,
  },
  CREATE_KEY_INFORMATION_TAG: {
    label: "Thêm mới thẻ key",
    role: "TAG_C",
  },
  UPDATE_KEY_INFORMATION_TAG: {
    label: "Cập nhật thẻ key",
    role: "TAG_U",
  },
  DELETE_KEY_INFORMATION_TAG: {
    label: "Xóa thẻ key",
    role: "TAG_D",
  },
};

const PROJECT_TAG_CONFIG = {
  PROJECT_TAG: {
    name: "project_tag",
    label: "Thẻ ghi chú",
    path: "/project-tag",
    role: "TAG_L",
    element: <ProjectTag />,
  },
  CREATE_PROJECT_TAG: {
    label: "Thêm mới thẻ ghi chú",
    role: "TAG_C",
  },
  UPDATE_PROJECT_TAG: {
    label: "Cập nhật thẻ ghi chú",
    role: "TAG_U",
  },
  DELETE_PROJECT_TAG: {
    label: "Xóa thẻ ghi chú",
    role: "TAG_D",
  },
};

const NOTIFICATION_GROUP_CONFIG = {
  NOTIFICATION_GROUP: {
    name: "notification_group",
    label: "Nhóm thông báo",
    path: "/notification-group",
    role: "NO_G_L",
    element: <NotificationGroup />,
  },
  CREATE_NOTIFICATION_GROUP: {
    label: "Thêm mới nhóm thông báo",
    role: "NO_G_C",
  },
  UPDATE_NOTIFICATION_GROUP: {
    label: "Cập nhật nhóm thông báo",
    role: "NO_G_U",
  },
  DELETE_NOTIFICATION_GROUP: {
    label: "Xóa nhóm thông báo",
    role: "NO_G_D",
  },
};

const USER_NOTIFICATION_GROUP_CONFIG = {
  USER_NOTIFICATION_GROUP: {
    label: "Quản lý thành viên nhóm",
    path: "/notification-group/users/:notificationGroupId",
    role: "US_G_N_L",
    element: <UserNotificationGroup />,
  },
  CREATE_USER_NOTIFICATION_GROUP: {
    label: "Thêm thành viên vào nhóm",
    role: "US_G_N_C",
  },
  DELETE_USER_NOTIFICATION_GROUP: {
    label: "Xóa thành viên khỏi nhóm",
    role: "US_G_N_D",
  },
};

const PROJECT_CONFIG = {
  PROJECT: {
    name: "project",
    label: "Ghi chú",
    path: "/project",
    role: "PR_L",
    element: <Project />,
  },
  CREATE_PROJECT: {
    label: "Thêm mới ghi chú",
    path: "/project/create",
    role: "PR_C",
    element: <CreateProject />,
  },
  UPDATE_PROJECT: {
    label: "Cập nhật ghi chú",
    path: "/project/update/:id",
    role: "PR_U",
    element: <UpdateProject />,
  },
  DELETE_PROJECT: {
    label: "Xóa ghi chú",
    role: "PR_D",
  },
};

const TASK_CONFIG = {
  TASK: {
    name: "task",
    label: "Công việc",
    path: "/project/task/:projectId",
    role: "TA_L",
    element: <Task />,
  },
  CREATE_TASK: {
    label: "Thêm mới công việc",
    path: "/project/task/:projectId/create",
    role: "TA_C",
    element: <CreateTask />,
  },
  UPDATE_TASK: {
    label: "Cập nhật công việc",
    path: "/project/task/:projectId/update/:id",
    role: "TA_U",
    element: <UpdateTask />,
  },
  DELETE_TASK: {
    label: "Xóa công việc",
    role: "TA_D",
  },
  DONE_TASK: {
    label: "Hoàn thành công việc",
    role: "TA_C_S",
  },
  VIEW_TASK: {
    label: "Xem công việc",
    path: "/project/task/:projectId/view/:id",
    role: "TA_V",
    element: <ViewTask />,
  },
  EXPORT_EXCEL_TASK: {
    label: "Xuất tệp Excel công việc",
    role: "TA_E_E",
  },
};

const PROJECT_PERMISSION_CONFIG = {
  PROJECT_PERMISSION: {
    label: "Phân quyền ghi chú",
    path: "/project/permission/:projectId",
    role: "TA_P_L",
    element: <ProjectPermission />,
  },
  CREATE_PROJECT_PERMISSION: {
    label: "Thêm quyền ghi chú",
    role: "TA_P_C",
  },
  DELETE_PROJECT_PERMISSION: {
    label: "Xóa quyền ghi chú",
    role: "TA_P_D",
  },
};

const KEY_INFORMATION_CONFIG = {
  KEY_INFORMATION: {
    name: "key_information",
    label: "Thông tin key",
    path: "/key-information",
    role: "KE_I_L",
    element: <KeyInformation />,
  },
  CREATE_KEY_INFORMATION: {
    label: "Thêm mới key",
    path: "/key-information/create",
    role: "KE_I_C",
    element: <CreateKeyInformation />,
  },
  UPDATE_KEY_INFORMATION: {
    label: "Cập nhật key",
    path: "/key-information/update/:id",
    role: "KE_I_U",
    element: <UpdateKeyInformation />,
  },
  DELETE_KEY_INFORMATION: {
    label: "Xóa key",
    role: "KE_I_D",
  },
  IMPORT_EXCEL_KEY_INFORMATION: {
    label: "Tải lên tệp Excel key",
    role: "KE_I_I_E",
  },
  EXPORT_EXCEL_KEY_INFORMATION: {
    label: "Xuất tệp Excel key",
    role: "KE_I_E_E",
  },
  DECRYPT_PASSWORD_KEY_INFORMATION: {
    label: "Giải mã mật khẩu key",
  },
  VIEW_KEY_INFORMATION: {
    label: "Xem chi tiết key",
    path: "/key-information/view/:id",
    role: "KE_I_V",
    element: <ViewKeyInformation />,
  },
};

const SERVICE_CONFIG = {
  SERVICE: {
    name: "service",
    label: "Dịch vụ",
    path: "/service",
    role: "SE_L",
    element: <Service />,
  },
  CREATE_SERVICE: {
    label: "Thêm mới dịch vụ",
    path: "/service/create",
    role: "SE_C",
    element: <CreateService />,
  },
  UPDATE_SERVICE: {
    label: "Cập nhật dịch vụ",
    path: "/service/update/:id",
    role: "SE_U",
    element: <UpdateService />,
  },
  DELETE_SERVICE: {
    label: "Xóa dịch vụ",
    role: "SE_D",
  },
  RESOLVE_SERVICE: {
    label: "Thanh toán dịch vụ",
    role: "SE_R",
  },
};

const SERVICE_NOTIFICATION_GROUP_CONFIG = {
  SERVICE_NOTIFICATION_GROUP: {
    label: "Quản lý nhóm thông báo",
    path: "/service/notification-group/:serviceId",
    role: "SE_N_G_L",
    element: <ServiceNotificationGroup />,
  },
  CREATE_SERVICE_NOTIFICATION_GROUP: {
    label: "Gán nhóm vào dịch vụ",
    role: "SE_N_G_C",
  },
  DELETE_SERVICE_NOTIFICATION_GROUP: {
    label: "Xóa nhóm khỏi dịch vụ",
    role: "SE_N_G_D",
  },
};

const SERVICE_SCHEDULE_CONFIG = {
  SERVICE_SCHEDULE: {
    label: "Cài đặt lịch thông báo",
    path: "/service/schedule/:serviceId",
    role: "SE_S_L",
    element: <ServiceSchedule />,
  },
  CREATE_SERVICE_SCHEDULE: {
    label: "Đặt nhắc hẹn dịch vụ",
    role: "SE_S_U",
  },
  DELETE_SERVICE_SCHEDULE: {
    label: "Xóa nhắc hẹn dịch vụ",
    role: "SE_S_U",
  },
};

const DEBIT_CONFIG = {
  DEBIT: {
    name: "debit",
    label: "Công nợ",
    path: "/debit",
    role: "DEB_L",
    element: <Debit />,
  },
  UPDATE_DEBIT: {
    label: "Cập nhật công nợ",
    path: "/debit/update/:id",
    role: "DEB_U",
    element: <UpdateDebit />,
  },
  DELETE_DEBIT: {
    label: "Xóa công nợ",
    role: "DEB_D",
  },
  APPROVE_DEBIT: {
    label: "Thanh toán công nợ",
    role: "DEB_A",
  },
  EXPORT_EXCEL_DEBIT: {
    label: "Xuất tệp Excel công nợ",
    role: "DEB_E_E",
  },
  VIEW_DEBIT: {
    label: "Xem chi tiết công nợ",
    path: "/debit/view/:id",
    role: "DEB_V",
    element: <ViewDebit />,
  },
};

const PAYMENT_PERIOD_CONFIG = {
  PAYMENT_PERIOD: {
    name: "payment_period",
    label: "Kỳ thanh toán",
    path: "/payment-period",
    role: "PA_P_L",
    element: <PaymentPeriod />,
  },
  VIEW_TRANSACTION_PERIOD: {
    label: "Xem chi tiết giao dịch",
    path: "/payment-period/view/:id/detail-transaction/:transactionId",
    role: "TR_V",
    element: <ViewTransactionPeriod />,
  },
  VIEW_PAYMENT_PERIOD: {
    label: "Chi tiết kỳ thanh toán",
    path: "/payment-period/view/:id",
    role: "TR_L",
    element: <DetailPaymentPeriod />,
  },
  APPROVE_PAYMENT_PERIOD: {
    label: "Duyệt kỳ thanh toán",
    role: "PA_P_A",
  },
  RECALCULATE_PAYMENT_PERIOD: {
    label: "Tính lại kỳ thanh toán",
    role: "PA_P_R",
  },
  DELETE_PAYMENT_PERIOD: {
    label: "Xóa kỳ thanh toán",
    role: "PA_P_D",
  },
};

export {
  TRANSACTION_CONFIG,
  TRANSACTION_GROUP_CONFIG,
  TRANSACTION_GROUP_PERMISSION_CONFIG,
  SERVICE_GROUP_CONFIG,
  ROLE_CONFIG,
  EMPLOYEE_CONFIG,
  DEPARTMENT_CONFIG,
  PROFILE_CONFIG,
  SERVICE_GROUP_PERMISSION_CONFIG,
  KEY_INFORMATION_GROUP_CONFIG,
  KEY_INFORMATION_GROUP_PERMISSION_CONFIG,
  ORGANIZATION_CONFIG,
  ORGANIZATION_PERMISSION_CONFIG,
  CATEGORY_CONFIG,
  TRANSACTION_TAG_CONFIG,
  SERVICE_TAG_CONFIG,
  KEY_INFORMATION_TAG_CONFIG,
  PROJECT_TAG_CONFIG,
  NOTIFICATION_GROUP_CONFIG,
  USER_NOTIFICATION_GROUP_CONFIG,
  PROJECT_CONFIG,
  TASK_CONFIG,
  PROJECT_PERMISSION_CONFIG,
  KEY_INFORMATION_CONFIG,
  SERVICE_CONFIG,
  SERVICE_NOTIFICATION_GROUP_CONFIG,
  SERVICE_SCHEDULE_CONFIG,
  DEBIT_CONFIG,
  PAYMENT_PERIOD_CONFIG,
};
