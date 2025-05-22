import 'package:cms_chat_app/components/background.dart';
import 'package:cms_chat_app/components/button.dart';
import 'package:cms_chat_app/components/custom_toast.dart';
import 'package:cms_chat_app/components/input_field.dart';
import 'package:cms_chat_app/core/validators.dart';
import 'package:cms_chat_app/models/response_dto.dart';
import 'package:cms_chat_app/services/loading_service.dart';
import 'package:cms_chat_app/services/user_service.dart';
import 'package:cms_chat_app/views/reset_password_screen.dart';
import 'package:flutter/material.dart';

class ForgotPasswordScreen extends StatefulWidget {
  @override
  _ForgotPasswordScreenState createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  final _userService = UserService();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_formKey.currentState?.validate() ?? false) {
      String email = _emailController.text;
      LoadingService.show();
      ResponseDto dto = await _userService.forgotPassword(email);
      LoadingService.hide();
      if (dto.result) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ResetPasswordScreen(email: email),
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
        Navigator.pop(context);
      },
      children: [
        SizedBox(height: 50),
        Text(
          'Quên mật khẩu',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        SizedBox(height: 8),
        Text(
          'Nhập địa chỉ email để lấy lại mật khẩu',
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
                controller: _emailController,
                label: 'Email',
                icon: Icons.email_outlined,
                validator: (value) {
                  return Validators.validateEmail(value);
                },
              ),
              SizedBox(height: 30),
              buildButton(
                onPressed: _submit,
                buttonText: "GỬI",
              ),
            ],
          ),
        ),
      ],
    );
  }
}
