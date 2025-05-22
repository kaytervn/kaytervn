package personal.strategy;

public class MotobikeStrategy implements TransportStrategy {

	@Override
	public void transport(int mass) {
		if (mass <= 50) {
			System.out.println("Parcels with a mass of " + mass + " kg are transporting by motobike.");
		} else {
			System.out.println("Parcels with a mass of " + mass + " kg are OVERWEIGHT for transportation by motobike.");
		}
		System.out.println("---");
	};
}