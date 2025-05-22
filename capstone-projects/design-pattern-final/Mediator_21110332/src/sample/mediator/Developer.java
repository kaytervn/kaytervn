package sample.mediator;

public class Developer extends Colleague {
	public Developer(Mediator mediator) {
		super(mediator);
	}

	@Override
	public void send(String message) {
		System.out.println("Developer is sending the message: " + message);
		mediator.sendMessage(message, this);
	}

	@Override
	public void receive(String message) {
		System.out.println("Developer received the message: " + message);
	}
}