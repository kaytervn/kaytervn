import 'package:cms_chat_app/components/background.dart';
import 'package:cms_chat_app/components/button.dart';
import 'package:cms_chat_app/components/custom_toast.dart';
import 'package:cms_chat_app/components/input_field.dart';
import 'package:cms_chat_app/core/validators.dart';
import 'package:cms_chat_app/models/response_dto.dart';
import 'package:cms_chat_app/services/loading_service.dart';
import 'package:cms_chat_app/services/user_service.dart';
import 'package:cms_chat_app/views/login_screen.dart';
import 'package:flutter/material.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String email;

  ResetPasswordScreen({required this.email});

  @override
  _ResetPasswordScreenState createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _otpController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  final _userService = UserService();

  @override
  void dispose() {
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _resetPassword() async {
    if (_formKey.currentState?.validate() ?? false) {
      String email = widget.email;
      String otp = _otpController.text;
      String newPassword = _newPasswordController.text;
      LoadingService.show();
      ResponseDto dto =
          await _userService.resetPassword(email, newPassword, otp);
      LoadingService.hide();
      if (dto.result) {
        CustomToast.showSuccess(context, "Đặt lại mật khẩu thành công");
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => LoginScreen(),
          ),
        );
      } else {
        CustomToast.showError(context, dto.message);
      }
    } else {
      CustomToast.showError(context, "Vui lòng kiểm tra lại thông tin");
    }
  }

  @override
  Widget build(BuildContext context) {
    LoadingService.init(context);
    return GradientBackground(
      title: "Quay lại đăng nhập",
      onBackPressed: () {
        Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => LoginScreen(),
            ));
      },
      children: [
        SizedBox(height: 50),
        Text(
          'Đặt Lại Mật Khẩu',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        SizedBox(height: 8),
        Text(
          'Kiểm tra email để lấy mã xác thực OTP',
          style: TextStyle(
            fontSize: 16,
            color: Colors.white.withOpacity(0.8),
          ),
        ),
        SizedBox(height: 20),
        Form(
          key: _formKey,
          child: Column(
            children: [
              buildInputField(
                  controller: _otpController,
                  label: 'OTP',
                  icon: Icons.lock,
                  validator: (value) {
                    return Validators.validateOtp(value);
                  },
                  keyboardType: TextInputType.number),
              SizedBox(height: 20),
              buildInputField(
                controller: _newPasswordController,
                label: 'Mật khẩu mới',
                icon: Icons.lock_outline,
                isPassword: true,
                validator: (value) {
                  return Validators.validatePassword(value);
                },
              ),
              SizedBox(height: 20),
              buildInputField(
                controller: _confirmPasswordController,
                label: 'Xác nhận mật khẩu',
                icon: Icons.lock_outline,
                isPassword: true,
                validator: (value) {
                  return Validators.validateConfirmPassword(
                      _newPasswordController.text, value);
                },
              ),
              SizedBox(height: 30),
              buildButton(
                onPressed: _resetPassword,
                buttonText: "GỬI",
              ),
            ],
          ),
        ),
      ],
    );
  }
}
