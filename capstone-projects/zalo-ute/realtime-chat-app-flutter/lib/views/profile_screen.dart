import 'package:cms_chat_app/components/button.dart';
import 'package:cms_chat_app/components/confirmation_dialog.dart';
import 'package:cms_chat_app/components/info_item.dart';
import 'package:cms_chat_app/components/info_section.dart';
import 'package:cms_chat_app/models/response_dto.dart';
import 'package:cms_chat_app/models/profile.dart';
import 'package:cms_chat_app/services/user_service.dart';
import 'package:cms_chat_app/views/login_screen.dart';
import 'package:cms_chat_app/views/update_profile_screen.dart';
import 'package:flutter/material.dart';

class ProfileScreen extends StatefulWidget {
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Profile? _profile;
  final _userService = UserService();

  @override
  void initState() {
    super.initState();
    _fetchProfileData();
  }

  Future<void> _fetchProfileData() async {
    ResponseDto dto = await _userService.getProfile();
    setState(() {
      _profile = Profile.fromJson(dto.data);
    });
  }

  void _navigateToEditProfile() async {
    final updated = await Navigator.push(
      context,
      MaterialPageRoute(
          builder: (context) => UpdateProfileScreen(profile: _profile!)),
    );
    if (updated == true) {
      _fetchProfileData();
    }
  }

  void _logout() async {
    await _userService.logout();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_profile == null) {
      return Center(
          child: CircularProgressIndicator(
        color: Color(0xFF1565C0),
      ));
    } else {
      return Container(
        color: Colors.white,
        child: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                color: Color(0xFF1E88E5),
                width: double.infinity,
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      children: [
                        Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Colors.white,
                              width: 4,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black26,
                                blurRadius: 10,
                                offset: Offset(0, 5),
                              ),
                            ],
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(60),
                            child: _profile!.avatarUrl != null
                                ? Image.network(
                                    _profile!.avatarUrl!,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) {
                                      return Container(
                                        color: Colors.grey[200],
                                        child: Icon(
                                          Icons.person,
                                          size: 60,
                                          color: Colors.grey[400],
                                        ),
                                      );
                                    },
                                  )
                                : Image.asset(
                                    'assets/user_icon.png',
                                    fit: BoxFit.cover,
                                  ),
                          ),
                        ),
                        SizedBox(height: 16),
                        Text(
                          _profile!.displayName,
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 8),
                      ],
                    ),
                  ),
                ),
              ),
              Container(
                padding: EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    buildInfoSection(
                      'Thông tin cá nhân',
                      [
                        buildInfoItem(
                          Icons.email_outlined,
                          'Email',
                          _profile!.email,
                        ),
                        buildInfoItem(
                          Icons.badge_outlined,
                          'Mã sinh viên',
                          _profile!.studentId,
                        ),
                        buildInfoItem(
                          Icons.phone_outlined,
                          'Số điện thoại',
                          _profile!.phone,
                        ),
                        buildInfoItem(
                          Icons.cake_outlined,
                          'Ngày sinh',
                          _profile!.birthDate != null
                              ? _profile!.birthDate!.substring(0, 10)
                              : 'Chưa cập nhật',
                          italic: _profile!.birthDate == null,
                        ),
                        buildInfoItem(
                          Icons.info_outline,
                          'Tiểu sử',
                          _profile!.bio ?? 'Chưa cập nhật',
                          italic: _profile!.bio == null,
                        ),
                        buildInfoItem(
                          Icons.verified_user_outlined,
                          'Vai trò',
                          _profile!.role.name,
                        ),
                        SizedBox(height: 30),
                        Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              buildButton(
                                onPressed: _navigateToEditProfile,
                                buttonText: "CẬP NHẬT THÔNG TIN",
                                backgroundColor: Color(0xFF1565C0),
                                foregroundColor: Colors.white,
                              ),
                              SizedBox(height: 20),
                              TextButton(
                                onPressed: () {
                                  showDialog(
                                    context: context,
                                    builder: (context) => ConfirmationDialog(
                                      title: "Đăng xuất",
                                      message:
                                          "Bạn có chắc chắn muốn đăng xuất?",
                                      confirmText: "Đăng xuất",
                                      color: Color(0xFFB71C1C),
                                      onConfirm: () {
                                        Navigator.of(context).pop();
                                        _logout();
                                      },
                                      onCancel: () =>
                                          Navigator.of(context).pop(),
                                    ),
                                  );
                                },
                                child: Text(
                                  'Đăng xuất',
                                  style: TextStyle(
                                      color: Color(0xFFB71C1C),
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                        )
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    }
  }
}
