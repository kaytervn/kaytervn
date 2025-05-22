package personal.strategy;

public class TruckStrategy implements TransportStrategy {

	@Override
	public void transport(int mass) {
		if (mass <= 2000) {
			System.out.println("Parcels with a mass of " + mass + " kg are transporting by truck.");
		} else {
			System.out.println("Parcels with a mass of " + mass + " kg are OVERWEIGHT for transportation by truck.");
		}
		System.out.println("---");
	}
}