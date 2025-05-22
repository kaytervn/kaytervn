import { PostModel } from "../post/PostModel";
import { UserModel } from "../user/UserModel";

export type DataNotificationModel = {
  post: PostModel,
  user: UserModel
}