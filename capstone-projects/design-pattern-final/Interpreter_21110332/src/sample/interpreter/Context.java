package sample.interpreter;

import java.util.HashMap;
import java.util.Map;

public class Context {
	private Map<String, Integer> variables = new HashMap<>();

	public void setValue(String name, int value) {
		variables.put(name, value);
	}

	public int getValue(String name) {
		if (variables.containsKey(name)) {
			return variables.get(name);
		}
		throw new RuntimeException("Variable not found: " + name);
	}
}