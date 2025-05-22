package personal.cor;

public class Airplane extends TransportHandler {

	private static final int MIN_SIZE = 31;

	@Override
	protected boolean isAcceptable(int passengers) {
		return passengers >= MIN_SIZE;
	}

	@Override
	protected void depart(TravelRequest request) {
		System.out.println("The airplane is departing with a load of " + request.getPassengers() + " passengers.");
		System.out.println("---");
	}
}