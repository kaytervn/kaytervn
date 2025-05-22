import 'package:cms_chat_app/components/center_loading.dart';
import 'package:cms_chat_app/components/charts.dart';
import 'package:cms_chat_app/components/custom_card.dart';
import 'package:cms_chat_app/models/conversation_stats.dart';
import 'package:cms_chat_app/services/statistic_service.dart';
import 'package:flutter/material.dart';

class ConversationStatWidget extends StatefulWidget {
  @override
  State<ConversationStatWidget> createState() => _ConversationStatWidgetState();
}

class _ConversationStatWidgetState extends State<ConversationStatWidget> {
  ConversationStats? _conversationStats;

  @override
  void initState() {
    super.initState();
    _fetcData();
  }

  Future<void> _fetcData() async {
    final dto = await StatisticService().conversationStats();
    setState(() {
      _conversationStats = ConversationStats.fromJson(dto.data);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_conversationStats == null) {
      return buildCenterLoading();
    } else {
      return Container(
          color: Colors.grey[100],
          child: SingleChildScrollView(
              child: Column(children: [
            SizedBox(height: 20),
            buildCustomCard(
                Icons.handshake_outlined,
                Colors.deepOrange[300],
                "Yêu cầu kết bạn",
                (_conversationStats!.friendships.total).toDouble(),
                'Trung bình: ${_conversationStats!.friendships.avgDailyCount}/ngày\nTỷ lệ tương tác: ${(_conversationStats!.friendships.accepted / _conversationStats!.friendships.pending).toStringAsFixed(2)}%'),
            SizedBox(height: 20),
            buildCustomCard(
                Icons.messenger_outline_outlined,
                Colors.blue[300],
                "Cuộc trò chuyện",
                (_conversationStats!.conversations.total).toDouble(),
                'Trung bình: ${_conversationStats!.conversations.avgDailyCount}/ngày\nNhóm: ${_conversationStats!.conversations.group} - Riêng: ${_conversationStats!.conversations.private}'),
            SizedBox(height: 20),
            buildCustomCard(
                Icons.thumb_up_off_alt_outlined,
                Colors.pink[300],
                "Lượt yêu thích tin nhắn",
                (_conversationStats!.messageReactions.total).toDouble(),
                'Trung bình: ${_conversationStats!.messageReactions.avgDailyCount}/ngày'),
            SizedBox(height: 20),
            buildChartCard(
              "Phân loại yêu cầu kết bạn",
              buildPieChart([
                {
                  'title': 'Đang chờ',
                  'value': _conversationStats!.friendships.pending.toDouble(),
                  'color': Colors.orange[300],
                },
                {
                  'title': 'Đã chấp nhận',
                  'value': _conversationStats!.friendships.accepted.toDouble(),
                  'color': Colors.green[300],
                },
              ], Colors.grey),
            ),
            SizedBox(height: 20),
            buildCustomCard(
                Icons.location_history_outlined,
                Colors.cyan[300],
                "Số lượng bản tin",
                (_conversationStats!.stories.total).toDouble(),
                'Trung bình: ${_conversationStats!.stories.avgDailyCount}/ngày'),
            SizedBox(height: 20),
            buildCustomCard(
                Icons.remove_red_eye_outlined,
                Colors.cyan[300],
                "Lượt xem bản tin",
                (_conversationStats!.messageReactions.total).toDouble(),
                'Trung bình: ${_conversationStats!.messageReactions.avgDailyCount}/ngày'),
            SizedBox(height: 20),
          ])));
    }
  }
}
