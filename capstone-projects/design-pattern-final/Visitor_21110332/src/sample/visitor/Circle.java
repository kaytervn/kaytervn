package sample.visitor;

public class Circle implements Shape {
	double radius;

	public Circle(double radius) {
		this.radius = radius;
	}

	@Override
	public void accept(ShapeVisitor visitor) {
		visitor.visitCircle(this);
	}
}
