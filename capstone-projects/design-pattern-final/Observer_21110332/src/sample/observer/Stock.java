package sample.observer;

import java.util.ArrayList;
import java.util.List;

public class Stock implements Subject {
	private double price;
	private List<Observer> observers = new ArrayList<>();

	public Stock() {
	}

	public void setPrice(double price) {
		this.price = price;
		notifyObservers();
	}

	public double getPrice() {
		return price;
	}

	@Override
	public void registerObserver(Observer observer) {
		observers.add(observer);
	}

	@Override
	public void unregisterObserver(Observer observer) {
		observers.remove(observer);
	}

	@Override
	public void notifyObservers() {
		for (Observer observer : observers) {
			observer.update(price);
		}
	}
}