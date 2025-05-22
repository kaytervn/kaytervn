package sample.cor;

public class Request {
	private final RequestType type;
	private final String description;

	public Request(RequestType type, String description) {
		this.type = type;
		this.description = description;
	}

	public RequestType getType() {
		return type;
	}

	public String getDescription() {
		return description;
	}
}