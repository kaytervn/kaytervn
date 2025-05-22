package geeksforgeeks.interpreter;

public class Client {
	public static void main(String[] args) {
		// Input expression
		String expression = "2 + 3 * 4";

		// Create interpreter
		Context context = new Context();
		Interpreter interpreter = new Interpreter(context);

		// Interpret expression
		int result = interpreter.interpret(expression);
		System.out.println("Result: " + result);
	}
}