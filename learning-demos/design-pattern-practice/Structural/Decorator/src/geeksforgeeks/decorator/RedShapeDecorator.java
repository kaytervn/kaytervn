package geeksforgeeks.decorator;

// Class 3
// Concrete class extending the abstract class
// RedShapeDecorator.java
public class RedShapeDecorator extends ShapeDecorator {

	public RedShapeDecorator(Shape decoratedShape) {
		super(decoratedShape);
	}

	@Override
	public void draw() {
		decoratedShape.draw();
		setRedBorder(decoratedShape);
	}

	private void setRedBorder(Shape decoratedShape) {
		// Display message whenever function is called
		System.out.println("Border Color: Red");
	}
}
