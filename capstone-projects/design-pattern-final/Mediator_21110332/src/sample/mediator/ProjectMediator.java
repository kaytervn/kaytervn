package sample.mediator;

public class ProjectMediator implements Mediator {
	private Developer developer;
	private Tester tester;

	public void registerDeveloper(Developer developer) {
		this.developer = developer;
	}

	public void registerTester(Tester tester) {
		this.tester = tester;
	}

	@Override
	public void sendMessage(String message, Colleague colleague) {
		if (colleague == developer) {
			tester.receive(message);
		} else if (colleague == tester) {
			developer.receive(message);
		}
		System.out.println("---");
	}
}