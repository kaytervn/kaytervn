class ConversationStats {
  final Friendships friendships;
  final Conversations conversations;
  final Messages messages;
  final MessageReactions messageReactions;
  final Stories stories;
  final StoryViews storyViews;

  ConversationStats({
    required this.friendships,
    required this.conversations,
    required this.messages,
    required this.messageReactions,
    required this.stories,
    required this.storyViews,
  });

  factory ConversationStats.fromJson(dynamic json) {
    return ConversationStats(
      friendships: Friendships.fromJson(json['friendships']),
      conversations: Conversations.fromJson(json['conversations']),
      messages: Messages.fromJson(json['messages']),
      messageReactions: MessageReactions.fromJson(json['messageReactions']),
      stories: Stories.fromJson(json['stories']),
      storyViews: StoryViews.fromJson(json['storyViews']),
    );
  }
}

class Friendships {
  final int pending;
  final int accepted;
  final double avgDailyCount;

  Friendships({
    required this.pending,
    required this.accepted,
    required this.avgDailyCount,
  });

  factory Friendships.fromJson(dynamic json) {
    return Friendships(
      pending: json['pending'] as int,
      accepted: json['accepted'] as int,
      avgDailyCount: json['avgDailyCount'] as double,
    );
  }

  int get total => pending + accepted;
}

class Conversations {
  final int private;
  final int group;
  final double avgDailyCount;

  Conversations({
    required this.private,
    required this.group,
    required this.avgDailyCount,
  });

  factory Conversations.fromJson(dynamic json) {
    return Conversations(
      private: json['private'] as int,
      group: json['group'] as int,
      avgDailyCount: json['avgDailyCount'] as double,
    );
  }

  int get total => private + group;
}

class Messages {
  final int total;
  final double avgDailyCount;

  Messages({
    required this.total,
    required this.avgDailyCount,
  });

  factory Messages.fromJson(dynamic json) {
    return Messages(
      total: json['total'] as int,
      avgDailyCount: json['avgDailyCount'] as double,
    );
  }
}

class MessageReactions {
  final int total;
  final double avgDailyCount;

  MessageReactions({
    required this.total,
    required this.avgDailyCount,
  });

  factory MessageReactions.fromJson(dynamic json) {
    return MessageReactions(
      total: json['total'] as int,
      avgDailyCount: json['avgDailyCount'] as double,
    );
  }
}

class Stories {
  final int total;
  final double avgDailyCount;

  Stories({
    required this.total,
    required this.avgDailyCount,
  });

  factory Stories.fromJson(dynamic json) {
    return Stories(
      total: json['total'] as int,
      avgDailyCount: json['avgDailyCount'] as double,
    );
  }
}

class StoryViews {
  final int total;
  final double avgDailyCount;

  StoryViews({
    required this.total,
    required this.avgDailyCount,
  });

  factory StoryViews.fromJson(dynamic json) {
    return StoryViews(
      total: json['total'] as int,
      avgDailyCount: json['avgDailyCount'] as double,
    );
  }
}
