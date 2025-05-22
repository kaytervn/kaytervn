package geeksforgeeks.singleton.ex2;

// Class 2
// Main class
class GFG {
	// Main driver method
	public static void main(String args[]) {
		// Instantiating Singleton class with variable x
		Singleton x = Singleton.Singleton();

		// Instantiating Singleton class with variable y
		Singleton y = Singleton.Singleton();

		// instantiating Singleton class with variable z
		Singleton z = Singleton.Singleton();

		// Now changing variable of instance x
		// via toUpperCase() method
		x.s = (x.s).toUpperCase();

		// Print and display commands
		System.out.println("String from x is " + x.s);
		System.out.println("String from y is " + y.s);
		System.out.println("String from z is " + z.s);
		System.out.println("\n");

		// Now again changing variable of instance z
		z.s = (z.s).toLowerCase();

		System.out.println("String from x is " + x.s);
		System.out.println("String from y is " + y.s);
		System.out.println("String from z is " + z.s);
	}
}