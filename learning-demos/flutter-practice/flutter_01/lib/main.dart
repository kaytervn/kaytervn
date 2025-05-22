import 'package:flutter/material.dart';
import 'package:flutter_01/login.dart';
import 'package:flutter_01/team_intro.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Excercies',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => TeamIntroScreen(),
        '/login': (context) => LoginScreen(),
      },
    );
  }
}
