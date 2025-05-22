package geeksforgeeks.prototype;

// Prototype interface
interface Shape {
	Shape clone(); // Make a copy of itself

	void draw(); // Draw the shape
}