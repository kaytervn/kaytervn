import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

Widget buildLineChart(
    List<Map<String, double>> data, Color chartColor, List<String> xLabels) {
  return LineChart(
    LineChartData(
      gridData: FlGridData(show: true),
      titlesData: FlTitlesData(
        leftTitles: AxisTitles(
          sideTitles: SideTitles(
            showTitles: true,
            reservedSize: 40,
            interval: 5,
            getTitlesWidget: (value, _) {
              return Text(
                value.toStringAsFixed(0),
                style: TextStyle(color: chartColor, fontSize: 12),
              );
            },
          ),
        ),
        bottomTitles: AxisTitles(
          sideTitles: SideTitles(
            showTitles: true,
            reservedSize: 30,
            interval: 1,
            getTitlesWidget: (value, _) {
              int index = value.toInt();
              return Text(
                xLabels[index],
                style: TextStyle(color: chartColor, fontSize: 12),
              );
            },
          ),
        ),
      ),
      borderData: FlBorderData(
        show: true,
        border: Border.all(color: chartColor, width: 1),
      ),
      lineBarsData: [
        LineChartBarData(
          spots: data.map((e) => FlSpot(e['x']!, e['y']!)).toList(),
          isCurved: true,
          color: chartColor,
          belowBarData: BarAreaData(show: false),
          dotData: FlDotData(show: false),
        ),
      ],
    ),
  );
}

Widget buildBarChart(
    List<Map<String, double>> data, dynamic chartColor, List<String> xLabels) {
  return BarChart(
    BarChartData(
      borderData: FlBorderData(
        show: true,
        border: Border.all(color: chartColor, width: 1),
      ),
      barGroups: data.map((e) {
        return BarChartGroupData(
          x: e['x']!.toInt(),
          barRods: [
            BarChartRodData(
              toY: e['y']!,
              color: chartColor,
              width: 16,
              borderRadius: BorderRadius.circular(6),
            ),
          ],
        );
      }).toList(),
      titlesData: FlTitlesData(
        leftTitles: AxisTitles(
          sideTitles: SideTitles(
            showTitles: true,
            reservedSize: 40,
            interval: 5,
            getTitlesWidget: (value, _) {
              return Text(
                value.toStringAsFixed(0),
                style: TextStyle(color: chartColor, fontSize: 12),
              );
            },
          ),
        ),
        bottomTitles: AxisTitles(
          sideTitles: SideTitles(
            showTitles: true,
            reservedSize: 30,
            interval: 1,
            getTitlesWidget: (value, _) {
              int index = value.toInt();
              return Text(
                xLabels[index],
                style: TextStyle(color: chartColor, fontSize: 12),
              );
            },
          ),
        ),
      ),
      gridData: FlGridData(show: false),
    ),
  );
}

Widget buildPieChart(List<Map<String, dynamic>> data, Color chartColor) {
  double totalValue = data.fold(0.0, (sum, e) => sum + (e['value'] ?? 0));
  return Column(
    children: [
      SizedBox(
        height: 200,
        child: PieChart(
          PieChartData(
            sectionsSpace: 2,
            centerSpaceRadius: 40,
            sections: data.map((e) {
              return PieChartSectionData(
                value: e['value'],
                color: e['color'] ?? chartColor,
                radius: 50,
              );
            }).toList(),
          ),
        ),
      ),
      const SizedBox(height: 10),
      Wrap(
        spacing: 15,
        runSpacing: 8,
        children: data.map((e) {
          double percentage = (e['value'] ?? 0) / totalValue * 100;
          return Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 12,
                height: 12,
                color: e['color'] ?? chartColor,
              ),
              const SizedBox(width: 2),
              Text(
                '${e['title']} (${percentage.toStringAsFixed(1)}%)',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          );
        }).toList(),
      ),
    ],
  );
}

Widget buildChartCard(String title, Widget chartWidget) {
  return Card(
    elevation: 5,
    color: Colors.white,
    shadowColor: Colors.blue.withOpacity(0.5),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
    margin: const EdgeInsets.symmetric(horizontal: 20),
    child: Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title.isNotEmpty)
            Text(
              title,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.blue[600],
              ),
            ),
          const SizedBox(height: 20),
          SizedBox(
            height: 250,
            child: chartWidget,
          ),
        ],
      ),
    ),
  );
}
