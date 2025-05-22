import { UserModel } from "../user/UserModel";
import { PostModel } from "./PostModel";

export type PostReactionModel = {
  _id: string
  user: UserModel,
  post: PostModel
}