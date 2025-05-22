package sample.strategy;

public class Main {
	public static void main(String[] args) {
		ShoppingCart cart = new ShoppingCart();

		cart.addItem(new Item("Item 1", 10));
		cart.addItem(new Item("Item 2", 20));

		cart.setPaymentStrategy(new CreditCardStrategy("Kien Trong", "1234567890123456", "123", "12/24"));
		cart.checkout();

		cart.setPaymentStrategy(new PayPalStrategy("kienductrong@gmail.com", "trong123"));
		cart.checkout();

		cart.setPaymentStrategy(new BitcoinStrategy("1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"));
		cart.checkout();
	}
}