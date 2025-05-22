class NotificationItem {
  final String id;
  final int status;
  final int kind;
  final String message;
  final dynamic data;
  final String createdAt;

  NotificationItem({
    required this.id,
    required this.status,
    required this.kind,
    required this.message,
    this.data,
    required this.createdAt,
  });

  factory NotificationItem.fromJson(Map<String, dynamic> json) {
    return NotificationItem(
      id: json['_id'],
      status: json['status'],
      kind: json['kind'],
      message: json['message'],
      data: json['data'],
      createdAt: json['createdAt'],
    );
  }
}
