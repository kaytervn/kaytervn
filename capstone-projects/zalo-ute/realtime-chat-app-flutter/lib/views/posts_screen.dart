import 'package:cms_chat_app/components/post_list.dart';
import 'package:cms_chat_app/components/tabbar.dart';
import 'package:cms_chat_app/models/post.dart';
import 'package:cms_chat_app/services/post_service.dart';
import 'package:flutter/material.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';

class PostScreen extends StatefulWidget {
  final Color primaryColor;
  final Color secondaryColor;

  const PostScreen({
    Key? key,
    this.primaryColor = const Color(0xFF1565C0),
    this.secondaryColor = const Color(0xFF1E88E5),
  }) : super(key: key);

  @override
  _PostScreenState createState() => _PostScreenState();
}

class _PostScreenState extends State<PostScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  static const _pageSize = 5;

  final PagingController<int, Post> _pendingPagingController =
      PagingController(firstPageKey: 0);
  final PagingController<int, Post> _acceptedPagingController =
      PagingController(firstPageKey: 0);
  final PagingController<int, Post> _rejectedPagingController =
      PagingController(firstPageKey: 0);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _pendingPagingController.addPageRequestListener((pageKey) {
      _fetchPage(pageKey, 1);
    });
    _acceptedPagingController.addPageRequestListener((pageKey) {
      _fetchPage(pageKey, 2);
    });
    _rejectedPagingController.addPageRequestListener((pageKey) {
      _fetchPage(pageKey, 3);
    });
  }

  Future<void> _fetchPage(int pageKey, int status) async {
    final response = await PostService().list(status, pageKey, _pageSize);
    final data = response.data['content'] as List<dynamic>;
    final items = data.map((json) => Post.fromJson(json)).toList();
    final isLastPage = items.length < _pageSize;
    final pagingController = status == 1
        ? _pendingPagingController
        : status == 2
            ? _acceptedPagingController
            : _rejectedPagingController;

    if (isLastPage) {
      pagingController.appendLastPage(items);
    } else {
      pagingController.appendPage(items, pageKey + 1);
    }
  }

  void refreshPagingController() {
    _pendingPagingController.refresh();
    _acceptedPagingController.refresh();
    _rejectedPagingController.refresh();
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
                  ['Đang chờ', 'Chấp nhận', 'Từ chối'],
                  context,
                  20),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    buildPostList(_pendingPagingController, widget.primaryColor,
                        widget.secondaryColor, refreshPagingController),
                    buildPostList(
                        _acceptedPagingController,
                        widget.primaryColor,
                        widget.secondaryColor,
                        refreshPagingController),
                    buildPostList(
                        _rejectedPagingController,
                        widget.primaryColor,
                        widget.secondaryColor,
                        refreshPagingController),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    _pendingPagingController.dispose();
    _acceptedPagingController.dispose();
    _rejectedPagingController.dispose();
    super.dispose();
  }
}
