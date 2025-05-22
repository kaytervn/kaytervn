package sample.visitor;

public interface Shape {
	public void accept(ShapeVisitor visitor);
}