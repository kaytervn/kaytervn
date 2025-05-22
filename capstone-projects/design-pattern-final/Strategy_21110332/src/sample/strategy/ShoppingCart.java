package sample.strategy;

import java.util.ArrayList;
import java.util.List;

public class ShoppingCart {
	private List<Item> items;
	private PaymentStrategy paymentStrategy;

	public ShoppingCart() {
		this.items = new ArrayList<>();
	}

	public void addItem(Item item) {
		items.add(item);
	}

	public void checkout() {
		int total = 0;
		for (Item item : items) {
			total += item.getPrice();
		}
		paymentStrategy.pay(total);
	}

	public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
		this.paymentStrategy = paymentStrategy;
	}
}