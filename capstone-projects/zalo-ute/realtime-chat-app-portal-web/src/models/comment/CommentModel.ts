import { PostModel } from "../post/PostModel"
import { Profile } from "../profile/Profile";

export interface CommentModel {
  _id: string
  post: PostModel 
  user: Profile
  content: string | null
  imageUrl: string
  createdAt: string
  isOwner: number
  isUpdated: number
  isReacted: number
  isChildren: number
  totalChildren: number
  totalReactions: number
  parent?: {
    _id: string
  } | null
}