package geeksforgeeks.abstractfactory;

// Concrete Product for Europe Car Specification
class EuropeSpecification implements CarSpecification {
	public void display() {
		System.out.println("Europe Car Specification: Fuel efficiency and emissions compliant with EU standards.");
	}
}