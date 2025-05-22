package sample.state;

public class Door {
	private DoorState state;

	public void setState(DoorState state) {
		this.state = state;
	}

	public DoorState getState() {
		return state;
	}

	public Door() {
		this.state = new ClosedState();
	}

	public void click() {
		state.click(this);
		state.timeout(this);
	}

	public void complete() {
		state.complete(this);
		state.timeout(this);
	}

	public void timeout() {
		state.timeout(this);
	}
}