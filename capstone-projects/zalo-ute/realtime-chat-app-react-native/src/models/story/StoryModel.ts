import { UserModel } from "../user/UserModel";

export type StoryModel = {
  _id: string
  imageUrl: UserModel
  user: UserModel
  createdAt: string
  isViewed: number
  isOwner: number
  totalViews: number
  position: number
  totalStories: number
  previousStory: string
  nextStory: string
}