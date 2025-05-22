import 'dart:io';
import 'package:cms_chat_app/components/custom_toast.dart';
import 'package:cms_chat_app/components/input_field_2.dart';
import 'package:cms_chat_app/core/validators.dart';
import 'package:cms_chat_app/models/response_dto.dart';
import 'package:cms_chat_app/models/profile.dart';
import 'package:cms_chat_app/services/file_service.dart';
import 'package:cms_chat_app/services/user_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';

class UpdateProfileScreen extends StatefulWidget {
  final Profile profile;
  final Color primaryColor;
  final Color secondaryColor;

  UpdateProfileScreen({
    Key? key,
    required this.profile,
    this.primaryColor = const Color(0xFF1565C0),
    this.secondaryColor = const Color(0xFF1E88E5),
  }) : super(key: key);

  @override
  _UpdateProfileScreenState createState() => _UpdateProfileScreenState();
}

class _UpdateProfileScreenState extends State<UpdateProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _displayNameController = TextEditingController();
  final TextEditingController _birthDateController = TextEditingController();
  final TextEditingController _bioController = TextEditingController();
  final TextEditingController _currentPasswordController =
      TextEditingController();
  final TextEditingController _newPasswordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  bool _showPassword = false;
  String? _avatarUrl;
  File? _imageFile;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _displayNameController.text = widget.profile.displayName;
    _bioController.text = widget.profile.bio!;
    _avatarUrl = widget.profile.avatarUrl;
    if (widget.profile.birthDate != null) {
      _birthDateController.text = widget.profile.birthDate!.substring(0, 10);
    }
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);

    if (image != null) {
      setState(() {
        _imageFile = File(image.path);
      });
    }
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _birthDateController.text.isNotEmpty
          ? DateFormat('dd/MM/yyyy').parse(_birthDateController.text)
          : DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );

    if (picked != null) {
      setState(() {
        _birthDateController.text = DateFormat('dd/MM/yyyy').format(picked);
      });
    }
  }

  Future<void> _handleSubmit() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });
      String? uploadedAvatarUrl = _avatarUrl;
      if (_imageFile != null) {
        uploadedAvatarUrl = await FileService().upload(_imageFile!);
      }
      final Map<String, dynamic> data = {
        'displayName': _displayNameController.text,
        'bio': _bioController.text,
        'avatarUrl': uploadedAvatarUrl,
        'birthDate': _birthDateController.text.isNotEmpty
            ? "${_birthDateController.text} 07:00:00".toString()
            : null,
      };
      if (_showPassword) {
        data['currentPassword'] = _currentPasswordController.text;
        data['newPassword'] = _newPasswordController.text;
      }
      ResponseDto dto = await UserService().updateProfile(
        data['displayName'],
        data['birthDate'],
        data['bio'],
        data['avatarUrl'],
        data['currentPassword'],
        data['newPassword'],
      );
      setState(() {
        _isLoading = false;
      });
      if (dto.result) {
        CustomToast.showSuccess(context, "Cập nhật hồ sơ thành công");
        Navigator.pop(context, true);
      } else {
        CustomToast.showError(context, dto.message);
      }
    } else {
      CustomToast.showError(context, "Vui lòng kiểm tra lại thông tin");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: widget.secondaryColor,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.arrow_back_ios_new,
              color: Colors.white,
              size: 20,
            ),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Cập nhật hồ sơ',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
          ),
        ),
        systemOverlayStyle: SystemUiOverlayStyle.light,
      ),
      body: Stack(
        children: [
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  widget.primaryColor,
                  widget.secondaryColor,
                ],
              ),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  const SizedBox(height: 20),
                  Hero(
                    tag: 'profile-image',
                    child: GestureDetector(
                      onTap: _pickImage,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Container(
                            width: 120,
                            height: 120,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 4),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  blurRadius: 20,
                                  offset: const Offset(0, 10),
                                ),
                              ],
                            ),
                            child: CircleAvatar(
                              radius: 56,
                              backgroundColor: Colors.white,
                              backgroundImage: _imageFile != null
                                  ? FileImage(_imageFile!) as ImageProvider
                                  : (_avatarUrl != null
                                      ? NetworkImage(_avatarUrl!)
                                      : AssetImage('assets/user_icon.png')),
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: widget.secondaryColor,
                                shape: BoxShape.circle,
                                border:
                                    Border.all(color: Colors.white, width: 2),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.2),
                                    blurRadius: 10,
                                  ),
                                ],
                              ),
                              child: const Icon(
                                Icons.camera_alt,
                                color: Colors.white,
                                size: 20,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 30),
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Form(
                      key: _formKey,
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          children: [
                            buildInputField(
                              color: widget.primaryColor,
                              controller: _displayNameController,
                              label: 'Tên hiển thị',
                              icon: Icons.person,
                              validator: (value) {
                                return Validators.validateField(value);
                              },
                            ),
                            const SizedBox(height: 20),
                            GestureDetector(
                              onTap: _selectDate,
                              child: buildInputField(
                                color: widget.primaryColor,
                                controller: _birthDateController,
                                label: 'Ngày sinh',
                                icon: Icons.calendar_today,
                                enabled: false,
                              ),
                            ),
                            const SizedBox(height: 20),
                            buildInputField(
                              color: widget.primaryColor,
                              controller: _bioController,
                              label: 'Tiểu sử',
                              icon: Icons.info,
                            ),
                            const SizedBox(height: 20),
                            _buildPasswordSection(),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 30),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _handleSubmit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: widget.primaryColor,
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        minimumSize: const Size(double.infinity, 54),
                        elevation: 8,
                        shadowColor: widget.primaryColor.withOpacity(0.5),
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor:
                                    AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : const Text(
                              'CẬP NHẬT',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.5,
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordSection() {
    return AnimatedSize(
      duration: const Duration(milliseconds: 300),
      child: Column(
        children: [
          SwitchListTile(
            title: const Text('Đổi mật khẩu'),
            value: _showPassword,
            onChanged: (value) {
              setState(() {
                _showPassword = value;
                if (!value) {
                  _currentPasswordController.clear();
                  _newPasswordController.clear();
                  _confirmPasswordController.clear();
                }
              });
            },
            activeColor: widget.primaryColor,
          ),
          if (_showPassword) ...[
            const SizedBox(height: 20),
            buildInputField(
              color: widget.primaryColor,
              isPassword: true,
              icon: Icons.lock,
              controller: _currentPasswordController,
              label: 'Mật khẩu hiện tại',
              validator: (value) {
                return Validators.validatePassword(value);
              },
            ),
            const SizedBox(height: 20),
            buildInputField(
              color: widget.primaryColor,
              isPassword: true,
              icon: Icons.lock,
              controller: _newPasswordController,
              label: 'Mật khẩu mới',
              validator: (value) {
                return Validators.validatePassword(value);
              },
            ),
            const SizedBox(height: 20),
            buildInputField(
              color: widget.primaryColor,
              isPassword: true,
              icon: Icons.verified_user,
              controller: _confirmPasswordController,
              label: 'Xác nhận mật khẩu mới',
              validator: (value) {
                return Validators.validateConfirmPassword(
                    _newPasswordController.text, value);
              },
            ),
          ],
        ],
      ),
    );
  }
}
