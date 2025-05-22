import 'package:cms_chat_app/components/custom_toast.dart';
import 'package:cms_chat_app/components/empty_box.dart';
import 'package:cms_chat_app/components/post_card.dart';
import 'package:cms_chat_app/models/post.dart';
import 'package:cms_chat_app/services/post_service.dart';
import 'package:flutter/material.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';

Widget buildPostList(PagingController<int, Post> pagingController,
    Color primaryColor, Color secondaryColor, Function onRefresh) {
  return RefreshIndicator(
    color: primaryColor,
    onRefresh: () async {
      pagingController.refresh();
    },
    child: PagedListView<int, Post>.separated(
      pagingController: pagingController,
      padding: EdgeInsets.all(16),
      separatorBuilder: (context, index) => SizedBox(height: 8),
      builderDelegate: PagedChildBuilderDelegate<Post>(
        noItemsFoundIndicatorBuilder: (context) =>
            Center(child: buidEmptyBox()),
        itemBuilder: (context, post, index) => PostCard(
            post: post,
            primaryColor: primaryColor,
            onReject: (String reason) async {
              final res = await PostService().changeState(post.id, 3, reason);
              if (res.result) {
                CustomToast.showSuccess(context, 'Đã từ chối bài viết');
                onRefresh();
              }
            },
            onDelete: () async {
              final res = await PostService().delete(post.id);
              if (res.result) {
                CustomToast.showSuccess(context, 'Xóa bài viết thành công');
                onRefresh();
              }
            },
            onApprove: () async {
              final res = await PostService().changeState(post.id, 2, null);
              if (res.result) {
                CustomToast.showSuccess(context, 'Đã chấp nhận bài viết');
                onRefresh();
              }
            }),
      ),
    ),
  );
}
