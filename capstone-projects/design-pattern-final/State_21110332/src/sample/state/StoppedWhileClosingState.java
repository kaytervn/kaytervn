package sample.state;

public class StoppedWhileClosingState implements DoorState {

	@Override
	public void click(Door door) {
		door.setState(new ClosingState());
	}

	@Override
	public void complete(Door door) {
	}

	@Override
	public void timeout(Door door) {
		System.out.println("Door is stopped while closing");
	}
}