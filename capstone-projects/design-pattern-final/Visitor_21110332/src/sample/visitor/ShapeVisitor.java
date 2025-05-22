package sample.visitor;

public interface ShapeVisitor {
	void visitCircle(Circle circle);

	void visitSquare(Square square);

	void visitTriangle(Triangle triangle);
}