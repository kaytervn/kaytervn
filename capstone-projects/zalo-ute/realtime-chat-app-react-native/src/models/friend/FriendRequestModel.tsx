import { Conversation } from "../conversation/ConversationModel"
import { UserModel } from "../user/UserModel"

export type FriendRequestModel = {
  _id: string
  status: number,
  sender: UserModel,
  receiver: UserModel,
}