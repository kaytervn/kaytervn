package personal.strategy;

public class CarStrategy implements TransportStrategy {

	@Override
	public void transport(int mass) {
		if (mass <= 350) {
			System.out.println("Parcels with a mass of " + mass + " kg are transporting by car.");
		} else {
			System.out.println("Parcels with a mass of " + mass + " kg are OVERWEIGHT for transportation by car.");
		}
		System.out.println("---");
	}
}