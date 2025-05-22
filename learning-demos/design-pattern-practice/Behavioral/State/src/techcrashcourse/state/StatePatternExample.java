package techcrashcourse.state;

public class StatePatternExample {
	public static void main(String args[]) {
		Switch sw = new Switch(new OnState());

		// Changing the state of switch
		sw.toggleSwitch(); // OFF
		sw.toggleSwitch(); // ON
		sw.toggleSwitch(); // OFF
		// Overriding the state of the swith to ON
		sw.setState(new OnState());
		sw.toggleSwitch(); // OFF
		sw.toggleSwitch(); // ON
	}
}