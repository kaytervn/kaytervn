import 'dart:convert';
import 'package:cms_chat_app/models/response_dto.dart';
import 'package:cms_chat_app/services/api_services.dart';

class PostService {
  final ApiService _apiService = ApiService();

  Future<ResponseDto> list(int status, int page, int size) async {
    final response = await _apiService.get(
      "/v1/post/list",
      queryParams: {
        'status': status.toString(),
        'page': page.toString(),
        'size': size.toString()
      },
      requiresAuth: true,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }

  Future<ResponseDto> changeState(String id, int status, String? reason) async {
    final response = await _apiService.put(
      "/v1/post/change-state",
      {'id': id, 'status': status, 'reason': reason},
      requiresAuth: true,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }

  Future<ResponseDto> delete(String id) async {
    final response = await _apiService.delete(
      "/v1/post/delete/$id",
      requiresAuth: true,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }
}
