import 'package:flutter/material.dart';

Widget buildCenterLoading() {
  return Container(
    color: Colors.grey[100],
    child: Center(
      child: CircularProgressIndicator(
        color: Color(0xFF1565C0),
      ),
    ),
  );
}
