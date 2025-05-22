package personal.state;

public class OffState implements LightState {
	@Override
	public void turnOn() {
		System.out.println("The light is turned on.");
	}

	@Override
	public void turnOff() {
		System.out.println("The light has already been turned off.");
	}
}