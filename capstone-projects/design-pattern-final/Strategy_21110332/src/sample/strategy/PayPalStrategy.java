package sample.strategy;

public class PayPalStrategy implements PaymentStrategy {
	private String emailId;
	private String password;

	public PayPalStrategy(String emailId, String password) {
		this.emailId = emailId;
		this.password = password;
	}

	@Override
	public void pay(int amount) {
		System.out.println(amount + " units paid using PayPal.");
		System.out.println("Email ID: " + emailId);
		System.out.println("password: " + password);
		System.out.println("---");
	}
}