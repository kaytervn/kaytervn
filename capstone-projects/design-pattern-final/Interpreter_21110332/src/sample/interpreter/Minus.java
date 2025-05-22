package sample.interpreter;

public class Minus implements Expression {
	private Expression leftOperand;
	private Expression rightOperand;

	public Minus(Expression leftOperand, Expression rightOperand) {
		this.leftOperand = leftOperand;
		this.rightOperand = rightOperand;
	}

	@Override
	public int interpret(Context context) {
		return leftOperand.interpret(context) - rightOperand.interpret(context);
	}
}