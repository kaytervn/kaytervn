import { BoltIcon, UserIcon } from "lucide-react";
import Admin from "../pages/admin/Admin";
import Customer from "../pages/customer/Customer";
import Role from "../pages/role/Role";
import CreateAdmin from "../pages/admin/CreateAdmin";
import UpdateAdmin from "../pages/admin/UpdateAdmin";
import UpdateRole from "../pages/role/UpdateRole";
import Profile from "../pages/profile/Profile";
import ChangePassword from "../pages/profile/ChangePassword";
import AccountBranch from "../pages/branch/AccountBranch";
import Branch from "../pages/branch/Branch";
import ServerProvider from "../pages/provider/ServerProvider";
import CreateServerProvider from "../pages/provider/CreateServerProvider";
import UpdateServerProvider from "../pages/provider/UpdateServerProvider";
import UpdateCustomer from "../pages/customer/UpdateCustomer";
import CreateCustomer from "../pages/customer/CreateCustomer";
import Location from "../pages/location/Location";
import CreateLocation from "../pages/location/CreateLocation";
import UpdateLocation from "../pages/location/UpdateLocation";
import CreateDbConfig from "../pages/dbConfig/CreateDbConfig";
import UpdateDbConfig from "../pages/dbConfig/UpdateDbConfig";
import CreateRole from "../pages/role/CreateRole";

const ADMIN_CONFIG = {
  ADMIN: {
    name: "admin",
    label: "Quản trị viên",
    path: "/admin",
    role: "ACC_L",
    element: <Admin />,
  },
  CREATE_ADMIN: {
    label: "Thêm quản trị viên",
    path: "/admin/create",
    role: "ACC_C_AD",
    element: <CreateAdmin />,
  },
  UPDATE_ADMIN: {
    label: "Cập nhật quản trị viên",
    path: "/admin/update/:id",
    role: "ACC_U_AD",
    element: <UpdateAdmin />,
  },
  DELETE_ADMIN: {
    label: "Xóa quản trị viên",
    role: "ACC_D",
  },
  RESET_MFA_ADMIN: {
    label: "Đặt lại mã xác thực hai bước",
    role: "ACC_R_MFA",
  },
};

const ACCOUNT_BRANCH_CONFIG = {
  ACCOUNT_BRANCH: {
    name: "account_branch",
    label: "Quản lý chi nhánh",
    path: "/admin/account-branch/:adminId",
    role: "ACC_B_L",
    element: <AccountBranch />,
  },
  CREATE_ACCOUNT_BRANCH: {
    label: "Phân quyền chi nhánh",
    role: "ACC_B_C",
  },
  DELETE_ACCOUNT_BRANCH: {
    label: "Xóa quyền chi nhánh",
    role: "ACC_B_D",
  },
};

const ROLE_CONFIG = {
  ROLE: {
    name: "role",
    label: "Quyền hạn",
    path: "/role",
    role: "GR_L",
    element: <Role />,
  },
  UPDATE_ROLE: {
    label: "Cập nhật quyền hạn",
    path: "/role/update/:id",
    role: "GR_U",
    element: <UpdateRole />,
  },
  CREATE_ROLE: {
    label: "Thêm mới quyền hạn",
    path: "/role/create",
    role: "GR_C",
    element: <CreateRole />,
  },
  DELETE_ROLE: {
    label: "Xóa quyền hạn",
    role: "GR_D",
  },
};

const PROFILE_CONFIG = {
  PROFILE: {
    name: "profile",
    label: "Hồ sơ",
    path: "/profile",
    element: <Profile />,
  },
  CHANGE_PASSWORD: {
    name: "change_password",
    label: "Đổi mật khẩu",
    path: "/change-password",
    element: <ChangePassword />,
  },
};

const CUSTOMER_CONFIG = {
  CUSTOMER: {
    name: "customer",
    label: "Khách hàng",
    path: "/customer",
    role: "CU_L",
    element: <Customer />,
  },
  CREATE_CUSTOMER: {
    label: "Thêm mới khách hàng",
    path: "/customer/create",
    role: "CU_C",
    element: <CreateCustomer />,
  },
  UPDATE_CUSTOMER: {
    label: "Cập nhật thông tin khách hàng",
    path: "/customer/update/:id",
    role: "CU_U",
    element: <UpdateCustomer />,
  },
  DELETE_CUSTOMER: {
    label: "Xóa khách hàng",
    role: "CU_D",
  },
};

const LOCATION_CONFIG = {
  LOCATION: {
    label: "Khu vực",
    path: "/customer/location/:customerId",
    role: "LO_L",
    element: <Location />,
  },
  CREATE_LOCATION: {
    label: "Thêm mới khu vực",
    path: "/customer/location/:customerId/create",
    role: "LO_C",
    element: <CreateLocation />,
  },
  UPDATE_LOCATION: {
    label: "Cập nhật khu vực",
    path: "/customer/location/:customerId/update/:id",
    role: "LO_U",
    element: <UpdateLocation />,
  },
  DELETE_LOCATION: {
    label: "Xóa khu vực",
    role: "LO_D",
  },
};

const BRANCH_CONFIG = {
  BRANCH: {
    name: "branch",
    label: "Chi nhánh",
    path: "/branch",
    role: "BR_L",
    element: <Branch />,
  },
  CREATE_BRANCH: {
    label: "Thêm mới chi nhánh",
    role: "BR_C",
  },
  UPDATE_BRANCH: {
    label: "Cập nhật chi nhánh",
    role: "BR_U",
  },
  DELETE_BRANCH: {
    label: "Xóa chi nhánh",
    role: "BR_D",
  },
};

const SERVER_PROVIDER_CONFIG = {
  SERVER_PROVIDER: {
    name: "server_provider",
    label: "Máy chủ",
    path: "/server-provider",
    role: "SE_P_L",
    element: <ServerProvider />,
  },
  CREATE_SERVER_PROVIDER: {
    label: "Thêm máy chủ",
    path: "/server-provider/create",
    role: "SE_P_C",
    element: <CreateServerProvider />,
  },
  UPDATE_SERVER_PROVIDER: {
    label: "Cập nhật máy chủ",
    path: "/server-provider/update/:id",
    role: "SE_P_U",
    element: <UpdateServerProvider />,
  },
  DELETE_SERVER_PROVIDER: {
    label: "Xóa máy chủ",
    role: "SE_P_D",
  },
};

const DB_CONFIG = {
  CREATE_DB_CONFIG: {
    label: "Thêm mới cấu hình CSDL",
    path: "/customer/location/:customerId/db-config/:locationId/create",
    role: "DB_C_C",
    element: <CreateDbConfig />,
  },
  UPDATE_DB_CONFIG: {
    label: "Cập nhật cấu hình CSDL",
    path: "/customer/location/:customerId/db-config/:locationId/update/:id",
    role: "DB_C_U",
    element: <UpdateDbConfig />,
  },
};

const AUTH_CONFIG = {
  INPUT_KEY: {
    label: "Nhập khóa hệ thống",
    role: "ACC_I_K",
  },
  CLEAR_KEY: {
    label: "Xóa khóa hệ thống",
    role: "ACC_C_K",
  },
};

const PAGE_CONFIG = {
  ...ADMIN_CONFIG,
  ...ACCOUNT_BRANCH_CONFIG,
  ...ROLE_CONFIG,
  ...PROFILE_CONFIG,
  ...CUSTOMER_CONFIG,
  ...BRANCH_CONFIG,
  ...SERVER_PROVIDER_CONFIG,
  ...LOCATION_CONFIG,
  ...DB_CONFIG,
  ...AUTH_CONFIG,
};

const SIDEBAR_MENUS = [
  {
    name: "Tài khoản",
    icon: <UserIcon size={20} />,
    items: [PAGE_CONFIG.ADMIN, PAGE_CONFIG.CUSTOMER],
  },
  {
    name: "Hệ thống",
    icon: <BoltIcon size={20} />,
    items: [PAGE_CONFIG.BRANCH, PAGE_CONFIG.SERVER_PROVIDER, PAGE_CONFIG.ROLE],
  },
];

export { PAGE_CONFIG, SIDEBAR_MENUS };
