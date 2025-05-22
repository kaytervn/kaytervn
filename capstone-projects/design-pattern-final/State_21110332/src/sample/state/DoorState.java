package sample.state;

public interface DoorState {
	void click(Door door);

	void complete(Door door);

	void timeout(Door door);
}