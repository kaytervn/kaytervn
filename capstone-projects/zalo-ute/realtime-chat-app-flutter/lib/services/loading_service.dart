import 'package:cms_chat_app/components/loading_dialog.dart';
import 'package:flutter/material.dart';

class LoadingService {
  static BuildContext? _context;
  static bool _isLoading = false;
  static bool get isLoading => _isLoading;

  static void init(BuildContext context) {
    _context = context;
  }

  static void show() {
    if (_context != null && !_isLoading) {
      _isLoading = true;
      LoadingDialog.show(_context!);
    }
  }

  static void hide() {
    if (_context != null && _isLoading) {
      _isLoading = false;
      LoadingDialog.hide(_context!);
    }
  }
}
