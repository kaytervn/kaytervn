import { Role } from "./Role";

export interface UserModel {
  _id: string;
  displayName: string
  email: string | null
  password: string | null
  birthDate: string | null
  otp: string | null
  bio: string | null
  phone: string | null
  avatarUrl: string | null
  status: string | null
  secretKey: string | null
  role: Role | null
  lastLogin: string | null
  totalFriends: number
  totalFriendRequestsSent: number
  totalFriendRequestsReceived: number
  totalUnreadMessages: number
  totalUnreadNotifications: number
}