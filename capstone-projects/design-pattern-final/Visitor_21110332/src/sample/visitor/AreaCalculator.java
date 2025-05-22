package sample.visitor;

public class AreaCalculator implements ShapeVisitor {
	@Override
	public void visitCircle(Circle circle) {
		double area = Math.PI * circle.radius * circle.radius;
		System.out.println("Circle area = " + area);
	}

	@Override
	public void visitSquare(Square square) {
		double area = square.side * square.side;
		System.out.println("Square area = " + area);
	}

	@Override
	public void visitTriangle(Triangle triangle) {
		double area = triangle.base * triangle.height / 2;
		System.out.println("Triangle area = " + area);
	}
}