import { PostModel } from "../post/PostModel"
import { UserModel } from "../user/UserModel"

export type CommentModel = {
  _id: string
  post: PostModel
  user: UserModel
  content: string | null
  imageUrl: string
  createdAt: string
  isOwner: number
  isUpdated: number
  isReacted: number
  isChildren: number
  totalChildren: number
  totalReactions: number
}