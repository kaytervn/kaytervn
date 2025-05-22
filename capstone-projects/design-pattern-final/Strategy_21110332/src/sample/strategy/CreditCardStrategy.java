package sample.strategy;

public class CreditCardStrategy implements PaymentStrategy {
	private String name;
	private String cardNumber;
	private String cvv;
	private String dateOfExpiry;

	public CreditCardStrategy(String name, String cardNumber, String cvv, String dateOfExpiry) {
		this.name = name;
		this.cardNumber = cardNumber;
		this.cvv = cvv;
		this.dateOfExpiry = dateOfExpiry;
	}

	@Override
	public void pay(int amount) {
		System.out.println(amount + " units paid with credit card.");
		System.out.println("Name: " + name);
		System.out.println("Card Number: " + cardNumber);
		System.out.println("CVV: " + cvv);
		System.out.println("Date Of Expiry: " + dateOfExpiry);
		System.out.println("---");
	}
}