package sample.mediator;

public class MediatorDemo {
	public static void main(String[] args) {
		ProjectMediator mediator = new ProjectMediator();

		Developer developer = new Developer(mediator);
		Tester tester = new Tester(mediator);

		mediator.registerDeveloper(developer);
		mediator.registerTester(tester);

		developer.send("The code is ready for testing.");
		tester.send("Great! I'll start testing it right away.");
		tester.send("I found a bug in the code.");
	}
}