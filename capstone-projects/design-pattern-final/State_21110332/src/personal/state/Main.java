package personal.state;

public class Main {
	public static void main(String[] args) {
		Light light = new Light();

		light.turnOn();
		light.turnOn();
		light.turnOff();
		light.turnOff();
	}
}