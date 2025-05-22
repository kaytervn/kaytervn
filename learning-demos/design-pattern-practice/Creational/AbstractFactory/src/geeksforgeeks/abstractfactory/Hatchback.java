package geeksforgeeks.abstractfactory;

// Concrete Product for Hatchback Car
class Hatchback implements Car {
	public void assemble() {
		System.out.println("Assembling Hatchback car.");
	}
}