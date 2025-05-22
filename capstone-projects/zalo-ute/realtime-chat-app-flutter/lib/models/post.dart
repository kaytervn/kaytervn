class Post {
  final String id;
  final User user;
  final int kind;
  final String content;
  final List<String>? imageUrls;
  final int status;
  final String createdAt;
  final int totalComments;
  final int totalReactions;
  final int isOwner;
  final int isUpdated;
  final int isReacted;

  Post({
    required this.id,
    required this.user,
    required this.kind,
    required this.content,
    this.imageUrls,
    required this.status,
    required this.createdAt,
    required this.totalComments,
    required this.totalReactions,
    required this.isOwner,
    required this.isUpdated,
    required this.isReacted,
  });

  factory Post.fromJson(dynamic json) {
    return Post(
      id: json['_id'],
      user: User.fromJson(json['user']),
      kind: json['kind'],
      content: json['content'],
      imageUrls: (json['imageUrls'] != null &&
              (json['imageUrls'] is List) &&
              (json['imageUrls'] as List).isNotEmpty)
          ? List<String>.from(json['imageUrls'])
          : [],
      status: json['status'],
      createdAt: json['createdAt'],
      totalComments: json['totalComments'],
      totalReactions: json['totalReactions'],
      isOwner: json['isOwner'],
      isUpdated: json['isUpdated'],
      isReacted: json['isReacted'],
    );
  }
}

class User {
  final String id;
  final String displayName;
  final String? avatarUrl;
  final Role role;

  User({
    required this.id,
    required this.displayName,
    this.avatarUrl,
    required this.role,
  });

  factory User.fromJson(dynamic json) {
    return User(
      id: json['_id'],
      displayName: json['displayName'],
      avatarUrl: json['avatarUrl'],
      role: Role.fromJson(json['role']),
    );
  }
}

class Role {
  final String id;
  final String name;
  final int kind;

  Role({
    required this.id,
    required this.name,
    required this.kind,
  });

  factory Role.fromJson(dynamic json) {
    return Role(
      id: json['_id'],
      name: json['name'],
      kind: json['kind'],
    );
  }
}
