package sample.cor;

public class MaintenanceRequestHandler implements Handler {
	private Handler next;

	@Override
	public void handleRequest(Request request) {
		if (request.getType() == RequestType.MAINTENANCE) {
			System.out.println("Handling maintenance request: " + request.getDescription());
		} else {
			if (next != null) {
				next.handleRequest(request);
			}
		}
	}

	@Override
	public Handler getNext() {
		return next;
	}

	@Override
	public void setNext(Handler next) {
		this.next = next;
	}
}