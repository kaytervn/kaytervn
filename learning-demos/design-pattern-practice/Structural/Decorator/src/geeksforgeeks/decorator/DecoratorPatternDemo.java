package geeksforgeeks.decorator;
// DecoratorPatternDemo.java

// Class
// Main class
public class DecoratorPatternDemo {

	// Main driver method
	public static void main(String[] args) {
		// Creating an object of Shape interface
		// inside the main() method
		Shape circle = new Circle();

		Shape redCircle = new RedShapeDecorator(new Circle());

		Shape redRectangle = new RedShapeDecorator(new Rectangle());

		// Display message
		System.out.println("Circle with normal border");

		// Calling the draw method over the
		// object calls as created in
		// above classes

		// Call 1
		circle.draw();

		// Display message
		System.out.println("\nCircle of red border");

		// Call 2
		redCircle.draw();

		// Display message
		System.out.println("\nRectangle of red border");

		// Call 3
		redRectangle.draw();
	}
}
