package personal.cor;

public class Car extends TransportHandler {

	private static final int MAX_SIZE = 6;

	@Override
	protected boolean isAcceptable(int passengers) {
		return passengers <= MAX_SIZE;
	}

	@Override
	protected void depart(TravelRequest request) {
		System.out.println("The car is departing with a load of " + request.getPassengers() + " passengers.");
		System.out.println("---");
	}
}