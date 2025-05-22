import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:cms_chat_app/core/constants.dart';
import 'package:cms_chat_app/models/response_dto.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FileService {
  Future<String> upload(File imageFile) async {
    final uri = Uri.parse('${Constants.remoteUrl}/v1/file/upload');
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('accessToken') ?? '';
    var request = http.MultipartRequest('POST', uri)
      ..headers['Authorization'] = 'Bearer $token'
      ..files.add(
        await http.MultipartFile.fromPath('file', imageFile.path),
      );
    final response = await request.send();
    final responseString = await response.stream.bytesToString();
    final responseJson = jsonDecode(responseString);
    final dto = ResponseDto.fromJson(responseJson);
    if (dto.result) {
      return dto.data["filePath"] as String;
    }
    return "";
  }
}
