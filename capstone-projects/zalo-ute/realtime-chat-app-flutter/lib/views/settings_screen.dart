import 'package:cms_chat_app/components/loading_container.dart';
import 'package:cms_chat_app/components/setting_list.dart';
import 'package:cms_chat_app/components/tabbar.dart';
import 'package:cms_chat_app/models/setting.dart';
import 'package:cms_chat_app/services/setting_service.dart';
import 'package:flutter/material.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';

class SettingScreen extends StatefulWidget {
  final Color primaryColor;
  final Color secondaryColor;

  const SettingScreen({
    Key? key,
    this.primaryColor = const Color(0xFF1565C0),
    this.secondaryColor = const Color(0xFF1E88E5),
  }) : super(key: key);

  @override
  _SettingScreenState createState() => _SettingScreenState();
}

class _SettingScreenState extends State<SettingScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  static const _pageSize = 6;

  final PagingController<int, Setting> _usersPagingController =
      PagingController(firstPageKey: 0);
  final PagingController<int, Setting> _managersPagingController =
      PagingController(firstPageKey: 0);
  final PagingController<int, Setting> _adminsPagingController =
      PagingController(firstPageKey: 0);
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _usersPagingController.addPageRequestListener((pageKey) {
      _fetchPage(pageKey, 1);
    });
    _managersPagingController.addPageRequestListener((pageKey) {
      _fetchPage(pageKey, 2);
    });
    _adminsPagingController.addPageRequestListener((pageKey) {
      _fetchPage(pageKey, 3);
    });
  }

  Future<void> _fetchPage(int pageKey, int roleKind) async {
    final response = await SettingService().list(roleKind, pageKey, _pageSize);
    final data = response.data['content'] as List<dynamic>;
    final items = data.map((json) => Setting.fromJson(json)).toList();
    final isLastPage = items.length < _pageSize;
    final pagingController = roleKind == 1
        ? _usersPagingController
        : roleKind == 2
            ? _managersPagingController
            : _adminsPagingController;
    if (isLastPage) {
      pagingController.appendLastPage(items);
    } else {
      pagingController.appendPage(items, pageKey + 1);
    }
  }

  void refreshPagingController() {
    _usersPagingController.refresh();
    _managersPagingController.refresh();
    _adminsPagingController.refresh();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Stack(
        children: [
          Column(
            children: [
              buildTabBarContainer(
                  widget.primaryColor,
                  widget.secondaryColor,
                  _tabController,
                  ['Người dùng', 'Quản lý', 'Quản trị viên'],
                  context,
                  20),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    buildSettingList(
                        context,
                        _usersPagingController,
                        widget.primaryColor,
                        widget.secondaryColor,
                        refreshPagingController),
                    buildSettingList(
                        context,
                        _managersPagingController,
                        widget.primaryColor,
                        widget.secondaryColor,
                        refreshPagingController),
                    buildSettingList(
                        context,
                        _adminsPagingController,
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
    _usersPagingController.dispose();
    _managersPagingController.dispose();
    _adminsPagingController.dispose();
    super.dispose();
  }
}
