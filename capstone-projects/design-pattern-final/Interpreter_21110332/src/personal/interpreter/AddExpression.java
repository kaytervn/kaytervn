package personal.interpreter;

public class AddExpression implements AbstractExpression {
	private AbstractExpression left;
	private AbstractExpression right;

	public AddExpression(AbstractExpression left, AbstractExpression right) {
		this.left = left;
		this.right = right;
	}

	@Override
	public int interpret() {
		return left.interpret() + right.interpret();
	}
}