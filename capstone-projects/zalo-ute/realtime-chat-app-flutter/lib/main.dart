import 'package:flutter/material.dart';
import 'views/loading_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CMS - Zalo UTE',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: LoadingScreen(),
    );
  }
}
