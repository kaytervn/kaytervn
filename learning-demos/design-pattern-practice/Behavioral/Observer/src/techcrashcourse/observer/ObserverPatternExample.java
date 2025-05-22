package techcrashcourse.observer;

public class ObserverPatternExample {
	public static void main(String args[]) {
		LocationTransponder subject = new LocationTransponder();

		Observer locationTracker = new LocationTracker();
		Observer pathDrawer = new PathDrawer();

		subject.addObserver(locationTracker);
		subject.addObserver(pathDrawer);

		// Changing state of the publisher(subject)
		subject.setLocation(2, 3);
		subject.setLocation(5, 10);
		subject.setLocation(5, 10);
	}
}