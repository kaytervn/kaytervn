package sample.interpreter;

public class InterpreterExample {
	public static void main(String[] args) {
		Context context = new Context();
		context.setValue("x", 5);
		context.setValue("y", 10);

		Expression expression = new Plus(new Variable("x"), new Minus(new Variable("y"), new Number(3)));

		int result = expression.interpret(context);
		System.out.println("Result: " + result);
	}
}