package sample.strategy;

public class BitcoinStrategy implements PaymentStrategy {
	private String walletAddress;

	public BitcoinStrategy(String walletAddress) {
		this.walletAddress = walletAddress;
	}

	@Override
	public void pay(int amount) {
		System.out.println(amount + " units paid with Bitcoin.");
		System.out.println("Wallet Address: " + walletAddress);
		System.out.println("---");
	}
}