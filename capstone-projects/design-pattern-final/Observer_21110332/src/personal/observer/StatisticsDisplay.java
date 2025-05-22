package personal.observer;

public class StatisticsDisplay implements Observer {
	private float maxTemp = Float.MIN_VALUE;
	private float minTemp = Float.MAX_VALUE;
	private float sumTemp = 0;
	private int tempReadingCount = 0;

	@Override
	public void update(float temperature, float humidity, float pressure) {
		sumTemp += temperature;
		tempReadingCount++;

		if (temperature > maxTemp) {
			maxTemp = temperature;
		}

		if (temperature < minTemp) {
			minTemp = temperature;
		}

		display();
	}

	public void display() {
		System.out.println("Statistics: Max temp = " + maxTemp + "°C, Min temp = " + minTemp + "°C, Avg temp = "
				+ (sumTemp / tempReadingCount) + "°C");
	}
}