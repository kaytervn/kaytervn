package sample.observer;

public class GenericObserver implements Observer {
	@Override
	public void update(double price) {
		System.out.println("Generic observer: Stock price updated to " + price);
	}
}