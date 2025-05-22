import 'package:flutter/material.dart';

Widget buidLoadingContainer(Color color) {
  return Container(
    color: Colors.black26,
    child: Center(
      child: CircularProgressIndicator(
        valueColor: AlwaysStoppedAnimation<Color>(color),
      ),
    ),
  );
}
