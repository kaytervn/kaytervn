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
      id: json['_id'] as String,
      name: json['name'] as String,
      kind: json['kind'] as int,
    );
  }
}

class Profile {
  final String id;
  final String displayName;
  final String? avatarUrl;
  final String email;
  final String studentId;
  final String phone;
  final String? birthDate;
  final String? bio;
  final Role role;

  Profile({
    required this.id,
    required this.displayName,
    this.avatarUrl,
    required this.email,
    required this.studentId,
    required this.phone,
    this.birthDate,
    this.bio,
    required this.role,
  });

  factory Profile.fromJson(dynamic json) {
    return Profile(
      id: json['_id'] as String,
      displayName: json['displayName'] as String,
      avatarUrl: json['avatarUrl'] as String?,
      email: json['email'] as String,
      studentId: json['studentId'] as String,
      phone: json['phone'] as String,
      birthDate: json['birthDate'] as String?,
      bio: json['bio'] as String?,
      role: Role.fromJson(json['role'] as dynamic),
    );
  }
}
