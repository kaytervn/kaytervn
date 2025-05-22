package geeksforgeeks.bridge;

// Concrete implementation 2 for bridge pattern
class Assemble implements Workshop {
	@Override
	public void work() {
		System.out.print(" And");
		System.out.println(" Assembled.");
	}
}