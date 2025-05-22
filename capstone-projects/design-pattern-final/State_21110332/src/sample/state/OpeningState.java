package sample.state;

public class OpeningState implements DoorState {

	@Override
	public void click(Door door) {
        door.setState(new StoppedWhileOpeningState());
	}

	@Override
	public void complete(Door door) {
		door.setState(new OpenState());
	}

	@Override
	public void timeout(Door door) {
		System.out.println("Door is opening");
	}

}