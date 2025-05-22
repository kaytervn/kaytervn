import { Profile } from "../profile/Profile"

export interface FriendModel {
  _id: string
  status: number,
  friend: Profile,
  isFollowed: number,
}