package techcrashcourse.observer;

import java.util.ArrayList;

public class LocationTransponder implements Publisher {
	private int xCordinate, yCordinate;
	private ArrayList<Observer> observerList;

	public LocationTransponder() {
		observerList = new ArrayList<Observer>();
	}

	public void addObserver(Observer o) {
		observerList.add(o);
	}

	public void removeObserver(Observer o) {
		observerList.remove(o);
	}

	public void notifyObservers() {
		for (Observer o : observerList) {
			o.update(xCordinate, yCordinate);
		}
	}

	public void setLocation(int x, int y) {
		this.xCordinate = x;
		this.yCordinate = y;
		notifyObservers();
	}
}