import 'package:cms_chat_app/components/background.dart';
import 'package:cms_chat_app/components/button.dart';
import 'package:cms_chat_app/components/custom_toast.dart';
import 'package:cms_chat_app/components/input_field.dart';
import 'package:cms_chat_app/models/response_dto.dart';
import 'package:cms_chat_app/services/loading_service.dart';
import 'package:cms_chat_app/views/forgot_password_screen.dart';
import 'package:flutter/material.dart';
import 'package:cms_chat_app/services/user_service.dart';
import 'package:cms_chat_app/core/validators.dart';
import 'package:cms_chat_app/views/home_screen.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _loginService = UserService();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isPasswordVisible = false;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (_formKey.currentState?.validate() ?? false) {
      LoadingService.show();
      ResponseDto dto = await _loginService.login(
        _usernameController.text,
        _passwordController.text,
      );
      LoadingService.hide();
      if (dto.result) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => HomeScreen()),
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
      showBackButton: false,
      children: [
        Image.asset(
          'assets/cookiedu_logo.png',
          width: 120,
          height: 120,
        ),
        SizedBox(height: 20),
        Text(
          'CMS - Zalo UTE',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        SizedBox(height: 8),
        Text(
          'Vui lòng đăng nhập để tiếp tục',
          style: TextStyle(
            fontSize: 16,
            color: Colors.white.withOpacity(0.8),
          ),
        ),
        SizedBox(height: 50),
        Form(
          key: _formKey,
          child: Column(
            children: [
              buildInputField(
                controller: _usernameController,
                label: 'Tên tài khoản',
                icon: Icons.person_outline,
                validator: (value) {
                  return Validators.validateField(value);
                },
              ),
              SizedBox(height: 20),
              buildInputField(
                controller: _passwordController,
                label: 'Mật khẩu',
                icon: Icons.lock_outline,
                isPassword: true,
                isPasswordVisible: _isPasswordVisible,
                onTogglePassword: () {
                  setState(() => _isPasswordVisible = !_isPasswordVisible);
                },
                validator: (value) {
                  return Validators.validateField(value);
                },
              ),
              SizedBox(height: 30),
              buildButton(
                onPressed: _login,
                buttonText: "ĐĂNG NHẬP",
              ),
              SizedBox(height: 20),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => ForgotPasswordScreen()),
                  );
                },
                child: Text(
                  'Quên mật khẩu?',
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
