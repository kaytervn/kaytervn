import useFetch from "./useFetch.ts";
import { authController } from "../controllers/authController.ts";
import mediaController from "../controllers/mediaController.ts";
import { roleController } from "../controllers/roleController.ts";
import { transactionController } from "../controllers/transactionController.ts";
import { departmentController } from "../controllers/departmentController.ts";
import { employeeController } from "../controllers/employeeController.ts";
import { transactionGroupController } from "../controllers/transactionGroupController.ts";
import { transactionPermissionController } from "../controllers/transactionPermissionController.ts";
import { serviceGroupController } from "../controllers/serviceGroupController.ts";
import { servicePermissionController } from "../controllers/servicePermissionController.ts";
import { keyInformationPermissionController } from "../controllers/keyInformationPermissionController.ts";
import { keyInformationGroupController } from "../controllers/keyInformationGroupController.ts";
import { categoryController } from "../controllers/categoryController.ts";
import { notificationGroupController } from "../controllers/notificationGroupController.ts";
import { organizationController } from "../controllers/organizationController.ts";
import { organizationPermissionController } from "../controllers/organizationPermissionController.ts";
import { projectController } from "../controllers/projectController.ts";
import { tagController } from "../controllers/tagController.ts";
import { userNotificationGroupController } from "../controllers/userNotificationGroupController.ts";
import { taskController } from "../controllers/taskController.ts";
import { taskPermissionController } from "../controllers/taskPermissionController.ts";
import { keyInformationController } from "../controllers/keyInformationController.ts";
import { serviceController } from "../controllers/serviceController.ts";
import { serviceScheduleController } from "../controllers/serviceScheduleController.ts";
import { serviceNotificationGroupController } from "../controllers/serviceNotificationGroupController.ts";
import { notificationController } from "../controllers/notificationController.ts";
import { debitController } from "../controllers/debitController.ts";
import { paymentPeriodController } from "../controllers/paymentPeriodController.ts";
import { faceIdController } from "./../controllers/faceIdController";
import { chatHistoryController } from "../controllers/chatHistoryController.ts";
import { chatRoomController } from "../controllers/chatRoomController.ts";
import { chatRoomMemberController } from "../controllers/chatRoomMember.ts";
import { messageController } from "../controllers/messageController.ts";

const useApi = () => {
  const { fetchApi, loading } = useFetch();

  const auth = authController(fetchApi);
  const media = mediaController(fetchApi);
  const role = roleController(fetchApi);
  const department = departmentController(fetchApi);
  const employee = employeeController(fetchApi);
  const transaction = transactionController(fetchApi);
  const debit = debitController(fetchApi);
  const transactionGroup = transactionGroupController(fetchApi);
  const transactionPermission = transactionPermissionController(fetchApi);
  const serviceGroup = serviceGroupController(fetchApi);
  const servicePermission = servicePermissionController(fetchApi);
  const keyInformationGroup = keyInformationGroupController(fetchApi);
  const keyInformationPermission = keyInformationPermissionController(fetchApi);
  const category = categoryController(fetchApi);
  const notificationGroup = notificationGroupController(fetchApi);
  const organization = organizationController(fetchApi);
  const organizationPermission = organizationPermissionController(fetchApi);
  const project = projectController(fetchApi);
  const tag = tagController(fetchApi);
  const userNotificationGroup = userNotificationGroupController(fetchApi);
  const task = taskController(fetchApi);
  const taskPermission = taskPermissionController(fetchApi);
  const keyInformation = keyInformationController(fetchApi);
  const service = serviceController(fetchApi);
  const serviceSchedule = serviceScheduleController(fetchApi);
  const serviceNotificationGroup = serviceNotificationGroupController(fetchApi);
  const notification = notificationController(fetchApi);
  const paymentPeriod = paymentPeriodController(fetchApi);
  const faceId = faceIdController(fetchApi);
  const chatHistory = chatHistoryController(fetchApi);
  const chatRoom = chatRoomController(fetchApi);
  const chatRoomMember = chatRoomMemberController(fetchApi);
  const chatMessage = messageController(fetchApi);

  return {
    auth,
    media,
    loading,
    role,
    location,
    transaction,
    transactionGroup,
    transactionPermission,
    employee,
    department,
    serviceGroup,
    servicePermission,
    keyInformationGroup,
    keyInformationPermission,
    category,
    notificationGroup,
    organization,
    organizationPermission,
    project,
    tag,
    userNotificationGroup,
    task,
    taskPermission,
    keyInformation,
    service,
    serviceSchedule,
    serviceNotificationGroup,
    notification,
    debit,
    paymentPeriod,
    faceId,
    chatHistory,
    chatRoom,
    chatRoomMember,
    chatMessage,
  };
};

export default useApi;
