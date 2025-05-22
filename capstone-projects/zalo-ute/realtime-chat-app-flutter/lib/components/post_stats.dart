import 'package:cms_chat_app/components/center_loading.dart';
import 'package:cms_chat_app/components/charts.dart';
import 'package:cms_chat_app/components/custom_card.dart';
import 'package:cms_chat_app/models/post_stats.dart';
import 'package:cms_chat_app/services/statistic_service.dart';
import 'package:flutter/material.dart';

class PostStatWidget extends StatefulWidget {
  @override
  State<PostStatWidget> createState() => _PostStatWidgetState();
}

class _PostStatWidgetState extends State<PostStatWidget> {
  PostStats? _postStats;

  @override
  void initState() {
    super.initState();
    _fetcData();
  }

  Future<void> _fetcData() async {
    final dto = await StatisticService().postStats();
    setState(() {
      _postStats = PostStats.fromJson(dto.data);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_postStats == null) {
      return buildCenterLoading();
    } else {
      return Container(
          color: Colors.grey[100],
          child: SingleChildScrollView(
              child: Column(children: [
            SizedBox(height: 20),
            buildCustomCard(
                Icons.send_rounded,
                Colors.purple[300],
                "Tổng số bài viết",
                (_postStats!.posts.total).toDouble(),
                'Trung bình: ${_postStats!.posts.avgDailyCount}/ngày\nTỷ lệ cập nhật: ${_postStats!.posts.updateRate.toStringAsFixed(2)}%'),
            SizedBox(height: 20),
            buildCustomCard(
                Icons.thumb_up_outlined,
                Colors.blue[300],
                "Lượt thích bài đăng",
                (_postStats!.postReactions.total).toDouble(),
                'Trung bình: ${_postStats!.postReactions.avgDailyCount}/ngày'),
            SizedBox(height: 20),
            buildCustomCard(
                Icons.message_rounded,
                Colors.green[300],
                "Bình luận",
                (_postStats!.comments.total).toDouble(),
                'Trung bình: ${_postStats!.comments.avgDailyCount}/ngày'),
            SizedBox(height: 20),
            buildCustomCard(
                Icons.star_rate_outlined,
                Colors.orange[300],
                "Lượt thích bình luận",
                (_postStats!.commentReactions.total).toDouble(),
                'Trung bình: ${_postStats!.commentReactions.avgDailyCount}/ngày'),
            SizedBox(height: 20),
            buildChartCard(
              "Tỷ lệ xét duyệt bài viết",
              buildPieChart([
                {
                  'title': 'Chờ duyệt',
                  'value': _postStats!.posts.pending.toDouble(),
                  'color': Colors.orange[300],
                },
                {
                  'title': 'Chấp nhận',
                  'value': _postStats!.posts.accepted.toDouble(),
                  'color': Colors.green[300],
                },
                {
                  'title': 'Từ chối',
                  'value': _postStats!.posts.rejected.toDouble(),
                  'color': Colors.red[300],
                },
              ], Colors.grey),
            ),
            SizedBox(height: 20),
            buildChartCard(
              "Phân loại bài viết",
              buildPieChart([
                {
                  'title': 'Công khai',
                  'value': _postStats!.posts.totalPublic.toDouble(),
                  'color': Colors.blue[500],
                },
                {
                  'title': 'Bạn bè',
                  'value': _postStats!.posts.totalFriend.toDouble(),
                  'color': Colors.green[500],
                },
                {
                  'title': 'Riêng tư',
                  'value': _postStats!.posts.totalPrivate.toDouble(),
                  'color': Colors.red[500],
                },
              ], Colors.grey),
            ),
            SizedBox(height: 20),
          ])));
    }
  }
}
