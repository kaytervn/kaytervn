package sample.mediator;

public class Tester extends Colleague {
	public Tester(Mediator mediator) {
		super(mediator);
	}

	@Override
	public void send(String message) {
		System.out.println("Tester is sending the message: " + message);
		mediator.sendMessage(message, this);
	}

	@Override
	public void receive(String message) {
		System.out.println("Tester received the message: " + message);
	}
}