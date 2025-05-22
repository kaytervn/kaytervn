import { Profile } from "../profile/Profile";

export interface PostModel {
  _id: string;
  user: Profile;
  kind: number;
  content: string | null;
  imageUrls: string[];
  status: number;
  createdAt: string;
  totalComments: number;
  totalReactions: number;
  isOwner: number;
  isUpdated: number;
  isReacted: number;
}
