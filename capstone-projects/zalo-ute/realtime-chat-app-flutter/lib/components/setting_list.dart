import 'package:cms_chat_app/components/custom_toast.dart';
import 'package:cms_chat_app/components/edit_setting_dialog.dart';
import 'package:cms_chat_app/components/empty_box.dart';
import 'package:cms_chat_app/components/setting_card.dart';
import 'package:cms_chat_app/models/setting.dart';
import 'package:cms_chat_app/services/setting_service.dart';
import 'package:flutter/material.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';

Widget buildSettingList(
    BuildContext parentContext,
    PagingController<int, Setting> pagingController,
    Color primaryColor,
    Color secondaryColor,
    Function onRefresh) {
  return RefreshIndicator(
    color: primaryColor,
    onRefresh: () async {
      pagingController.refresh();
    },
    child: PagedListView<int, Setting>.separated(
      pagingController: pagingController,
      padding: EdgeInsets.all(16),
      separatorBuilder: (context, index) => SizedBox(height: 8),
      builderDelegate: PagedChildBuilderDelegate<Setting>(
        noItemsFoundIndicatorBuilder: (context) =>
            Center(child: buidEmptyBox()),
        itemBuilder: (context, setting, index) => SettingCard(
          setting: setting,
          primaryColor: primaryColor,
          onUpdate: (Setting setting) async {
            showDialog(
              context: parentContext,
              builder: (context) => EditSettingDialog(
                setting: setting,
                onUpdate: (String id, int value) async {
                  await SettingService().update(id, value);
                  CustomToast.showSuccess(parentContext, "Cập nhật thành công");
                  pagingController.refresh();
                },
              ),
            );
          },
        ),
      ),
    ),
  );
}
