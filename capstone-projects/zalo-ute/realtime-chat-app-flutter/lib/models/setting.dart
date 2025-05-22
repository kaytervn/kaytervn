class Setting {
  final String id;
  final String title;
  final String keyName;
  final int value;
  final String updatedAt;

  Setting({
    required this.id,
    required this.title,
    required this.keyName,
    required this.value,
    required this.updatedAt,
  });

  factory Setting.fromJson(dynamic json) {
    return Setting(
      id: json['_id'],
      title: json['title'],
      keyName: json['keyName'],
      value: json['value'],
      updatedAt: json['updatedAt'],
    );
  }
}
