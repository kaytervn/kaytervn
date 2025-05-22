package sample.state;

public class ClosingState implements DoorState {

	@Override
	public void click(Door door) {
		door.setState(new StoppedWhileClosingState());
	}

	@Override
	public void complete(Door door) {
		door.setState(new ClosedState());
	}

	@Override
	public void timeout(Door door) {
		System.out.println("Door is closing");
	}
}