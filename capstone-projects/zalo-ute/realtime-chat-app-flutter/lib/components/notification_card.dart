import 'package:cms_chat_app/models/notification.dart';
import 'package:flutter/material.dart';

class NotificationCard extends StatelessWidget {
  final NotificationItem notification;
  final Color primaryColor;
  final Color secondaryColor;
  final VoidCallback? onMarkAsRead;
  final VoidCallback onDelete;

  const NotificationCard({
    Key? key,
    required this.notification,
    required this.primaryColor,
    required this.secondaryColor,
    this.onMarkAsRead,
    required this.onDelete,
  }) : super(key: key);

  IconData _getKindIcon() {
    switch (notification.kind) {
      case 1:
        return Icons.info_outline;
      case 2:
        return Icons.check_circle_outline;
      case 3:
        return Icons.error_outline;
      default:
        return Icons.notifications_none;
    }
  }

  Color _getKindColor() {
    switch (notification.kind) {
      case 1:
        return primaryColor;
      case 2:
        return Colors.green;
      case 3:
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      elevation: 2,
      margin: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: notification.status == 2
              ? Colors.transparent
              : _getKindColor().withOpacity(0.3),
          width: 1,
        ),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                padding: EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: _getKindColor().withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  _getKindIcon(),
                  color: _getKindColor(),
                  size: 20,
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      notification.message,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: notification.status == 2
                            ? FontWeight.normal
                            : FontWeight.w500,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      notification.createdAt,
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (onMarkAsRead != null && notification.status == 1)
                    IconButton(
                      icon: Icon(Icons.done, size: 20),
                      color: primaryColor,
                      tooltip: 'Đánh dấu đã đọc',
                      onPressed: onMarkAsRead,
                      constraints: BoxConstraints(
                        minWidth: 40,
                        minHeight: 40,
                      ),
                    ),
                  IconButton(
                    icon: Icon(Icons.delete_outline, size: 20),
                    color: Colors.red,
                    tooltip: 'Xóa',
                    onPressed: onDelete,
                    constraints: BoxConstraints(
                      minWidth: 40,
                      minHeight: 40,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
