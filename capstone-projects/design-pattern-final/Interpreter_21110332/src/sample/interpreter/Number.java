package sample.interpreter;

public class Number implements Expression {
	private int number;

	public Number(int number) {
		this.number = number;
	}

	@Override
	public int interpret(Context context) {
		return number;
	}
}