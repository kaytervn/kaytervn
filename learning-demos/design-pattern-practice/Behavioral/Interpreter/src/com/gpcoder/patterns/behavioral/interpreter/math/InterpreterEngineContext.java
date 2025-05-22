package com.gpcoder.patterns.behavioral.interpreter.math;

public class InterpreterEngineContext {

	public int add(String input) {
		String[] tokens = interpret(input);
		int total = 0;
		for (int i = 0; i < tokens.length; i++) {
			total += Integer.parseInt(tokens[i]);
		}
		return total;
	}

	public int subtract(String input) {
		String[] tokens = interpret(input);
		int num1 = Integer.parseInt(tokens[0]);
		int num2 = Integer.parseInt(tokens[1]);
		return (num1 - num2);
	}

	private String[] interpret(String input) {
		String str = input.replaceAll("[^0-9]", " ");
		str = str.replaceAll("( )+", " ").trim();
		return str.split(" ");
	}
}