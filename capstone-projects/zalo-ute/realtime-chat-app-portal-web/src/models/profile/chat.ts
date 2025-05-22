interface UserProfile {
  _id: string;
  displayName: string;
  avatarUrl: string;
  secretKey: string;
}
interface Conversation {
  _id: string;
  name: string;
  kind: Number;
  lastMessage: {
    _id: string;
    content: string;
    createdAt: string;
    user: {
      displayName: string;
    };
  };
  isOwner: number;
  owner: {
    _id: string;
  };
  lastLogin: string;
  avatarUrl: string;
  totalMembers: number;
  totalUnreadMessages: number;
  canMessage: Number;
  canAddMember: Number;
  canUpdate: Number;
}

interface Message {
  _id: string;
  user: {
    _id: string;
    displayName: string;
    avatarUrl: string;
  };
  content: string;
  imageUrl: string;
  isReacted: number;
  isUpdated: number;
  totalReactions: number;
  createdAt: string;
}

interface ChatWindowProps {
  conversation: Conversation;
  userCurrent: UserProfile | null;
  onMessageChange: () => void;
  onConversationUpdateInfo: (updatedConversation: Conversation) => void;
  handleLeaveGroupUpdate: (updatedConversation: Conversation) => void;
  handleConversationDeleted: () => void;
  onFowardMessage: (idConversation: string) => void;
}

interface ConversationMembers {
  _id: string;
  user: {
    _id: string;
    displayName: string;
    avatarUrl: string;
  };
  isOwner: number;
}

interface Friends {
  _id: string;
  status: number;
  friend: {
    _id: string;
    displayName: string;
    avatarUrl: string;
    lastLogin: string;
  };
  conversation: {
    _id: string;
  };
}

export type {
  Conversation,
  Message,
  ChatWindowProps,
  ConversationMembers,
  Friends,
  UserProfile,
};
