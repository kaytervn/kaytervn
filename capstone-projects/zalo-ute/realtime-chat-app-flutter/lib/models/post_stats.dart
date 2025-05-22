class PostStats {
  final Posts posts;
  final PostReactions postReactions;
  final Comments comments;
  final CommentReactions commentReactions;

  PostStats({
    required this.posts,
    required this.postReactions,
    required this.comments,
    required this.commentReactions,
  });

  factory PostStats.fromJson(dynamic json) {
    return PostStats(
      posts: Posts.fromJson(json['posts']),
      postReactions: PostReactions.fromJson(json['postReactions']),
      comments: Comments.fromJson(json['comments']),
      commentReactions: CommentReactions.fromJson(json['commentReactions']),
    );
  }
}

class Posts {
  final Primal primal;
  final Updated updated;
  final int pending;
  final int accepted;
  final int rejected;
  final double avgDailyCount;

  Posts({
    required this.primal,
    required this.updated,
    required this.pending,
    required this.accepted,
    required this.rejected,
    required this.avgDailyCount,
  });

  factory Posts.fromJson(dynamic json) {
    return Posts(
      primal: Primal.fromJson(json['primal']),
      updated: Updated.fromJson(json['updated']),
      pending: json['pending'] as int,
      accepted: json['accepted'] as int,
      rejected: json['rejected'] as int,
      avgDailyCount: json['avgDailyCount'] as double,
    );
  }

  int get total => primal.total + updated.total;
  int get totalPublic => updated.public + primal.public;
  int get totalFriend => updated.friend + primal.friend;
  int get totalPrivate => updated.private + primal.private;
  double get updateRate => updated.total / total * 100;
}

class Primal {
  final int public;
  final int friend;
  final int private;

  Primal({
    required this.public,
    required this.friend,
    required this.private,
  });

  factory Primal.fromJson(dynamic json) {
    return Primal(
      public: json['public'] as int,
      friend: json['friend'] as int,
      private: json['private'] as int,
    );
  }

  int get total => public + friend + private;
}

class Updated {
  final int public;
  final int friend;
  final int private;

  Updated({
    required this.public,
    required this.friend,
    required this.private,
  });

  factory Updated.fromJson(dynamic json) {
    return Updated(
      public: json['public'] as int,
      friend: json['friend'] as int,
      private: json['private'] as int,
    );
  }

  int get total => public + friend + private;
}

class PostReactions {
  final int total;
  final double avgDailyCount;

  PostReactions({
    required this.total,
    required this.avgDailyCount,
  });

  factory PostReactions.fromJson(dynamic json) {
    return PostReactions(
      total: json['total'] as int,
      avgDailyCount: json['avgDailyCount'] as double,
    );
  }
}

class Comments {
  final int total;
  final double avgDailyCount;

  Comments({
    required this.total,
    required this.avgDailyCount,
  });

  factory Comments.fromJson(dynamic json) {
    return Comments(
      total: json['total'] as int,
      avgDailyCount: json['avgDailyCount'] as double,
    );
  }
}

class CommentReactions {
  final int total;
  final double avgDailyCount;

  CommentReactions({
    required this.total,
    required this.avgDailyCount,
  });

  factory CommentReactions.fromJson(dynamic json) {
    return CommentReactions(
      total: json['total'] as int,
      avgDailyCount: json['avgDailyCount'] as double,
    );
  }
}
