package sample.observer;

public class Investor implements Observer {
	private String name;

	public Investor(String name) {
		this.name = name;
	}

	@Override
	public void update(double price) {
		System.out.println("Investor " + name + ": Stock price updated to " + price);
	}
}