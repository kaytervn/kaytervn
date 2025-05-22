package geeksforgeeks.abstractfactory;

// Concrete Product for Sedan Car
class Sedan implements Car {
	public void assemble() {
		System.out.println("Assembling Sedan car.");
	}
}