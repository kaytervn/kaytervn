package sample.state;

public class OpenState implements DoorState {

	@Override
	public void click(Door door) {
		door.setState(new ClosingState());
	}

	@Override
	public void complete(Door door) {
	}

	@Override
	public void timeout(Door door) {
		System.out.println("Door is opened");
	}
}