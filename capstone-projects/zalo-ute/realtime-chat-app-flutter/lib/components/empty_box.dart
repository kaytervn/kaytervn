import 'package:flutter/material.dart';

Widget buidEmptyBox() {
  return Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      Image.asset('assets/empty_box.png',
          fit: BoxFit.contain, width: 100, height: 100),
      SizedBox(height: 10),
      Text(
        'Không có dữ liệu',
        style: TextStyle(fontSize: 20, color: Colors.grey),
      ),
    ],
  );
}
