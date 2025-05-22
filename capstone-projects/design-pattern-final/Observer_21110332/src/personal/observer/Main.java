package personal.observer;

public class Main {
	public static void main(String[] args) {
		WeatherData weatherData = new WeatherData();

		CurrentConditionsDisplay currentDisplay = new CurrentConditionsDisplay();
		StatisticsDisplay statisticsDisplay = new StatisticsDisplay();

		weatherData.registerObserver(currentDisplay);
		weatherData.registerObserver(statisticsDisplay);

		weatherData.setMeasurements(25.5f, 65, 1020);
		weatherData.setMeasurements(28.2f, 70, 1015);
		weatherData.setMeasurements(22.1f, 75, 1010);

		weatherData.removeObserver(statisticsDisplay);
		weatherData.setMeasurements(27.4f, 69, 1023);
	}
}