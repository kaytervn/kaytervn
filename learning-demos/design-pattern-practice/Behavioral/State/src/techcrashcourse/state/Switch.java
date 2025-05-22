package techcrashcourse.state;

public class Switch {
	private State state;

	public Switch(State state) {
		this.state = state;
	}

	public void setState(State state) {
		this.state = state;
	}

	public void toggleSwitch() {
		state.toggle(this);
	}
}