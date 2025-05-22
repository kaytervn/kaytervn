package personal.cor;

public class Bus extends TransportHandler {

	private static final int MIN_SIZE = 7;
	private static final int MAX_SIZE = 30;

	@Override
	protected boolean isAcceptable(int passengers) {
		return passengers >= MIN_SIZE && passengers <= MAX_SIZE;
	}

	@Override
	protected void depart(TravelRequest request) {
		System.out.println("The bus is departing with a load of " + request.getPassengers() + " passengers.");
		System.out.println("---");
	}
}