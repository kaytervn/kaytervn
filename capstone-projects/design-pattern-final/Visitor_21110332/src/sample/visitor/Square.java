package sample.visitor;

public class Square implements Shape {
	double side;

	public Square(double side) {
		this.side = side;
	}

	@Override
	public void accept(ShapeVisitor visitor) {
		visitor.visitSquare(this);
	}
}