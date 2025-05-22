import 'package:cms_chat_app/core/constants.dart';
import 'package:cms_chat_app/models/setting.dart';
import 'package:flutter/material.dart';

class SettingCard extends StatelessWidget {
  final Setting setting;
  final Color primaryColor;
  final Function(Setting setting) onUpdate;

  const SettingCard({
    Key? key,
    required this.setting,
    required this.primaryColor,
    required this.onUpdate,
  }) : super(key: key);

  Widget _buildToggleIcon() {
    return Icon(
      setting.value == 1 ? Icons.toggle_on : Icons.toggle_off,
      color: setting.value == 1 ? Colors.blue : Colors.grey,
      size: 36,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    setting.title,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: primaryColor,
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.edit, color: primaryColor),
                  onPressed: () async {
                    await onUpdate(setting);
                  },
                ),
              ],
            ),
            SizedBox(height: 8),
            Row(
              children: [
                if (setting.keyName == Constants.VERIFY_FRIEND_POSTS ||
                    setting.keyName == Constants.VERIFY_PUBLIC_POSTS)
                  _buildToggleIcon()
                else
                  Text(
                    setting.value.toString(),
                    style: TextStyle(
                      fontSize: 20,
                      color: Colors.black87,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                Spacer(),
                Text(
                  setting.updatedAt,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
