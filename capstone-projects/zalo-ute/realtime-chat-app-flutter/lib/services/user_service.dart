import 'dart:convert';
import 'package:cms_chat_app/services/api_services.dart';
import 'package:cms_chat_app/models/response_dto.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserService {
  final ApiService _apiService = ApiService();

  Future<ResponseDto> login(String username, String password) async {
    final response = await _apiService.post(
      "/v1/user/login-admin",
      {'username': username, 'password': password},
      requiresAuth: false,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    if (dto.result) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('accessToken', dto.data['accessToken']);
      return dto;
    }
    return dto;
  }

  Future<ResponseDto> forgotPassword(String email) async {
    final response = await _apiService.post(
      "/v1/user/forgot-password",
      {'email': email},
      requiresAuth: false,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }

  Future<ResponseDto> resetPassword(
      String email, String newPassword, String otp) async {
    final response = await _apiService.post(
      "/v1/user/reset-password",
      {'email': email, 'newPassword': newPassword, 'otp': otp},
      requiresAuth: false,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }

  Future<ResponseDto> getProfile() async {
    final response = await _apiService.get(
      "/v1/user/profile",
      requiresAuth: true,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('accessToken');
  }

  Future<bool> verifyToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('accessToken');
    if (token == null) {
      await prefs.remove('accessToken');
      return false;
    }
    try {
      final response = await _apiService.post(
        '/v1/user/verify-token',
        {'accessToken': token},
        requiresAuth: false,
      );
      if (response.statusCode == 200) {
        return true;
      }
    } catch (ignored) {}
    await prefs.remove('accessToken');
    return false;
  }

  Future<ResponseDto> updateProfile(
      String displayName,
      String? birthDate,
      String? bio,
      String? avatarUrl,
      String? currentPassword,
      String? newPassword) async {
    final response = await _apiService.put(
      "/v1/user/update-profile",
      {
        'displayName': displayName,
        'birthDate': birthDate,
        'bio': bio,
        'avatarUrl': avatarUrl,
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      },
      requiresAuth: true,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }
}
