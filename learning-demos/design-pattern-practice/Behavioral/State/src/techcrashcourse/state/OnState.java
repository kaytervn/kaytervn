package techcrashcourse.state;

public class OnState implements State {
	@Override
	public void toggle(Switch sw) {
		// Write OnState specific code here
		System.out.println("Switch is in ON State.. Turning it OFF");
		sw.setState(new OffState());
	}
}
