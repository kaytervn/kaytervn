import { Profile } from "../profile/Profile";
import { PostModel } from "./PostModel";

export interface PostReactionModel {
  _id: string
  user: Profile,
  post: PostModel
}