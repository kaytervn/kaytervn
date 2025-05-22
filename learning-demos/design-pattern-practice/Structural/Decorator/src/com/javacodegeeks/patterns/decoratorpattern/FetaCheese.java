package com.javacodegeeks.patterns.decoratorpattern;

public class FetaCheese extends PizzaDecorator {

	private final Pizza pizza;

	public FetaCheese(Pizza pizza) {
		this.pizza = pizza;
	}

	@Override
	public String getDesc() {
		return pizza.getDesc() + ", Feta Cheese (25.88)";
	}

	@Override
	public double getPrice() {
		return pizza.getPrice() + 25.88;
	}

}