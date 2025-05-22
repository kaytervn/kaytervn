import 'package:cms_chat_app/core/constants.dart';

class Validators {
  static String? validateField(String? value) {
    if (value == null || value.isEmpty) {
      return 'Trường này không được để trống';
    }
    return null;
  }

  static String? validateEmail(String? value) {
    final RegExp regExp = RegExp(Constants.emailPattern);
    if (value == null || value.isEmpty) {
      return 'Email không được để trống';
    }
    if (!regExp.hasMatch(value)) {
      return 'Email không hợp lệ';
    }
    return null;
  }

  static String? validateOtp(String? value) {
    if (value == null || value.isEmpty) {
      return 'OTP không được để trống';
    }
    if (!RegExp(r'^\d{6}$').hasMatch(value)) {
      return 'OTP phải gồm 6 chữ số';
    }
    return null;
  }

  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Mật khẩu không được để trống';
    }
    if (value.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return null;
  }

  static String? validateConfirmPassword(
      String? password, String? confirmPassword) {
    if (confirmPassword == null || confirmPassword.isEmpty) {
      return 'Mật khẩu xác nhận không được để trống';
    }
    if (confirmPassword != password) {
      return 'Mật khẩu xác nhận không trùng khớp';
    }
    return null;
  }
}
