package techcrashcourse.observer;

public class LocationTracker implements Observer {
	private int currentX, currentY;

	public void update(int xCordinate, int yCordinate) {
		this.currentX = xCordinate;
		this.currentY = yCordinate;
		System.out.println("Current location of publisher is (" + currentX + ", " + currentY + ")");
	}
}