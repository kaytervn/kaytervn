import 'dart:convert';
import 'package:cms_chat_app/models/response_dto.dart';
import 'package:cms_chat_app/services/api_services.dart';

class SettingService {
  final ApiService _apiService = ApiService();

  Future<ResponseDto> list(int roleKind, int page, int size) async {
    final response = await _apiService.get(
      "/v1/setting/list",
      queryParams: {
        'roleKind': roleKind.toString(),
        'page': page.toString(),
        'size': size.toString()
      },
      requiresAuth: true,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }

  Future<ResponseDto> update(String id, int value) async {
    final response = await _apiService.put(
      "/v1/setting/update",
      {'id': id, 'value': value},
      requiresAuth: true,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }
}
