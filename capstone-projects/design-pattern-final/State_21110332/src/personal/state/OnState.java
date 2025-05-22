package personal.state;

public class OnState implements LightState {
	@Override
	public void turnOn() {
		System.out.println("The light has already been turned on.");
	}

	@Override
	public void turnOff() {
		System.out.println("The light is turned off.");
	}
}