import { Conversation } from "../conversation/ConversationModel";
import { UserModel } from "../user/UserModel";

export type FriendModel = {
  _id: string;
  status: number;
  friend: UserModel;
  conversation: Conversation;
  isFollowed: number;
};
