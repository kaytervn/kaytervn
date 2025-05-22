package techcrashcourse.state;

public class OffState implements State {

	@Override
	public void toggle(Switch sw) {
		// Write OffState specific code here
		System.out.println("Switch is in OFF State.. Turning it ON");
		sw.setState(new OnState());
	}
}