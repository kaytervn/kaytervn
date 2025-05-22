import 'package:cms_chat_app/components/confirmation_dialog.dart';
import 'package:cms_chat_app/components/rejection_dialog.dart';
import 'package:cms_chat_app/models/post.dart';
import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';

class PostCard extends StatelessWidget {
  final Post post;
  final Color primaryColor;
  final VoidCallback onApprove;
  final Function(String reason) onReject;
  final VoidCallback onDelete;

  const PostCard({
    Key? key,
    required this.post,
    required this.primaryColor,
    required this.onApprove,
    required this.onReject,
    required this.onDelete,
  }) : super(key: key);

  Widget _buildStatusTag() {
    Color backgroundColor;
    String text;
    IconData icon;

    switch (post.status) {
      case 1:
        backgroundColor = Colors.orange;
        text = 'Chờ duyệt';
        icon = Icons.pending_outlined;
        break;
      case 2:
        backgroundColor = Colors.green;
        text = 'Đã duyệt';
        icon = Icons.check_circle_outline;
        break;
      case 3:
        backgroundColor = Colors.red;
        text = 'Từ chối';
        icon = Icons.cancel_outlined;
        break;
      default:
        backgroundColor = Colors.grey;
        text = 'Không xác định';
        icon = Icons.help_outline;
    }

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: backgroundColor.withOpacity(0.1),
        border: Border.all(color: backgroundColor),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: backgroundColor),
          SizedBox(width: 4),
          Text(
            text,
            style: TextStyle(
              color: backgroundColor,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUserAvatar() {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: primaryColor.withOpacity(0.2),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: CircleAvatar(
        backgroundImage: post.user.avatarUrl != null
            ? NetworkImage(post.user.avatarUrl!)
            : AssetImage('assets/user_icon.png') as ImageProvider,
        radius: 24,
      ),
    );
  }

  void _showImageGallery(BuildContext context, int initialIndex) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: EdgeInsets.zero,
        child: Stack(
          children: [
            PhotoViewGallery.builder(
              scrollPhysics: BouncingScrollPhysics(),
              builder: (BuildContext context, int index) {
                return PhotoViewGalleryPageOptions(
                  imageProvider: NetworkImage(post.imageUrls![index]),
                  initialScale: PhotoViewComputedScale.contained,
                  heroAttributes: PhotoViewHeroAttributes(tag: "image_$index"),
                );
              },
              itemCount: post.imageUrls!.length,
              loadingBuilder: (context, event) => Center(
                child: CircularProgressIndicator(),
              ),
              pageController: PageController(initialPage: initialIndex),
              backgroundDecoration: BoxDecoration(color: Colors.black),
            ),
            Positioned(
              top: 16,
              right: 16,
              child: IconButton(
                icon: Icon(Icons.close, color: Colors.white),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImageCarousel(BuildContext context) {
    if (post.kind == 3) {
      return Container(
        height: 200,
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.lock, size: 48, color: Colors.grey),
              SizedBox(height: 8),
              Text(
                'Nội dung không khả dụng',
                style: TextStyle(color: Colors.grey[600]),
              ),
            ],
          ),
        ),
      );
    }

    if (post.imageUrls == null || post.imageUrls!.isEmpty) {
      return SizedBox.shrink();
    }

    return Stack(
      children: [
        CarouselSlider(
          items: post.imageUrls!.asMap().entries.map((entry) {
            int index = entry.key;
            String url = entry.value;
            return GestureDetector(
              onTap: () => _showImageGallery(context, index),
              child: Container(
                margin: EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 8,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.network(
                    url,
                    fit: BoxFit.cover,
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) return child;
                      return Center(child: CircularProgressIndicator());
                    },
                  ),
                ),
              ),
            );
          }).toList(),
          options: CarouselOptions(
            height: 250,
            enableInfiniteScroll: false,
            enlargeCenterPage: true,
            viewportFraction: 0.85,
          ),
        ),
        if (post.imageUrls!.length > 1)
          Positioned(
            bottom: 8,
            right: 8,
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.6),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '${post.imageUrls!.length} ảnh',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                ),
              ),
            ),
          ),
      ],
    );
  }

  IconData _getKindIcon() {
    switch (post.kind) {
      case 1:
        return Icons.public;
      case 2:
        return Icons.group;
      case 3:
        return Icons.lock;
      default:
        return Icons.help_outline;
    }
  }

  Widget _buildActionButtons(BuildContext context) {
    final buttonStyle = ElevatedButton.styleFrom(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
    );
    if (post.status == 1) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          ElevatedButton.icon(
            style: buttonStyle.copyWith(
              backgroundColor: MaterialStateProperty.all(Colors.red[400]),
              foregroundColor: MaterialStateProperty.all(Colors.white),
            ),
            onPressed: () => _showRejectDialogWithReason(context),
            icon: Icon(Icons.close),
            label: Text('Từ chối'),
          ),
          SizedBox(width: 12),
          ElevatedButton.icon(
            style: buttonStyle.copyWith(
              backgroundColor: MaterialStateProperty.all(Colors.green),
              foregroundColor: MaterialStateProperty.all(Colors.white),
            ),
            onPressed: () => _showConfirmationDialog(
              context,
              Colors.green,
              'Chấp nhận bài đăng',
              'Bạn có chắc chắn muốn chấp nhận bài đăng này?',
              'Duyệt',
              onApprove,
            ),
            icon: Icon(Icons.check),
            label: Text('Chấp nhận'),
          ),
        ],
      );
    } else {
      return Align(
        alignment: Alignment.centerRight,
        child: ElevatedButton.icon(
          style: buttonStyle.copyWith(
            backgroundColor: MaterialStateProperty.all(Colors.red),
            foregroundColor: MaterialStateProperty.all(Colors.white),
          ),
          onPressed: () => _showConfirmationDialog(
            context,
            Colors.red,
            'Xóa bài đăng',
            'Bạn có chắc chắn muốn xóa bài đăng này?',
            'Xóa',
            onDelete,
          ),
          icon: Icon(Icons.delete_outline),
          label: Text('Xóa'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      margin: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: primaryColor.withOpacity(0.1),
            width: 1,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildUserAvatar(),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                post.user.displayName,
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            Icon(
                              _getKindIcon(),
                              color: primaryColor,
                              size: 20,
                            ),
                          ],
                        ),
                        SizedBox(height: 4),
                        Text(
                          post.createdAt,
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                        SizedBox(height: 8),
                        _buildStatusTag(),
                      ],
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16),
              Text(
                post.kind == 3 ? 'Nội dung không khả dụng' : post.content,
                style: TextStyle(
                  fontSize: 16,
                  height: 1.5,
                  fontStyle:
                      post.kind == 3 ? FontStyle.italic : FontStyle.normal,
                ),
              ),
              SizedBox(height: 16),
              _buildImageCarousel(context),
              SizedBox(height: 16),
              Divider(height: 1),
              SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.comment_outlined,
                      color: Colors.grey[600], size: 20),
                  SizedBox(width: 4),
                  Text(
                    post.totalComments.toString(),
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  SizedBox(width: 16),
                  Icon(Icons.favorite_border,
                      color: Colors.grey[600], size: 20),
                  SizedBox(width: 4),
                  Text(
                    post.totalReactions.toString(),
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  if (post.isUpdated == 1) ...[
                    Spacer(),
                    Text(
                      'Đã chỉnh sửa',
                      style: TextStyle(
                        fontSize: 12,
                        fontStyle: FontStyle.italic,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ],
              ),
              SizedBox(height: 16),
              _buildActionButtons(context),
            ],
          ),
        ),
      ),
    );
  }

  void _showConfirmationDialog(
    BuildContext context,
    Color color,
    String title,
    String message,
    String confirmText,
    VoidCallback onConfirm,
  ) {
    showDialog(
      context: context,
      builder: (context) => ConfirmationDialog(
        title: title,
        message: message,
        onConfirm: () {
          Navigator.of(context).pop();
          onConfirm();
        },
        onCancel: () => Navigator.of(context).pop(),
        confirmText: confirmText,
        color: color,
      ),
    );
  }

  void _showRejectDialogWithReason(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return RejectionDialog(
          title: 'Từ chối',
          message: 'Nhập lý do từ chối bài viết này',
          confirmText: 'Từ chối',
          color: Colors.red,
          onConfirm: (String reason) {
            Navigator.of(context).pop();
            onReject(reason);
          },
          onCancel: () {
            Navigator.of(context).pop();
          },
        );
      },
    );
  }
}
