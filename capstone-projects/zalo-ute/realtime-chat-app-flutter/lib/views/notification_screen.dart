import 'package:cms_chat_app/components/confirmation_dialog.dart';
import 'package:cms_chat_app/components/custom_toast.dart';
import 'package:cms_chat_app/components/loading_container.dart';
import 'package:cms_chat_app/components/notification_list.dart';
import 'package:cms_chat_app/components/tabbar.dart';
import 'package:cms_chat_app/models/notification.dart';
import 'package:cms_chat_app/services/notification_service.dart';
import 'package:flutter/material.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';

class NotificationScreen extends StatefulWidget {
  final Color primaryColor;
  final Color secondaryColor;

  const NotificationScreen({
    Key? key,
    this.primaryColor = const Color(0xFF1565C0),
    this.secondaryColor = const Color(0xFF1E88E5),
  }) : super(key: key);

  @override
  _NotificationScreenState createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  static const _pageSize = 5;

  final PagingController<int, NotificationItem> _unreadPagingController =
      PagingController(firstPageKey: 0);
  final PagingController<int, NotificationItem> _readPagingController =
      PagingController(firstPageKey: 0);

  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _unreadPagingController.addPageRequestListener((pageKey) {
      _fetchPage(pageKey, 1);
    });
    _readPagingController.addPageRequestListener((pageKey) {
      _fetchPage(pageKey, 2);
    });
  }

  Future<void> _fetchPage(int pageKey, int status) async {
    try {
      final response =
          await NotificationService().list(status, pageKey, _pageSize);
      final data = response.data['content'] as List<dynamic>;
      final items =
          data.map((json) => NotificationItem.fromJson(json)).toList();
      final isLastPage = items.length < _pageSize;
      final pagingController =
          status == 1 ? _unreadPagingController : _readPagingController;

      if (isLastPage) {
        pagingController.appendLastPage(items);
      } else {
        pagingController.appendPage(items, pageKey + 1);
      }
    } catch (error) {
      _unreadPagingController.error = error;
    }
  }

  Future<void> _markAllAsRead() async {
    setState(() => _isLoading = true);
    final response = await NotificationService().readAll();
    if (response.result) {
      refreshPagingController();
      CustomToast.showSuccess(context, 'Đã đánh dấu tất cả là đã đọc');
    }
    setState(() => _isLoading = false);
  }

  Future<void> _deleteAll() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => ConfirmationDialog(
        title: "Xóa tất cả thông báo",
        message: "Bạn có chắc muốn xóa tất cả thông báo?",
        confirmText: "Xóa tất cả",
        color: Color(0xFFB71C1C),
        onConfirm: () => Navigator.pop(context, true),
        onCancel: () => Navigator.pop(context, false),
      ),
    );
    if (confirmed == true) {
      setState(() => _isLoading = true);
      final response = await NotificationService().deleteAll();
      if (response.result) {
        refreshPagingController();
        CustomToast.showSuccess(context, 'Đã xóa tất cả thông báo');
      }
      setState(() => _isLoading = false);
    }
  }

  void refreshPagingController() {
    _unreadPagingController.refresh();
    _readPagingController.refresh();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Stack(
        children: [
          Column(
            children: [
              buildTabBarContainer(widget.primaryColor, widget.secondaryColor,
                  _tabController, ['Chưa đọc', 'Đã đọc'], context, 65),
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        icon: Icon(Icons.done_all, color: widget.primaryColor),
                        label: Text(
                          'Đánh dấu tất cả đã đọc',
                          style: TextStyle(color: widget.primaryColor),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          elevation: 2,
                          padding: EdgeInsets.symmetric(vertical: 12),
                        ),
                        onPressed: _isLoading ? null : _markAllAsRead,
                      ),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        icon: Icon(Icons.delete_sweep, color: Colors.red),
                        label: Text(
                          'Xóa tất cả',
                          style: TextStyle(color: Colors.red),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          elevation: 2,
                          padding: EdgeInsets.symmetric(vertical: 12),
                        ),
                        onPressed: _isLoading ? null : _deleteAll,
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    buildNotificationList(
                        _unreadPagingController,
                        1,
                        widget.primaryColor,
                        widget.secondaryColor,
                        refreshPagingController),
                    buildNotificationList(
                        _readPagingController,
                        2,
                        widget.primaryColor,
                        widget.secondaryColor,
                        refreshPagingController),
                  ],
                ),
              ),
            ],
          ),
          if (_isLoading) buidLoadingContainer(widget.primaryColor),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    _unreadPagingController.dispose();
    _readPagingController.dispose();
    super.dispose();
  }
}
