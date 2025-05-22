import { UserModel } from "../user/UserModel";
import { DataNotificationModel } from "./DataNotificationModel";

export type NotificationModel = {
  _id: string;
  user : string
  data: DataNotificationModel
  message: string;
  createdAt: string;
  updatedAt: string;
  status: number;
}