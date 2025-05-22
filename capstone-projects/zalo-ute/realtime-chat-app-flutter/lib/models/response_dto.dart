class ResponseDto {
  final bool result;
  final String message;
  final dynamic data;

  ResponseDto({
    required this.result,
    String? message,
    this.data,
  }) : message = message ?? "";

  factory ResponseDto.fromJson(Map<String, dynamic> json) {
    return ResponseDto(
      result: json['result'] ?? false,
      message: json['message'] as String?,
      data: json['data'],
    );
  }
}
