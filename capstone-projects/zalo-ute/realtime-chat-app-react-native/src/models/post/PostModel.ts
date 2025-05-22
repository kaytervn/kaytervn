import { UserModel } from "../user/UserModel";

export type PostModel = {
  _id: string
  user: UserModel
  kind: number
  content: string | null
  imageUrls: string[]
  status: number
  createdAt: string
  totalComments: number
  totalReactions: number
  isOwner: number
  isUpdated: number
  isReacted: number
}