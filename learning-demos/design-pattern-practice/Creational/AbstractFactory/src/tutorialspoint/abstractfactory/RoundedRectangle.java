package tutorialspoint.abstractfactory;

public class RoundedRectangle implements Shape {
	@Override
	public void draw() {
		System.out.println("Inside RoundedRectangle::draw() method.");
	}
}