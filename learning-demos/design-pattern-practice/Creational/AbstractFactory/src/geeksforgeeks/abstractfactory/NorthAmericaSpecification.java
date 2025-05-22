package geeksforgeeks.abstractfactory;

// Concrete Product for North America Car Specification
class NorthAmericaSpecification implements CarSpecification {
	public void display() {
		System.out.println("North America Car Specification: Safety features compliant with local regulations.");
	}
}