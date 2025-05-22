package sample.cor;

public class FeatureRequestHandler implements Handler {
	private Handler next;

	@Override
	public void handleRequest(Request request) {
		if (request.getType() == RequestType.FEATURE) {
			System.out.println("Handling feature request: " + request.getDescription());
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