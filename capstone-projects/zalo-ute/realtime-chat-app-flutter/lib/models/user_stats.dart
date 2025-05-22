class UserStats {
  final Roles roles;
  final Users users;
  final Notifications notifications;
  final BirthDates birthDates;

  UserStats({
    required this.roles,
    required this.users,
    required this.notifications,
    required this.birthDates,
  });

  factory UserStats.fromJson(dynamic json) {
    return UserStats(
      roles: Roles.fromJson(json['roles']),
      users: Users.fromJson(json['users']),
      notifications: Notifications.fromJson(json['notifications']),
      birthDates: BirthDates.fromJson(json['birthDates']),
    );
  }
}

class Roles {
  final int user;
  final int manager;
  final int admin;

  Roles({
    required this.user,
    required this.manager,
    required this.admin,
  });

  factory Roles.fromJson(dynamic json) {
    return Roles(
      user: json['user'] as int,
      manager: json['manager'] as int,
      admin: json['admin'] as int,
    );
  }
}

class Users {
  final int active;
  final int inactive;
  final AvgDailyCount avgDailyCount;

  Users({
    required this.active,
    required this.inactive,
    required this.avgDailyCount,
  });

  factory Users.fromJson(dynamic json) {
    return Users(
      active: json['active'] as int,
      inactive: json['inactive'] as int,
      avgDailyCount: AvgDailyCount.fromJson(json['avgDailyCount']),
    );
  }

  int get total => active + inactive;
}

class AvgDailyCount {
  final double createdAt;
  final double lastLogin;

  AvgDailyCount({
    required this.createdAt,
    required this.lastLogin,
  });

  factory AvgDailyCount.fromJson(dynamic json) {
    return AvgDailyCount(
      createdAt: json['createdAt'] as double,
      lastLogin: json['lastLogin'] as double,
    );
  }
}

class Notifications {
  final Sent sent;
  final Read read;
  final double avgDailyCount;

  Notifications({
    required this.sent,
    required this.read,
    required this.avgDailyCount,
  });

  factory Notifications.fromJson(dynamic json) {
    return Notifications(
      sent: Sent.fromJson(json['sent']),
      read: Read.fromJson(json['read']),
      avgDailyCount: json['avgDailyCount'] as double,
    );
  }

  int get total => sent.total + read.total;
}

class Sent {
  final int info;
  final int success;
  final int fail;

  Sent({
    required this.info,
    required this.success,
    required this.fail,
  });

  factory Sent.fromJson(dynamic json) {
    return Sent(
      info: json['info'] as int,
      success: json['success'] as int,
      fail: json['fail'] as int,
    );
  }

  int get total => info + success + fail;
}

class Read {
  final int info;
  final int success;
  final int fail;

  Read({
    required this.info,
    required this.success,
    required this.fail,
  });

  factory Read.fromJson(Map<String, dynamic> json) {
    return Read(
      info: json['info'] as int,
      success: json['success'] as int,
      fail: json['fail'] as int,
    );
  }

  int get total => info + success + fail;
}

class BirthDates {
  final int jan;
  final int feb;
  final int mar;
  final int apr;
  final int may;
  final int jun;
  final int jul;
  final int aug;
  final int sep;
  final int oct;
  final int nov;
  final int dec;
  final int none;

  BirthDates({
    required this.jan,
    required this.feb,
    required this.mar,
    required this.apr,
    required this.may,
    required this.jun,
    required this.jul,
    required this.aug,
    required this.sep,
    required this.oct,
    required this.nov,
    required this.dec,
    required this.none,
  });

  factory BirthDates.fromJson(Map<String, dynamic> json) {
    return BirthDates(
      jan: json['jan'] as int,
      feb: json['feb'] as int,
      mar: json['mar'] as int,
      apr: json['apr'] as int,
      may: json['may'] as int,
      jun: json['jun'] as int,
      jul: json['jul'] as int,
      aug: json['aug'] as int,
      sep: json['sep'] as int,
      oct: json['oct'] as int,
      nov: json['nov'] as int,
      dec: json['dec'] as int,
      none: json['none'] as int,
    );
  }
}
