import 'dart:convert';
import 'package:cms_chat_app/models/response_dto.dart';
import 'package:cms_chat_app/services/api_services.dart';

class NotificationService {
  final ApiService _apiService = ApiService();

  Future<ResponseDto> list(int status, int page, int size) async {
    final response = await _apiService.get(
      "/v1/notification/list",
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

  Future<ResponseDto> readAll() async {
    final response = await _apiService.put(
      "/v1/notification/read-all",
      {},
      requiresAuth: true,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }

  Future<ResponseDto> deleteAll() async {
    final response = await _apiService.delete(
      "/v1/notification/delete-all",
      requiresAuth: true,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }

  Future<ResponseDto> readOne(String id) async {
    final response = await _apiService.put(
      "/v1/notification/read/$id",
      {},
      requiresAuth: true,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }

  Future<ResponseDto> deleteOne(String id) async {
    final response = await _apiService.delete(
      "/v1/notification/delete/$id",
      requiresAuth: true,
    );
    final dto = ResponseDto.fromJson(jsonDecode(response.body));
    return dto;
  }
}
