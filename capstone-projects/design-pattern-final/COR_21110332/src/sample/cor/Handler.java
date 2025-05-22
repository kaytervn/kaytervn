package sample.cor;

public interface Handler {
	void handleRequest(Request request);

	Handler getNext();

	void setNext(Handler next);
}