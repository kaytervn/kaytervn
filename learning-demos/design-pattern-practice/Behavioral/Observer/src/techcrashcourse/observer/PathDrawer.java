package techcrashcourse.observer;

public class PathDrawer implements Observer {
	private int currentX, currentY;

	public void update(int xCordinate, int yCordinate) {
		if (currentX != xCordinate || currentY != yCordinate) {
			System.out.println(
					"Draw Line from  (" + currentX + ", " + currentY + ") to (" + xCordinate + ", " + yCordinate + ")");
		} else {
			System.out.println("No Change in Position !!!!");
		}
		this.currentX = xCordinate;
		this.currentY = yCordinate;
	}
}