package personal.interpreter;

public class Client {
	public static void main(String[] args) {
		AbstractExpression expression = new SubtractExpression(
				new AddExpression(new NumberExpression(2), new NumberExpression(3)), new NumberExpression(1));

		int result = expression.interpret();
		System.out.println("Result: " + result);
	}
}