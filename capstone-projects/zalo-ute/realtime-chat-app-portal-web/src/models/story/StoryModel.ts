import { Profile } from "../profile/Profile";

export interface StoryModel {
    _id: string;
    imageUrl: string;
    user: Profile;
    createdAt: string;
    isViewed: number;
    isOwner: number;
    totalViews: number;
    position: number;
    totalStories: number;
    previousStory: string | null;
    nextStory: string | null;
  }