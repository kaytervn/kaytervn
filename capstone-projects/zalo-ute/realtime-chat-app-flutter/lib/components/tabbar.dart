import 'package:flutter/material.dart';

Widget buildTabBarContainer(
  Color primaryColor,
  Color secondaryColor,
  TabController tabController,
  List<String> tabTitles,
  BuildContext context,
  double paddingHorizontal,
) {
  final screenWidth = MediaQuery.of(context).size.width;
  return Container(
    width: screenWidth,
    padding: const EdgeInsets.symmetric(vertical: 10),
    color: primaryColor,
    child: SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: TabBar(
        controller: tabController,
        isScrollable: true,
        dividerColor: Colors.transparent,
        indicator: BoxDecoration(
          color: secondaryColor,
          borderRadius: BorderRadius.circular(15),
        ),
        labelColor: Colors.white,
        unselectedLabelColor: Colors.blue[300],
        labelStyle: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
        unselectedLabelStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
        tabs: tabTitles.map((title) {
          return Padding(
            padding: EdgeInsets.symmetric(horizontal: paddingHorizontal),
            child: Tab(text: title),
          );
        }).toList(),
      ),
    ),
  );
}
