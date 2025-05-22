import { UserModel } from "../user/UserModel"
import { MessageModel } from "./MessageModel"

export type ConversationModel = {
  _id: string
  name: string,
  kind: number,
  lastMessage: MessageModel
  isOwner: number
  avatarUrl: string
  owner: UserModel,
  canMessage: number
  canUpdate: number
  canAddMember: number
  totalMembers: number
  totalUnreadMessages: number
}