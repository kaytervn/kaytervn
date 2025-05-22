package personal.state;

public class Light {
	private LightState state;

	public Light() {
		state = new OffState();
	}

	public void setState(LightState state) {
		this.state = state;
	}

	public void turnOn() {
		state.turnOn();
		setState(new OnState());
	}

	public void turnOff() {
		state.turnOff();
		setState(new OffState());
	}
}