import { UserModel } from "../user/UserModel"
import { ConversationModel } from "./ConversationModel"

export type MessageModel = {
  _id: string
  conversation: ConversationModel,
  user: UserModel,
  content: string,
  imageUrl: string,
  createdAt: string,
  isOwner: number
  isUpdated: number
  isReacted: number
  isChildren: number
  totalReactions: number
}