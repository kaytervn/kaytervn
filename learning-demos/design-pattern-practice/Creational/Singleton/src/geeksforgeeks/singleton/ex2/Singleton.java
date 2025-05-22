package geeksforgeeks.singleton.ex2;
// Java program implementing Singleton class

// with method name as that of class

// Class 1
// Helper class
class Singleton {
	// Static variable single_instance of type Singleton
	private static Singleton single_instance = null;

	// Declaring a variable of type String
	public String s;

	// Constructor of this class
	// Here private constructor is used to
	// restricted to this class itself
	private Singleton() {
		s = "Hello I am a string part of Singleton class";
	}

	// Method
	// Static method to create instance of Singleton class
	public static Singleton Singleton() {
		// To ensure only one instance is created
		if (single_instance == null) {
			single_instance = new Singleton();
		}
		return single_instance;
	}
}
