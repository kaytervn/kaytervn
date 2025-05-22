import 'package:cms_chat_app/components/confirmation_dialog.dart';
import 'package:cms_chat_app/components/custom_toast.dart';
import 'package:cms_chat_app/components/empty_box.dart';
import 'package:cms_chat_app/components/notification_card.dart';
import 'package:cms_chat_app/models/notification.dart';
import 'package:cms_chat_app/services/notification_service.dart';
import 'package:flutter/material.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';

Widget buildNotificationList(
    PagingController<int, NotificationItem> pagingController,
    int status,
    Color primaryColor,
    Color secondaryColor,
    Function onRefresh) {
  return RefreshIndicator(
    color: primaryColor,
    onRefresh: () async {
      pagingController.refresh();
    },
    child: PagedListView<int, NotificationItem>.separated(
      pagingController: pagingController,
      padding: EdgeInsets.all(16),
      separatorBuilder: (context, index) => SizedBox(height: 8),
      builderDelegate: PagedChildBuilderDelegate<NotificationItem>(
        noItemsFoundIndicatorBuilder: (context) =>
            Center(child: buidEmptyBox()),
        itemBuilder: (context, notification, index) => NotificationCard(
          notification: notification,
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
          onMarkAsRead: status == 1
              ? () async {
                  final response = await NotificationService().readOne(
                    notification.id,
                  );
                  if (response.result) {
                    CustomToast.showSuccess(context, 'Thao thác thành công');
                    onRefresh();
                  }
                }
              : null,
          onDelete: () async {
            final confirmed = await showDialog<bool>(
              context: context,
              builder: (context) => ConfirmationDialog(
                title: "Xóa thông báo",
                message: "Bạn có chắc muốn xóa thông báo này?",
                confirmText: "Xóa",
                color: Color(0xFFB71C1C),
                onConfirm: () => Navigator.pop(context, true),
                onCancel: () => Navigator.pop(context, false),
              ),
            );
            if (confirmed == true) {
              final response = await NotificationService().deleteOne(
                notification.id,
              );
              if (response.result) {
                CustomToast.showSuccess(context, 'Đã xóa thông báo');
                onRefresh();
              }
            }
          },
        ),
      ),
    ),
  );
}
