import 'package:cms_chat_app/components/conversation_stats.dart';
import 'package:cms_chat_app/components/loading_container.dart';
import 'package:cms_chat_app/components/post_stats.dart';
import 'package:cms_chat_app/components/tabbar.dart';
import 'package:cms_chat_app/components/user_stats.dart';
import 'package:flutter/material.dart';

class StatisticsScreen extends StatefulWidget {
  final Color primaryColor;
  final Color secondaryColor;

  const StatisticsScreen({
    Key? key,
    this.primaryColor = const Color(0xFF1565C0),
    this.secondaryColor = const Color(0xFF1E88E5),
  }) : super(key: key);

  @override
  _StatisticsScreenState createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
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
                ['Người dùng', 'Nhóm trò chuyện', 'Bài viết'],
                context,
                20,
              ),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    UserStatWidget(),
                    ConversationStatWidget(),
                    PostStatWidget(),
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
    super.dispose();
  }
}
