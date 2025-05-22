package sample.interpreter;

public class Variable implements Expression {
	private String name;

	public Variable(String name) {
		this.name = name;
	}

	@Override
	public int interpret(Context context) {
		return context.getValue(name);
	}
}