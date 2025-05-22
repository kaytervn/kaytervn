package sample.cor;

public class TechnicalSupportHandler implements Handler {
	private Handler next;

	@Override
	public void handleRequest(Request request) {
		if (request.getType() == RequestType.TECHNICAL) {
			System.out.println("Handling technical support request: " + request.getDescription());
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