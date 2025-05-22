package com.javacodegeeks.patterns.decoratorpattern;

public abstract class PizzaDecorator implements Pizza {

	@Override
	public String getDesc() {
		return "Toppings";
	}

}