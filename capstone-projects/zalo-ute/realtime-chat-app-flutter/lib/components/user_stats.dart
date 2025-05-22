import 'package:cms_chat_app/components/center_loading.dart';
import 'package:cms_chat_app/components/charts.dart';
import 'package:cms_chat_app/components/custom_card.dart';
import 'package:cms_chat_app/models/user_stats.dart';
import 'package:cms_chat_app/services/statistic_service.dart';
import 'package:flutter/material.dart';

class UserStatWidget extends StatefulWidget {
  @override
  State<UserStatWidget> createState() => _UserStatWidgetState();
}

class _UserStatWidgetState extends State<UserStatWidget> {
  UserStats? _userStats;

  @override
  void initState() {
    super.initState();
    _fetcData();
  }

  Future<void> _fetcData() async {
    final dto = await StatisticService().userStats();
    setState(() {
      _userStats = UserStats.fromJson(dto.data);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_userStats == null) {
      return buildCenterLoading();
    } else {
      return Container(
          color: Colors.grey[100],
          child: SingleChildScrollView(
              child: Column(children: [
            SizedBox(height: 20),
            buildCustomCard(
                Icons.supervisor_account_outlined,
                Colors.green[300],
                "Tổng số người dùng",
                (_userStats!.users.total).toDouble(),
                'Trung bình mới: ${_userStats!.users.avgDailyCount.createdAt}/ngày\nTrung bình truy cập: ${_userStats!.users.avgDailyCount.lastLogin}/ngày'),
            SizedBox(height: 20),
            buildCustomCard(
                Icons.notifications_active_outlined,
                Colors.purple[300],
                "Số lượng thông báo",
                (_userStats!.notifications.total).toDouble(),
                'Trung bình: ${_userStats!.notifications.avgDailyCount}/ngày\nTỷ lệ tương tác: ${(_userStats!.notifications.sent.total / _userStats!.notifications.read.total).toStringAsFixed(2)}%'),
            SizedBox(height: 20),
            buildChartCard(
              "Phân bố vai trò",
              buildPieChart([
                {
                  'title': 'Người dùng',
                  'value': _userStats!.roles.user.toDouble(),
                  'color': Colors.red[300],
                },
                {
                  'title': 'Quản lý',
                  'value': _userStats!.roles.manager.toDouble(),
                  'color': Colors.green[300],
                },
                {
                  'title': 'Quản trị viên',
                  'value': _userStats!.roles.admin.toDouble(),
                  'color': Colors.blue[300],
                },
              ], Colors.grey),
            ),
            SizedBox(height: 20),
            buildChartCard(
              "Phân bố sinh nhật",
              buildLineChart(
                [
                  {'x': 0.0, 'y': _userStats!.birthDates.none.toDouble()},
                  {'x': 1.0, 'y': _userStats!.birthDates.jan.toDouble()},
                  {'x': 2.0, 'y': _userStats!.birthDates.feb.toDouble()},
                  {'x': 3.0, 'y': _userStats!.birthDates.mar.toDouble()},
                  {'x': 4.0, 'y': _userStats!.birthDates.apr.toDouble()},
                  {'x': 5.0, 'y': _userStats!.birthDates.may.toDouble()},
                  {'x': 6.0, 'y': _userStats!.birthDates.jun.toDouble()},
                  {'x': 7.0, 'y': _userStats!.birthDates.jul.toDouble()},
                  {'x': 8.0, 'y': _userStats!.birthDates.aug.toDouble()},
                  {'x': 9.0, 'y': _userStats!.birthDates.sep.toDouble()},
                  {'x': 10.0, 'y': _userStats!.birthDates.oct.toDouble()},
                  {'x': 11.0, 'y': _userStats!.birthDates.nov.toDouble()},
                  {'x': 12.0, 'y': _userStats!.birthDates.dec.toDouble()},
                ],
                Colors.cyan[800]!,
                [
                  'None',
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
              ),
            ),
            SizedBox(height: 20),
          ])));
    }
  }
}
