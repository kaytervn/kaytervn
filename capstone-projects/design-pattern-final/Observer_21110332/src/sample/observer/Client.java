package sample.observer;

public class Client {
	public static void main(String[] args) {
		Stock stock = new Stock();

		Investor investor1 = new Investor("John");
		Investor investor2 = new Investor("Jane");
		Observer observer = new GenericObserver();

		stock.registerObserver(investor1);
		stock.registerObserver(investor2);
		stock.registerObserver(observer);

		stock.setPrice(10.5);
		stock.setPrice(12.0);

		stock.unregisterObserver(investor2);

		stock.setPrice(14.3);
	}
}