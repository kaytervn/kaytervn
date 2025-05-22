package personal.cor;

public abstract class TransportHandler {

	protected TransportHandler nextHandler;

	public void handleDepart(TravelRequest request) {
		System.out.println("Checking for transportation: " + this.getClass().getSimpleName());
		if (this.isAcceptable(request.getPassengers())) {
			this.depart(request);
		} else if (nextHandler != null) {
			System.out.println("Request is rejected.");
			nextHandler.handleDepart(request);
		}
	}

	public void setNext(TransportHandler handler) {
		this.nextHandler = handler;
	}

	protected abstract boolean isAcceptable(int passengers);

	protected abstract void depart(TravelRequest request);
}