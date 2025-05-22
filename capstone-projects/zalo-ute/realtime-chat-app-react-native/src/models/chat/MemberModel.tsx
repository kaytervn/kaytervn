import { UserModel } from "../user/UserModel"
import { ConversationModel } from "./ConversationModel"

export type MemberModel = {
  _id: string
  user: UserModel
  conversation: ConversationModel
  isOwner: number
}