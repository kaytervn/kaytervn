package sample.visitor;

public class VisitorPatternExample {
	public static void main(String[] args) {
		Shape circle = new Circle(5.0);
		Shape square = new Square(4.0);
		Shape triangle = new Triangle(3.0, 4.0);

		ShapeVisitor shapeDrawer = new ShapeDrawer();
		ShapeVisitor areaCalculator = new AreaCalculator();

		circle.accept(shapeDrawer);
		circle.accept(areaCalculator);

		System.out.println("---");

		square.accept(shapeDrawer);
		square.accept(areaCalculator);

		System.out.println("---");

		triangle.accept(shapeDrawer);
		triangle.accept(areaCalculator);
	}
}