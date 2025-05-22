package sample.state;

public class DoorTest {
	public static void main(String[] args) {
		Door door = new Door();
		door.timeout();
		door.click();
		door.complete();
		door.click();
		door.click();
		door.click();
		door.complete();
	}
}