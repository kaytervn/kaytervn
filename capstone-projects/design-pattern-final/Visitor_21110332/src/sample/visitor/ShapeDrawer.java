package sample.visitor;

public class ShapeDrawer implements ShapeVisitor {
	@Override
	public void visitCircle(Circle circle) {
		System.out.println("Drawing circle:");
		System.out.println("- radius = " + circle.radius);
	}

	@Override
	public void visitSquare(Square square) {
		System.out.println("Drawing square:");
		System.out.println("- side = " + square.side);
	}

	@Override
	public void visitTriangle(Triangle triangle) {
		System.out.println("Drawing triangle:");
		System.out.println("- base = " + triangle.base);
		System.out.println("- height = " + triangle.height);
	}
}